from pydantic import BaseModel, ConfigDict


class CoffeeSummary(BaseModel):
    id: int
    name: str
    price: float
    category: str
    image_url: str | None

    model_config = ConfigDict(
        from_attributes=True
    )


class CartItemCreate(BaseModel):
    coffee_id: int
    quantity: int


class CartItemResponse(BaseModel):
    id: int
    coffee: CoffeeSummary
    quantity: int
    subtotal: float

    model_config = ConfigDict(
        from_attributes=True
    )

class CartResponse(BaseModel):
    items: list[CartItemResponse]
    total: float