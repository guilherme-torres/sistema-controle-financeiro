from sqlalchemy.orm import Session
from app.models.category import Category
from app.repositories.base import BaseRepository


class CategoryRepository(BaseRepository):
    def __init__(self, session: Session):
        super().__init__(Category, session)