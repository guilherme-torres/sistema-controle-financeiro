import datetime
from decimal import Decimal
import enum
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field
from app.models.category import CategoryType
from app.schemas.account import AccountResponseDTO
from app.schemas.category import CategoryResponseDTO
from app.schemas.pagination import Pagination, PaginationResponse


class TransactionBase(BaseModel):
    amount: Decimal = Field(max_digits=10, decimal_places=2)
    category_id: int
    account_id: int
    date: datetime.date


class TransactionCreateDTO(TransactionBase):
    comment: Optional[str] = None


class TransactionResponseDTO(TransactionBase):
    id: int
    comment: Optional[str]
    category_type: CategoryType
    category: CategoryResponseDTO
    account: AccountResponseDTO

    model_config = ConfigDict(from_attributes=True)


class TransactionResponsePagination(PaginationResponse):
    data: List[TransactionResponseDTO]


class TransactionUpdateDTO(BaseModel):
    amount: Optional[Decimal] = Field(None, max_digits=10, decimal_places=2)
    category_id: Optional[int] = None
    account_id: Optional[int] = None
    date: Optional[datetime.date] = None
    comment: Optional[str] = None

class OrderByOptions(enum.Enum):
    date_asc = "date:asc"
    date_desc = "date:desc"
    amount_asc = "amount:asc"
    amount_desc = "amount:desc"

class TransactionFilters(Pagination):
    category_type: Optional[CategoryType] = None
    category_id: Optional[List[int]] = None
    account_id: Optional[int] = None
    order_by: Optional[OrderByOptions] = None
    date: Optional[datetime.date] = None
    start_date: Optional[datetime.date] = None
    end_date: Optional[datetime.date] = None
    month: Optional[int] = None
    year: Optional[int] = None
    summary: bool = False

class TransactionSummaryDTO(BaseModel):
    category_id: int
    category_name: str
    category_type: CategoryType
    category_color: str
    total_amount: float
    percentage: float

class TransactionSummaryWithTotal(BaseModel):
    total: float
    summary: List[TransactionSummaryDTO]