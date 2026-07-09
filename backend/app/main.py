from fastapi import FastAPI

from app.db.database import create_tables

# Import models so SQLAlchemy registers them
from app.models import Coffee, Order, OrderItem, User

app = FastAPI(title="Coffee Shop API")


@app.on_event("startup")
def startup():
    create_tables()


@app.get("/")
def root():
    return {
        "message": "Coffee Shop API Running"
    }