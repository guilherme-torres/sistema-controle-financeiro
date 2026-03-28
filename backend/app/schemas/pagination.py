from pydantic import BaseModel, Field


class Pagination(BaseModel):
    offset: int = Field(0, ge=0)
    limit: int = Field(10, ge=1, le=100)


class PaginationResponse(BaseModel):
    total: int
    offset: int
    limit: int