from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.exception_handlers import add_exception_handlers
from app.routers.user import router as user_router
from app.routers.auth import router as auth_router
from app.routers.account import router as account_router
from app.routers.category import router as category_router
from app.routers.transaction import router as transaction_router


app = FastAPI()

origins = ["http://localhost:5173"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

add_exception_handlers(app)

app.include_router(user_router, prefix="/api")
app.include_router(auth_router, prefix="/api")
app.include_router(account_router, prefix="/api")
app.include_router(category_router, prefix="/api")
app.include_router(transaction_router, prefix="/api")

@app.get("/", tags=["Healthcheck"])
def healthcheck():
    return "system is up"