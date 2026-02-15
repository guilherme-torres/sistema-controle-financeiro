from sqlalchemy import select
from sqlalchemy.orm import Session
from app.models.session import UserSession
from app.repositories.base import BaseRepository


class UserSessionRepository(BaseRepository):
    def __init__(self, session: Session):
        super().__init__(UserSession, session)

    def find_by_token(self, token: str):
        stmt = select(UserSession).where(UserSession.token == token)
        result = self.session.execute(stmt)
        return result.scalar_one_or_none()