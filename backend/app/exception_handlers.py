import logging
from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from app.exceptions.base import AppBaseException


logger = logging.getLogger(__name__)

def add_exception_handlers(app: FastAPI):
    @app.exception_handler(AppBaseException)
    def handle_app_errors(request: Request, exc: AppBaseException):
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "error": exc.error_code,
                "message": exc.message
            }
        )

    @app.exception_handler(Exception)
    def handle_all_errors(request: Request, exc: Exception):
        logger.exception("UnhandledException")
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "error": "internal_server_error",
                "message": "Erro interno inesperado.",
            }
        )