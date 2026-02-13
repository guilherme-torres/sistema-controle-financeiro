from typing import Any, Dict, Optional, Generic, Sequence, TypeVar, Type
from sqlalchemy import select
from sqlalchemy.orm import Session


ModelType = TypeVar("ModelType")

class BaseRepository(Generic[ModelType]):
    def __init__(self, model: Type[ModelType], session: Session):
        self.model = model
        self.session = session

    def create(self, data: dict) -> ModelType:
        obj = self.model(**data)
        self.session.add(obj)
        self.session.commit()
        self.session.refresh(obj)
        return obj

    def list_all(
        self,
        offset: int = 0,
        limit: int = 100,
        filter_by: Optional[Dict[str, Any]] = None,
        order_by: Optional[Dict[str, str]] = None
    ) -> Sequence[ModelType]:
        model_columns = {column.name for column in self.model.__table__.columns}
        query = select(self.model)
        if filter_by:
            for key, value in filter_by.items():
                if key in model_columns:
                    if isinstance(value, list):
                        query = query.where(getattr(self.model, key).in_(value))
                    else:
                        query = query.where(getattr(self.model, key) == value)
        if order_by:
            for column, direction in order_by.items():
                if column in model_columns:
                    if direction.lower() == 'desc':
                        query = query.order_by(getattr(self.model, column).desc())
                    else:
                        query = query.order_by(getattr(self.model, column).asc())
        query = query.offset(offset).limit(limit)
        result = self.session.execute(query)
        return result.scalars().all()

    def get(self, id: int) -> Optional[ModelType]:
        return self.session.get(self.model, id)

    def update(self, id: int, data: dict) -> Optional[ModelType]:
        obj = self.get(id)
        if obj is None:
            return None
        for key, value in data.items():
            setattr(obj, key, value)
        self.session.commit()
        self.session.refresh(obj)
        return obj

    def delete(self, id: int) -> bool:
        obj = self.get(id)
        if obj is None:
            return False
        self.session.delete(obj)
        self.session.commit()
        return True