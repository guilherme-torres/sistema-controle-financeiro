from sqlalchemy.orm import Session
from app.exceptions.transaction import TransactionNotFound
from app.exceptions.category import CategoryNotFound
from app.exceptions.account import AccountNotFound
from app.models.category import CategoryType
from app.repositories.account import AccountRepository
from app.repositories.category import CategoryRepository
from app.repositories.transaction import TransactionRepository
from app.schemas.transaction import TransactionCreateDTO, TransactionFilters, TransactionResponseDTO, TransactionSummaryDTO, TransactionUpdateDTO


class TransactionService:
    def __init__(
        self,
        session: Session,
        transaction_repo: TransactionRepository,
        category_repo: CategoryRepository,
        account_repo: AccountRepository,
    ):
        self.session = session
        self.transaction_repo = transaction_repo
        self.category_repo = category_repo
        self.account_repo = account_repo

    def create(self, data: TransactionCreateDTO, user_id: int):
        try:
            category = self.category_repo.get(data.category_id)
            if not category or category.user_id != user_id:
                raise CategoryNotFound
            account = self.account_repo.get(data.account_id)
            if not account or account.user_id != user_id:
                raise AccountNotFound
            transaction_dict = data.model_dump(exclude_none=True, exclude_unset=True)
            transaction_dict["user_id"] = user_id
            transaction_dict["category_type"] = category.category_type
            created_transaction = self.transaction_repo.create(transaction_dict)
            if category.category_type == CategoryType.EXPENSES:
                new_balance = account.balance - data.amount
            else:
                new_balance = account.balance + data.amount
            self.account_repo.update(account.id, {
                "balance": new_balance
            })
            self.session.commit()
            self.session.refresh(created_transaction)
            return TransactionResponseDTO.model_validate(created_transaction)
        except Exception as e:
            self.session.rollback()
            raise e
    
    def list_all(self, filters: TransactionFilters, user_id: int):
        query_filters = {"user_id": user_id}
        if filters.category_type is not None:
            query_filters["category_type"] = filters.category_type
        if filters.account_id is not None:
            query_filters["account_id"] = filters.account_id
        if filters.category_id:
            query_filters["category_id"] = filters.category_id
        if filters.date:
            query_filters["date"] = filters.date
        if filters.start_date:
            query_filters["start_date"] = filters.start_date
        if filters.end_date:
            query_filters["end_date"] = filters.end_date
        if filters.month:
            query_filters["month"] = filters.month
        if filters.year:
            query_filters["year"] = filters.year
        if filters.summary:
            raw_data = self.transaction_repo.get_summary(filter_by=query_filters)
            grand_total = sum(row[1] for row in raw_data) if raw_data else 0
            summary_list = []
            for category, total in raw_data:
                percent = (total / grand_total * 100) if grand_total != 0 else 0
                dto = TransactionSummaryDTO(
                    category_id=category.id,
                    category_name=category.name,
                    category_type=category.category_type,
                    total_amount=total,
                    percentage=round(percent, 2)
                )
                summary_list.append(dto)
            return summary_list
        query_order = {}
        if filters.order_by:
            field_name, direction = filters.order_by.value.split(":")
            query_order[field_name] = direction
        else:
            query_order = {"date": "desc"}
        transactions = self.transaction_repo.list_all(
            offset=filters.offset,
            limit=filters.limit,
            filter_by=query_filters,
            order_by=query_order
        )
        return [TransactionResponseDTO.model_validate(t) for t in transactions]
    
    def get(self, transaction_id: int, user_id: int):
        transaction = self.transaction_repo.get(transaction_id)
        if not transaction:
            raise TransactionNotFound
        if transaction.user_id != user_id:
            raise TransactionNotFound
        return TransactionResponseDTO.model_validate(transaction)
    
    def update(self, transaction_id: int, data: TransactionUpdateDTO, user_id: int):
        try:
            original_transaction = self.transaction_repo.get(transaction_id)
            if not original_transaction or original_transaction.user_id != user_id:
                raise TransactionNotFound
            new_category_type = original_transaction.category_type
            if data.category_id is not None:
                category = self.category_repo.get(data.category_id)
                if not category or category.user_id != user_id:
                    raise CategoryNotFound
                new_category_type = category.category_type
            new_account_id = data.account_id if data.account_id is not None else original_transaction.account_id
            if data.account_id is not None:
                new_account = self.account_repo.get(new_account_id)
                if not new_account or new_account.user_id != user_id:
                    raise AccountNotFound
            has_financial_changes = (
                (data.amount is not None and data.amount != original_transaction.amount) or
                (data.category_id is not None and data.category_id != original_transaction.category_id) or
                (data.account_id is not None and data.account_id != original_transaction.account_id)
            )
            if has_financial_changes:
                old_account = self.account_repo.get(original_transaction.account_id)
                revert_value = original_transaction.amount if original_transaction.category_type == CategoryType.EXPENSES else -original_transaction.amount
                self.account_repo.update(old_account.id, {
                    "balance": old_account.balance + revert_value
                })
            update_data = data.model_dump(exclude_none=True, exclude_unset=True)
            if data.category_id is not None:
                update_data["category_type"] = new_category_type
            updated_transaction = self.transaction_repo.update(
                transaction_id,
                update_data
            )
            if has_financial_changes:
                target_account = self.account_repo.get(updated_transaction.account_id)
                apply_value = -updated_transaction.amount if new_category_type == CategoryType.EXPENSES else updated_transaction.amount
                self.account_repo.update(target_account.id, {
                    "balance": target_account.balance + apply_value
                })
            self.session.commit()
            self.session.refresh(updated_transaction)
            return TransactionResponseDTO.model_validate(updated_transaction)
        except Exception as e:
            self.session.rollback()
            raise e

    def delete(self, transaction_id: int, user_id: int):
        try:
            transaction = self.transaction_repo.get(transaction_id)
            if not transaction:
                raise TransactionNotFound
            if transaction.user_id != user_id:
                raise TransactionNotFound
            account = self.account_repo.get(transaction.account_id)
            if account:
                if account.user_id == user_id:
                    if transaction.category_type == CategoryType.EXPENSES:
                        new_balance = account.balance + transaction.amount
                    else:
                        new_balance = account.balance - transaction.amount
                    
                    self.account_repo.update(account.id, {
                        "balance": new_balance
                    })
            self.transaction_repo.delete(transaction_id)
            self.session.commit()
            return None
        except Exception as e:
            self.session.rollback()
            raise e