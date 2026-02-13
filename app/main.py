from fastapi import FastAPI
from app.exception_handlers import add_exception_handlers


app = FastAPI()

add_exception_handlers(app)

@app.get("/")
def healthcheck():
    return "system is up"