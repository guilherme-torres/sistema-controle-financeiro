from typing import Optional
from pydantic import BaseModel, ConfigDict, Field
from app.models.category import CategoryType


class CategoryBase(BaseModel):
    name: str
    category_type: CategoryType
    color: str


class CategoryCreateDTO(CategoryBase):
    pass


class CategoryResponseDTO(CategoryBase):
    id: int

    model_config = ConfigDict(from_attributes=True)


class CategoryUpdateDTO(BaseModel):
    name: Optional[str] = None
    category_type: Optional[CategoryType] = None
    color: Optional[str] = None


class CategoryFilters(BaseModel):
    offset: int = Field(0, ge=0)
    limit: int = Field(10, ge=1)