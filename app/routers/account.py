from typing import Annotated, List
from fastapi import APIRouter, Depends, Query, status
from app.dependencies import get_account_service
from app.schemas.account import AccountCreateDTO, AccountFilters, AccountResponseDTO, AccountUpdateDTO
from app.schemas.auth import AuthData
from app.security import authorize
from app.services.account import AccountService


router = APIRouter(prefix="/accounts", tags=["Account"])

Service = Annotated[AccountService, Depends(get_account_service)]

@router.post("/", response_model=AccountResponseDTO, status_code=status.HTTP_201_CREATED)
def create_account(
    data: AccountCreateDTO,
    service: Service,
    auth: AuthData = Depends(authorize)
):
    return service.create(data, auth.user_id)

@router.get("/", response_model=List[AccountResponseDTO])
def list_accounts(
    filters: Annotated[AccountFilters, Query()],
    service: Service,
    auth: AuthData = Depends(authorize)
):
    return service.list_all(filters, auth.user_id)

@router.get("/{id}", response_model=AccountResponseDTO)
def get_account(
    id: int,
    service: Service,
    auth: AuthData = Depends(authorize)
):
    return service.get(id, auth.user_id)

@router.patch("/{id}", response_model=AccountResponseDTO)
def update_account(
    id: int,
    data: AccountUpdateDTO,
    service: Service,
    auth: AuthData = Depends(authorize)
):
    return service.update(id, data, auth.user_id)

@router.delete("/{id}")
def delete_account(
    id: int,
    service: Service,
    auth: AuthData = Depends(authorize)
):
    return service.delete(id, auth.user_id)