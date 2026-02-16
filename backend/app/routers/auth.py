from datetime import timezone, datetime
from typing import Annotated
from fastapi import APIRouter, Depends, Response
from app.dependencies import get_auth_service
from app.schemas.auth import AuthData, LoginDTO
from app.security import authorize
from app.services.auth import AuthService


router = APIRouter(prefix="/auth", tags=["Auth"])

Service = Annotated[AuthService, Depends(get_auth_service)]

@router.post("/login")
def login(
    data: LoginDTO,
    response: Response,
    service: Service
):
    session_data = service.login(data)
    expires_utc = session_data.expires_at
    if expires_utc.tzinfo is None:
        expires_utc = expires_utc.replace(tzinfo=timezone.utc)
    delta = expires_utc - datetime.now(timezone.utc)
    max_age = int(delta.total_seconds())
    response.set_cookie(
        key="sid",
        value=session_data.session_id,
        httponly=True,
        secure=True,
        samesite="lax",
        expires=expires_utc,
        max_age=max_age,
    )
    return {"message": "Login realizado com sucesso"}

@router.post("/logout")
def logout(
    service: Service,
    response: Response,
    auth: AuthData = Depends(authorize)
):
    service.logout(auth.sid)
    response.delete_cookie("sid")
    return {"message": "Logout realizado com sucesso"}

@router.get("/me")
def me(auth: AuthData = Depends(authorize)):
    return {"user_id": auth.user_id}
