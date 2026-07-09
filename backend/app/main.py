from fastapi import FastAPI
from sqlalchemy import text

from app.db.database import engine

app = FastAPI(
    title="Coffee Shop API",
    version="1.0.0",
)


@app.get("/")
def root():
    return {"message": "Coffee Shop API is running"}


@app.get("/health")
def health():
    return {"status": "Healthy"}


@app.get("/db-check")
def database_check():
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))

        return {
            "database": "Connected successfully"
        }

    except Exception as error:
        return {
            "database": "Connection failed",
            "error": str(error)
        }