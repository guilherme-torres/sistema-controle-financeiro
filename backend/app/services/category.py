from sqlalchemy.orm import Session
from app.exceptions.category import CategoryNotFound
from app.repositories.category import CategoryRepository
from app.schemas.category import CategoryCreateDTO, CategoryFilters, CategoryResponseDTO, CategoryUpdateDTO


class CategoryService:
    def __init__(self, session: Session, category_repo: CategoryRepository):
        self.session = session
        self.category_repo = category_repo

    def create(self, data: CategoryCreateDTO, user_id: int):
        try:
            category_dict = data.model_dump()
            category_dict["user_id"] = user_id
            category = self.category_repo.create(category_dict)
            self.session.commit()
            self.session.refresh(category)
            return CategoryResponseDTO.model_validate(category)
        except Exception as e:
            self.session.rollback()
            raise e
    
    def list_all(self, filters: CategoryFilters, user_id: int):
        filter_dict = filters.model_dump(exclude_none=True, exclude_unset=True)
        offset = filter_dict.pop("offset")
        limit = filter_dict.pop("limit")
        categories = self.category_repo.list_all(
            offset=offset,
            limit=limit,
            filter_by={"user_id": user_id, **filter_dict},
        )
        return [CategoryResponseDTO.model_validate(category) for category in categories]
    
    def get(self, category_id: int, user_id: int):
        category = self.category_repo.get(category_id)
        if not category:
            raise CategoryNotFound
        if category.user_id != user_id:
            raise CategoryNotFound
        return CategoryResponseDTO.model_validate(category)
    
    def update(self, category_id: int, data: CategoryUpdateDTO, user_id: int):
        try:
            category = self.category_repo.get(category_id)
            if not category:
                raise CategoryNotFound
            if category.user_id != user_id:
                raise CategoryNotFound
            category = self.category_repo.update(
                category_id,
                data.model_dump(exclude_none=True, exclude_unset=True)
            )
            self.session.commit()
            self.session.refresh(category)
            return CategoryResponseDTO.model_validate(category)
        except Exception as e:
            self.session.rollback()
            raise e
    
    def delete(self, category_id: int, user_id: int):
        try:
            category = self.category_repo.get(category_id)
            if not category:
                raise CategoryNotFound
            if category.user_id != user_id:
                raise CategoryNotFound
            self.category_repo.delete(category_id)
            self.session.commit()
            return None
        except Exception as e:
            self.session.rollback()
            raise e
