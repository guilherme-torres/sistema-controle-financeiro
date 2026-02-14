from typing import Annotated, List
from fastapi import APIRouter, Depends, Query, status
from app.dependencies import get_transaction_service
from app.schemas.auth import AuthData
from app.schemas.transaction import TransactionCreateDTO, TransactionFilters, TransactionResponseDTO, TransactionSummaryDTO, TransactionUpdateDTO
from app.security import authorize
from app.services.transaction import TransactionService


router = APIRouter(prefix="/transactions", tags=["Transaction"])

Service = Annotated[TransactionService, Depends(get_transaction_service)]

@router.post("/", response_model=TransactionResponseDTO, status_code=status.HTTP_201_CREATED)
def create_transaction(
    data: TransactionCreateDTO,
    service: Service,
    auth: AuthData = Depends(authorize)
):
    return service.create(data, auth.user_id)

@router.get("/", response_model=List[TransactionResponseDTO] | List[TransactionSummaryDTO])
def list_transactions(
    filters: Annotated[TransactionFilters, Query()],
    service: Service,
    auth: AuthData = Depends(authorize)
):
    return service.list_all(filters, auth.user_id)

@router.get("/{id}", response_model=TransactionResponseDTO)
def get_transaction(
    id: int,
    service: Service,
    auth: AuthData = Depends(authorize)
):
    return service.get(id, auth.user_id)

@router.patch("/{id}", response_model=TransactionResponseDTO)
def update_transaction(
    id: int,
    data: TransactionUpdateDTO,
    service: Service,
    auth: AuthData = Depends(authorize)
):
    return service.update(id, data, auth.user_id)

@router.delete("/{id}")
def delete_transaction(
    id: int,
    service: Service,
    auth: AuthData = Depends(authorize)
):
    return service.delete(id, auth.user_id)