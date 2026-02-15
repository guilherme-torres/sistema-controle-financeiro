from datetime import datetime
from typing import Optional
from sqlalchemy import ForeignKey, func, text
from sqlalchemy.orm import Mapped, mapped_column
from app.database import Base


class UserSession(Base):
    __tablename__ = "sessions"

    id: Mapped[int] = mapped_column(primary_key=True)
    token: Mapped[str] = mapped_column(unique=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    expires_at: Mapped[datetime]
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())
    revoked: Mapped[int] = mapped_column(server_default=text("0"))
    revoked_at: Mapped[Optional[datetime]]