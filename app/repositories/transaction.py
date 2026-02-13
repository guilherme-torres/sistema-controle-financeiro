from sqlalchemy.orm import Session
from app.models.transaction import Transaction
from app.repositories.base import BaseRepository


class TransactionRepository(BaseRepository):
    def __init__(self, session: Session):
        super().__init__(Transaction, session)