from fastapi import FastAPI

app = FastAPI(
    title="Coffee Shop API",
    description="Backend API for Coffee Shop Website",
    version="1.0.0"
)


@app.get("/")
def root():
    return {
        "message": "Welcome to Coffee Shop API"
    }


@app.get("/health")
def health():
    return {
        "status": "Server is running successfully"
    }