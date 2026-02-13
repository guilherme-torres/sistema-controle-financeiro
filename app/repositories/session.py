from sqlalchemy.orm import Session
from app.models.session import UserSession
from app.repositories.base import BaseRepository


class UserSessionRepository(BaseRepository):
    def __init__(self, session: Session):
        super().__init__(UserSession, session)