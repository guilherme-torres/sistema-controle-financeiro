from typing import Annotated, List
from fastapi import APIRouter, Depends, Query, status
from app.dependencies import get_category_service
from app.schemas.auth import AuthData
from app.schemas.category import CategoryCreateDTO, CategoryFilters, CategoryResponseDTO, CategoryUpdateDTO
from app.security import authorize
from app.services.category import CategoryService


router = APIRouter(prefix="/categories", tags=["Category"])

Service = Annotated[CategoryService, Depends(get_category_service)]

@router.post("/", response_model=CategoryResponseDTO, status_code=status.HTTP_201_CREATED)
def create_category(
    data: CategoryCreateDTO,
    service: Service,
    auth: AuthData = Depends(authorize)
):
    return service.create(data, auth.user_id)

@router.get("/", response_model=List[CategoryResponseDTO])
def list_categories(
    filters: Annotated[CategoryFilters, Query()],
    service: Service,
    auth: AuthData = Depends(authorize)
):
    return service.list_all(filters, auth.user_id)

@router.get("/{id}", response_model=CategoryResponseDTO)
def get_category(
    id: int,
    service: Service,
    auth: AuthData = Depends(authorize)
):
    return service.get(id, auth.user_id)

@router.patch("/{id}", response_model=CategoryResponseDTO)
def update_category(
    id: int,
    data: CategoryUpdateDTO,
    service: Service,
    auth: AuthData = Depends(authorize)
):
    return service.update(id, data, auth.user_id)

@router.delete("/{id}")
def delete_category(
    id: int,
    service: Service,
    auth: AuthData = Depends(authorize)
):
    return service.delete(id, auth.user_id)