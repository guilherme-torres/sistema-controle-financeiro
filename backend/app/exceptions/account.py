from app.exceptions.base import AppBaseException


class AccountNotFound(AppBaseException):
    def __init__(self):
        super().__init__(
            message="Conta não encontrada",
            error_code="account_not_found",
            status_code=404
        )