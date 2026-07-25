from typing import Literal

from pydantic import BaseModel


class PaymentCreate(BaseModel):
    order_id: int

    payment_method: Literal[
        "UPI",
        "Card",
        "Cash on Delivery",
    ]


class PaymentResponse(BaseModel):
    id: int

    order_id: int

    amount: float

    payment_method: str

    payment_status: str

    transaction_id: str | None

    class Config:
        from_attributes = True