from typing import Annotated
from fastapi import APIRouter, Depends, status
from app.dependencies import get_user_service
from app.schemas.auth import AuthData
from app.schemas.user import UserCreateDTO
from app.security import authorize
from app.services.user import UserService


router = APIRouter(prefix="/users", tags=["User"])

Service = Annotated[UserService, Depends(get_user_service)]

@router.post("/", status_code=status.HTTP_201_CREATED)
def create_user(data: UserCreateDTO, service: Service):
    return service.create(data)

@router.delete("/{id}")
def delete_user(
    id: int,
    service: Service,
    auth: AuthData = Depends(authorize)
):
    return service.delete(id, auth.user_id)