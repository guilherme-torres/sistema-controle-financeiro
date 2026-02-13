from typing import Annotated
from fastapi import APIRouter, Depends
from app.dependencies import get_auth_service
from app.schemas.auth import LoginDTO
from app.services.auth import AuthService


router = APIRouter(prefix="/auth", tags=["Auth"])

Service = Annotated[AuthService, Depends(get_auth_service)]

@router.post("/login")
def login(data: LoginDTO, service: Service):
    return service.login(data)

@router.delete("/logout")
def logout(session_id: str, service: Service):
    return service.logout(session_id)