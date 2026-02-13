from app.exceptions.base import AppBaseException


class TransactionNotFound(AppBaseException):
    def __init__(self):
        super().__init__(
            message="Transação não encontrada",
            error_code="transaction_not_found",
            status_code=404
        )