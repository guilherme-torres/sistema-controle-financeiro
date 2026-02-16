from datetime import datetime, timedelta, timezone
from hashlib import sha256
from typing import Optional
from fastapi import Depends, Request, Response
from pwdlib import PasswordHash
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.database import get_db
from app.exceptions.auth import InvalidSession
from app.models.session import UserSession
from app.models.user import User
from app.schemas.auth import AuthData


pwd_context = PasswordHash.recommended()

def get_password_hash(password: str):
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)

def authorize(
    request: Request, 
    response: Response, 
    db: Session = Depends(get_db)
) -> AuthData:
    sid = request.cookies.get("sid")
    if not sid:
        raise InvalidSession
    token_hash = sha256(sid.encode()).hexdigest()
    now = datetime.now(timezone.utc).replace(tzinfo=None)
    query = (
        select(UserSession, User)
        .join(User, UserSession.user_id == User.id)
        .where(UserSession.token == token_hash)
    )
    result = db.execute(query).first()
    def reject_auth(session_obj: Optional[UserSession] = None):
        if session_obj:
            session_obj.revoked = 1
            session_obj.revoked_at = now
            db.commit()
        response.delete_cookie("sid")
        raise InvalidSession
    if not result:
        reject_auth()
    user_session, user = result
    if user_session.revoked == 1:
        reject_auth(user_session)
    if user_session.expires_at < now:
        reject_auth(user_session)
    new_expires_at = now + timedelta(minutes=60)
    user_session.expires_at = new_expires_at
    db.commit()
    response.set_cookie(
        key="sid",
        value=sid,
        httponly=True,
        secure=True,
        samesite="lax",
        expires=new_expires_at.replace(tzinfo=timezone.utc),
        max_age=3600,
    )
    return AuthData(user_id=user.id, sid=sid)