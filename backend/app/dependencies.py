from typing import Annotated
from fastapi import Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.repositories.account import AccountRepository
from app.repositories.category import CategoryRepository
from app.repositories.session import UserSessionRepository
from app.repositories.transaction import TransactionRepository
from app.repositories.user import UserRepository
from app.services.account import AccountService
from app.services.auth import AuthService
from app.services.category import CategoryService
from app.services.transaction import TransactionService
from app.services.user import UserService


DBSession = Annotated[Session, Depends(get_db)]

# repositories

def get_user_repo(db: DBSession):
    return UserRepository(db)

def get_user_session_repo(db: DBSession):
    return UserSessionRepository(db)

def get_account_repo(db: DBSession):
    return AccountRepository(db)

def get_category_repo(db: DBSession):
    return CategoryRepository(db)

def get_transaction_repo(db: DBSession):
    return TransactionRepository(db)


# services

def get_user_service(db: DBSession, user_repo: Annotated[UserRepository, Depends(get_user_repo)]):
    return UserService(db, user_repo)

def get_auth_service(
    db: DBSession,
    user_repo: Annotated[UserRepository, Depends(get_user_repo)],
    user_session_repo: Annotated[UserSessionRepository, Depends(get_user_session_repo)],
):
    return AuthService(db, user_repo, user_session_repo)

def get_account_service(db: DBSession, account_repo: Annotated[AccountRepository, Depends(get_account_repo)]):
    return AccountService(db, account_repo)

def get_category_service(db: DBSession, category_repo: Annotated[CategoryRepository, Depends(get_category_repo)]):
    return CategoryService(db, category_repo)

def get_transaction_service(
    db: DBSession,
    transaction_repo: Annotated[TransactionRepository, Depends(get_transaction_repo)],
    category_repo: Annotated[CategoryRepository, Depends(get_category_repo)],
    account_repo: Annotated[AccountRepository, Depends(get_account_repo)],
):
    return TransactionService(db, transaction_repo, category_repo, account_repo)