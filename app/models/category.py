import enum
from sqlalchemy import Enum, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from app.database import Base


class CategoryType(enum.Enum):
    EXPENSES = "EXPENSES"
    INCOME = "INCOME"


class Category(Base):
    __tablename__ = "categories"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str]
    category_type: Mapped[CategoryType] = mapped_column(Enum(CategoryType))
    color: Mapped[str]
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))