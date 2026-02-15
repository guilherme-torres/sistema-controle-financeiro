from app.exceptions.base import AppBaseException


class UserNotFound(AppBaseException):
    def __init__(self):
        super().__init__(
            message="Usuário não encontrado",
            error_code="user_not_found",
            status_code=404
        )

class UserAlreadyExists(AppBaseException):
    def __init__(self):
        super().__init__(
            message="Este usuário já existe",
            error_code="user_already_exists",
            status_code=400
        )