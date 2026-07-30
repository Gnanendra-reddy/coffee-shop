from pydantic import BaseModel


class CartItemCreate(BaseModel):
    coffee_id: int
    quantity: int


class CartItemResponse(BaseModel):
    id: int
    coffee_id: int
    quantity: int

    class Config:
        from_attributes = True