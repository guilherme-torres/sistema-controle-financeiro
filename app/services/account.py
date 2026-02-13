from app.exceptions.account import AccountNotFound
from app.repositories.account import AccountRepository
from app.schemas.account import AccountCreateDTO, AccountFilters, AccountResponseDTO, AccountUpdateDTO


class AccountService:
    def __init__(self, account_repo: AccountRepository):
        self.account_repo = account_repo

    def create(self, data: AccountCreateDTO, user_id: int = 1):
        account_dict = data.model_dump()
        account_dict["user_id"] = user_id
        self.account_repo.create(account_dict)
        return None
    
    def list_all(self, filters: AccountFilters, user_id: int = 1):
        filter_dict = filters.model_dump(exclude_none=True, exclude_unset=True)
        offset = filter_dict.pop("offset")
        limit = filter_dict.pop("limit")
        accounts = self.account_repo.list_all(
            offset=offset,
            limit=limit,
            filter_by={"user_id": user_id, **filter_dict},
        )
        return [AccountResponseDTO.model_validate(account) for account in accounts]
    
    def get(self, account_id: int, user_id: int = 1):
        account = self.account_repo.get(account_id)
        if not account:
            raise AccountNotFound
        if account.user_id != user_id:
            raise AccountNotFound
        return AccountResponseDTO.model_validate(account)
    
    def update(self, account_id: int, data: AccountUpdateDTO, user_id: int = 1):
        account = self.account_repo.get(account_id)
        if not account:
            raise AccountNotFound
        if account.user_id != user_id:
            raise AccountNotFound
        account = self.account_repo.update(
            account_id,
            data.model_dump(exclude_none=True, exclude_unset=True)
        )
        return AccountResponseDTO.model_validate(account)
    
    def delete(self, account_id: int, user_id: int = 1):
        account = self.account_repo.get(account_id)
        if not account:
            raise AccountNotFound
        if account.user_id != user_id:
            raise AccountNotFound
        self.account_repo.delete(account_id)
        return None
