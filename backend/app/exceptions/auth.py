from app.exceptions.base import AppBaseException


class InvalidCredentials(AppBaseException):
    def __init__(self):
        super().__init__(
            message="Credenciais inválidas",
            error_code="invalid_credentials",
            status_code=400
        )

class AlreadyLoggedOut(AppBaseException):
    def __init__(self):
        super().__init__(
            message="Usuário já deslogado",
            error_code="already_logged_out",
            status_code=204
        )

class InvalidSession(AppBaseException):
    def __init__(self):
        super().__init__(
            message="Sessão expirada ou inválida",
            error_code="invalid_session",
            status_code=401
        )