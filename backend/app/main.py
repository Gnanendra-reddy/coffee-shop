from fastapi import FastAPI

from app.db.database import create_tables
from app.api.users import router as user_router
from app.models import Coffee, Order, OrderItem, User

app = FastAPI(title="Coffee Shop API")


@app.on_event("startup")
def startup():
    create_tables()

app.include_router(user_router)

@app.get("/")
def root():
    return {
        "message": "Coffee Shop API Running"
    }