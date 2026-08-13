from pydantic import BaseModel, Field


class InventoryResponse(BaseModel):
    id: int
    name: str
    stock: int
    price: float


class RestockRequest(BaseModel):
    quantity: int = Field(
        gt=0
    )