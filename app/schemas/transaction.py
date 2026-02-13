import datetime
from decimal import Decimal
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field
from app.models.category import CategoryType
from app.schemas.account import AccountResponseDTO
from app.schemas.category import CategoryResponseDTO


class TransactionBase(BaseModel):
    category_type: CategoryType
    amount: Decimal = Field(max_digits=10, decimal_places=2)
    category_id: int
    account_id: int
    date: datetime.date


class TransactionCreateDTO(TransactionBase):
    comment: Optional[str] = None


class TransactionResponseDTO(TransactionBase):
    id: int
    category: CategoryResponseDTO
    account: AccountResponseDTO

    model_config = ConfigDict(from_attributes=True)


class TransactionUpdateDTO(BaseModel):
    category_type: Optional[CategoryType] = None
    amount: Optional[Decimal] = Field(None, max_digits=10, decimal_places=2)
    category_id: Optional[int] = None
    account_id: Optional[int] = None
    date: Optional[datetime.date] = None
    comment: Optional[str] = None


class TransactionFilters(BaseModel):
    offset: int = Field(0, ge=0)
    limit: int = Field(10, ge=1)
    category_type: Optional[CategoryType] = None
    category_id: Optional[List[int]] = None
    account_id: Optional[int] = None