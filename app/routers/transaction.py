from typing import Annotated, List
from fastapi import APIRouter, Depends, Query, status
from app.dependencies import get_transaction_service
from app.schemas.transaction import TransactionCreateDTO, TransactionFilters, TransactionResponseDTO, TransactionSummaryDTO, TransactionUpdateDTO
from app.services.transaction import TransactionService


router = APIRouter(prefix="/transactions", tags=["Transaction"])

Service = Annotated[TransactionService, Depends(get_transaction_service)]

@router.post("/", response_model=TransactionResponseDTO, status_code=status.HTTP_201_CREATED)
def create_transaction(data: TransactionCreateDTO, service: Service):
    return service.create(data)

@router.get("/", response_model=List[TransactionResponseDTO] | List[TransactionSummaryDTO])
def list_transactions(filters: Annotated[TransactionFilters, Query()], service: Service):
    return service.list_all(filters)

@router.get("/{id}", response_model=TransactionResponseDTO)
def get_transaction(id: int, service: Service):
    return service.get(id)

@router.patch("/{id}", response_model=TransactionResponseDTO)
def update_transaction(id: int, data: TransactionUpdateDTO, service: Service):
    return service.update(id, data)

@router.delete("/{id}")
def delete_transaction(id: int, service: Service):
    return service.delete(id)