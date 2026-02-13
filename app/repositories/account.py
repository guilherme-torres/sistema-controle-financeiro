from sqlalchemy.orm import Session
from app.models.account import Account
from app.repositories.base import BaseRepository


class AccountRepository(BaseRepository):
    def __init__(self, session: Session):
        super().__init__(Account, session)