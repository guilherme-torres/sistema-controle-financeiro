from decimal import Decimal
from app.exceptions.transaction import TransactionNotFound
from app.exceptions.category import CategoryNotFound
from app.exceptions.account import AccountNotFound
from app.models.category import CategoryType
from app.repositories.account import AccountRepository
from app.repositories.category import CategoryRepository
from app.repositories.transaction import TransactionRepository
from app.schemas.transaction import TransactionCreateDTO, TransactionFilters, TransactionResponseDTO, TransactionUpdateDTO


class TransactionService:
    def __init__(
        self,
        transaction_repo: TransactionRepository,
        category_repo: CategoryRepository,
        account_repo: AccountRepository,
    ):
        self.transaction_repo = transaction_repo
        self.category_repo = category_repo
        self.account_repo = account_repo

    def create(self, data: TransactionCreateDTO, user_id: int = 1):
        category = self.category_repo.get(data.category_id)
        if not category or category.user_id != user_id:
            raise CategoryNotFound
        account = self.account_repo.get(data.account_id)
        if not account or account.user_id != user_id:
            raise AccountNotFound
        transaction_dict = data.model_dump(exclude_none=True, exclude_unset=True)
        transaction_dict["user_id"] = user_id
        # TODO: transformar essa operação em uma transação no bd
        self.transaction_repo.create(transaction_dict)
        if data.category_type == CategoryType.EXPENSES:
            self.account_repo.update(account.id, {
                "balance": account.balance - data.amount
            })
        else:
            self.account_repo.update(account.id, {
                "balance": account.balance + data.amount
            })
        return None
    
    def list_all(self):
        raise NotImplementedError
    
    def get(self, transaction_id: int, user_id: int = 1):
        transaction = self.transaction_repo.get(transaction_id)
        if not transaction:
            raise TransactionNotFound
        if transaction.user_id != user_id:
            raise TransactionNotFound
        return TransactionResponseDTO.model_validate(transaction)
    
    def update(self, transaction_id: int, data: TransactionUpdateDTO, user_id: int = 1):
        transaction = self.transaction_repo.get(transaction_id)
        if not transaction or transaction.user_id != user_id:
            raise TransactionNotFound
        if data.category_id is not None:
            category = self.category_repo.get(data.category_id)
            if not category or category.user_id != user_id:
                raise CategoryNotFound
        if data.account_id is not None:
            account = self.account_repo.get(data.account_id)
            if not account or account.user_id != user_id:
                raise AccountNotFound
        transaction = self.transaction_repo.update(
            transaction_id,
            data.model_dump(exclude_none=True, exclude_unset=True)
        )
        # TODO: atualizar o account.balance de acordo com os campos category_type e amount
        return TransactionResponseDTO.model_validate(transaction)
    
    def delete(self, transaction_id: int, user_id: int = 1):
        transaction = self.transaction_repo.get(transaction_id)
        if not transaction:
            raise TransactionNotFound
        if transaction.user_id != user_id:
            raise TransactionNotFound
        self.transaction_repo.delete(transaction_id)
        return None