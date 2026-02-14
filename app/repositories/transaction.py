from typing import Any, Dict, Optional
from sqlalchemy import Sequence, extract, func, select
from sqlalchemy.orm import Session
from app.models.category import Category
from app.models.transaction import Transaction
from app.repositories.base import BaseRepository


class TransactionRepository(BaseRepository):
    def __init__(self, session: Session):
        super().__init__(Transaction, session)

    def _apply_filters(self, query, filter_by: Dict[str, Any]):
        """Método auxiliar para aplicar os filtros comuns"""
        if not filter_by:
            return query
        if 'start_date' in filter_by and filter_by['start_date']:
            query = query.where(self.model.date >= filter_by['start_date'])
        if 'end_date' in filter_by and filter_by['end_date']:
            query = query.where(self.model.date <= filter_by['end_date'])
        if 'month' in filter_by and filter_by['month']:
            query = query.where(extract('month', self.model.date) == filter_by['month'])
        if 'year' in filter_by and filter_by['year']:
            query = query.where(extract('year', self.model.date) == filter_by['year'])
        for key, value in filter_by.items():
            if key in ['start_date', 'end_date', 'month', 'year']:
                continue
            if hasattr(self.model, key):
                if isinstance(value, list):
                    query = query.where(getattr(self.model, key).in_(value))
                else:
                    query = query.where(getattr(self.model, key) == value)
        return query

    def list_all(
        self,
        offset: int = 0,
        limit: int = 100,
        filter_by: Optional[Dict[str, Any]] = None,
        order_by: Optional[Dict[str, str]] = None
    ) -> Sequence[Transaction]:
        query = select(self.model)
        query = self._apply_filters(query, filter_by)
        if order_by:
            for column, direction in order_by.items():
                if hasattr(self.model, column):
                    if direction.lower() == 'desc':
                        query = query.order_by(getattr(self.model, column).desc())
                    else:
                        query = query.order_by(getattr(self.model, column).asc())
        query = query.offset(offset).limit(limit)
        result = self.session.execute(query)
        return result.scalars().all()
    
    def get_summary(self, filter_by: Dict[str, Any]):
        query = select(
            Category,
            func.sum(self.model.amount).label("total")
        ).join(Category, self.model.category_id == Category.id)
        query = self._apply_filters(query, filter_by)
        query = query.group_by(Category.id)
        return self.session.execute(query).all()