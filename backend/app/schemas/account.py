from decimal import Decimal
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field


class AccountBase(BaseModel):
    name: str
    balance: Decimal = Field(max_digits=10, decimal_places=2)
    color: str


class AccountCreateDTO(AccountBase):
    pass


class AccountResponseDTO(AccountBase):
    id: int

    model_config = ConfigDict(from_attributes=True)


class AccountResponseWithTotal(BaseModel):
    total: Decimal = Field(max_digits=10, decimal_places=2)
    accounts: List[AccountResponseDTO]


class AccountUpdateDTO(BaseModel):
    name: Optional[str] = None
    balance: Optional[Decimal] = Field(None, max_digits=10, decimal_places=2)
    color: Optional[str] = None


class AccountFilters(BaseModel):
    offset: int = Field(0, ge=0)
    limit: int = Field(10, ge=1)