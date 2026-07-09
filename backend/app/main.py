from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.users import router as user_router
from app.db.database import create_tables

# Import models so SQLAlchemy registers them
from app.models import Coffee, Order, OrderItem, User

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


@app.get("/")
def root():
    return {
        "message": "Coffee Shop API Running"
    }