from app.exceptions.user import UserAlreadyExists, UserNotFound
from app.repositories.user import UserRepository
from app.schemas.user import UserCreateDTO
from app.security import get_password_hash


class UserService:
    def __init__(self, user_repo: UserRepository):
        self.user_repo = user_repo
    
    def create(self, data: UserCreateDTO):
        user_exists = self.user_repo.find_by_email(data.email)
        if user_exists:
            raise UserAlreadyExists
        user_data = data.model_dump()
        password = user_data.pop("password")
        user_data["password_hash"] = get_password_hash(password)
        self.user_repo.create(user_data)
        return None

    def delete(self, id: int):
        if not self.user_repo.delete(id):
            raise UserNotFound
        return None