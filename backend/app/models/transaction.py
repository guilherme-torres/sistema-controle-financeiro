import datetime
from decimal import Decimal
from typing import Optional
from sqlalchemy import Enum, ForeignKey, Numeric
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base
from app.models.category import CategoryType, Category
from app.models.account import Account


class Transaction(Base):
    __tablename__ = "transactions"

    id: Mapped[int] = mapped_column(primary_key=True)
    category_type: Mapped[CategoryType] = mapped_column(Enum(CategoryType))
    amount: Mapped[Decimal] = mapped_column(Numeric(10, 2))
    category_id: Mapped[int] = mapped_column(ForeignKey("categories.id"))
    account_id: Mapped[int] = mapped_column(ForeignKey("accounts.id", ondelete="CASCADE"))
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    date: Mapped[datetime.date]
    comment: Mapped[Optional[str]]

    category: Mapped["Category"] = relationship()
    account: Mapped["Account"] = relationship()