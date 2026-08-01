from pydantic import BaseModel, ConfigDict


class WishlistCreate(BaseModel):
    coffee_id: int


class CoffeeSummary(BaseModel):
    id: int
    name: str
    price: float
    image_url: str | None

    model_config = ConfigDict(
        from_attributes=True
    )


class WishlistResponse(BaseModel):
    id: int
    coffee: CoffeeSummary

    model_config = ConfigDict(
        from_attributes=True
    )