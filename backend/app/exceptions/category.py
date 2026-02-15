from app.exceptions.base import AppBaseException


class CategoryNotFound(AppBaseException):
    def __init__(self):
        super().__init__(
            message="Categoria não encontrada",
            error_code="category_not_found",
            status_code=404
        )