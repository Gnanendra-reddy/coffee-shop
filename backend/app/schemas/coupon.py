from datetime import date

from pydantic import BaseModel, Field
from typing import Literal


class CouponCreate(BaseModel):

    code: str

    discount_type: Literal[
        "percentage",
        "fixed",
    ]

    value: float = Field(gt=0)

    expiry_date: date


class CouponResponse(BaseModel):

    id: int

    code: str

    discount_type: str

    value: float

    expiry_date: date

    class Config:
        from_attributes = True