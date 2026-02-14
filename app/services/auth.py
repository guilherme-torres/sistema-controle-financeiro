from datetime import datetime, timedelta, UTC
from hashlib import sha256
from secrets import token_urlsafe
from sqlalchemy.orm import Session
from app.exceptions.auth import InvalidCredentials
from app.repositories.session import UserSessionRepository
from app.repositories.user import UserRepository
from app.schemas.auth import LoginDTO
from app.security import verify_password


class AuthService:
    def __init__(
        self,
        session: Session,
        user_repo: UserRepository,
        user_session_repo: UserSessionRepository,
    ):
        self.session = session
        self.user_repo = user_repo
        self.user_session_repo = user_session_repo
        self.session_expires_seconds = 12 * 60 * 60

    def login(self, data: LoginDTO):
        try:
            user = self.user_repo.find_by_email(data.email)
            if not user or not verify_password(data.password, user.password_hash):
                raise InvalidCredentials
            session_id = token_urlsafe(32)
            session_id_hash = sha256(session_id.encode()).hexdigest()
            session_expires_at = datetime.now(UTC) + timedelta(seconds=self.session_expires_seconds)
            user_session = self.user_session_repo.create({
                "token": session_id_hash,
                "user_id": user.id,
                "expires_at": session_expires_at.replace(tzinfo=None)
            })
            self.session.commit()
            self.session.refresh(user_session)
            return session_id
        except Exception as e:
            self.session.rollback()
            raise e

    def logout(self, session_id: str):
        try:
            session_id_hash = sha256(session_id.encode()).hexdigest()
            session = self.user_session_repo.find_by_token(session_id_hash)
            if not session or session.revoked == 1:
                return None
            updated_user_session = self.user_session_repo.update(session.id, {
                "revoked": 1,
                "revoked_at": datetime.now(UTC).replace(tzinfo=None)
            })
            self.session.commit()
            self.session.refresh(updated_user_session)
            return session_id
        except Exception as e:
            self.session.rollback()
            raise e
