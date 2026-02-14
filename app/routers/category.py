from typing import Annotated, List
from fastapi import APIRouter, Depends, Query, status
from app.dependencies import get_category_service
from app.schemas.category import CategoryCreateDTO, CategoryFilters, CategoryResponseDTO, CategoryUpdateDTO
from app.services.category import CategoryService


router = APIRouter(prefix="/categories", tags=["Category"])

Service = Annotated[CategoryService, Depends(get_category_service)]

@router.post("/", response_model=CategoryResponseDTO, status_code=status.HTTP_201_CREATED)
def create_category(data: CategoryCreateDTO, service: Service):
    return service.create(data)

@router.get("/", response_model=List[CategoryResponseDTO])
def list_categories(filters: Annotated[CategoryFilters, Query()], service: Service):
    return service.list_all(filters)

@router.get("/{id}", response_model=CategoryResponseDTO)
def get_category(id: int, service: Service):
    return service.get(id)

@router.patch("/{id}", response_model=CategoryResponseDTO)
def update_category(id: int, data: CategoryUpdateDTO, service: Service):
    return service.update(id, data)

@router.delete("/{id}")
def delete_category(id: int, service: Service):
    return service.delete(id)