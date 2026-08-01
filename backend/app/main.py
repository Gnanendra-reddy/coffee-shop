from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.users import router as user_router
from app.db.database import create_tables

from app.api.coffee import router as coffee_router

from app.api.orders import router as order_router

from fastapi import Depends
from app.core.auth import verify_token

from app.api.payments import router as payment_router

from app.api.cart import router as cart_router

from app.api.reviews import router as review_router

# Import models so SQLAlchemy registers them
from app.models import (
    Coffee,
    Order,
    OrderItem,
    User,
    Payment,
    Cart,
    CartItem,
)

app = FastAPI(title="Coffee Shop API")


@app.on_event("startup")
def startup():
    create_tables()


origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_router)

app.include_router(coffee_router)

app.include_router(order_router)

app.include_router(payment_router)

app.include_router(cart_router)

app.include_router(review_router)

@app.get("/")
def root():
    return {
        "message": "Coffee Shop API Running"
    }

@app.get("/profile")
def profile(
    email: str = Depends(verify_token)
):
    return {
        "message": "Welcome!",
        "email": email
    }