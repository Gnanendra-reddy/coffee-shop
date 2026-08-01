from pydantic import BaseModel

from typing import Literal
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

class OrderStatusUpdate(BaseModel):
    status: Literal[
        "Pending",
        "Preparing",
        "Out for Delivery",
        "Delivered",
        "Cancelled",
    ]

class OrderStatusUpdate(BaseModel):

    status: Literal[
        "Preparing",
        "Ready",
        "Out for Delivery",
        "Delivered",
    ]