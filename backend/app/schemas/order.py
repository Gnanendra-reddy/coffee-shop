from pydantic import BaseModel


class OrderItemCreate(BaseModel):
    coffee_id: int
    quantity: int


class OrderCreate(BaseModel):
    items: list[OrderItemCreate]


class OrderItemResponse(BaseModel):
    coffee_id: int
    quantity: int

    class Config:
        from_attributes = True


class OrderResponse(BaseModel):
    id: int
    user_id: int
    total_amount: float
    status: str
    items: list[OrderItemResponse]

    class Config:
        from_attributes = True