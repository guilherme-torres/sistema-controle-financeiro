from typing import Annotated, List
from fastapi import APIRouter, Depends, Query, status
from app.dependencies import get_account_service
from app.schemas.account import AccountCreateDTO, AccountFilters, AccountResponseDTO, AccountUpdateDTO
from app.services.account import AccountService


router = APIRouter(prefix="/accounts", tags=["Account"])

Service = Annotated[AccountService, Depends(get_account_service)]

@router.post("/", status_code=status.HTTP_201_CREATED)
def create_account(data: AccountCreateDTO, service: Service):
    return service.create(data)

@router.get("/", response_model=List[AccountResponseDTO])
def list_accounts(filters: Annotated[AccountFilters, Query()], service: Service):
    return service.list_all(filters)

@router.get("/{id}", response_model=AccountResponseDTO)
def get_account(id: int, service: Service):
    return service.get(id)

@router.patch("/{id}", response_model=AccountResponseDTO)
def update_account(id: int, data: AccountUpdateDTO, service: Service):
    return service.update(id, data)

@router.delete("/{id}")
def delete_account(id: int, service: Service):
    return service.delete(id)