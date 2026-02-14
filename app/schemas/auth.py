from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr


class LoginDTO(BaseModel):
    email: EmailStr
    password: str


class UserSessionResponseDTO(BaseModel):
    session_id: str
    expires_at: datetime


class AuthData(BaseModel):
    user_id: int
    sid: str