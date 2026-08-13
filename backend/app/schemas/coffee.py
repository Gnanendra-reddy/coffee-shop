from pydantic import BaseModel, Field


class CoffeeCreate(BaseModel):
    name: str
    description: str
    category: str
    price: float = Field(
        gt=0
    )

    stock: int = Field(
        ge=0
    )

    image_url: str

class CoffeeUpdate(BaseModel):
    name: str
    description: str
    category: str
    price: float
    stock: int
    image_url: str

    class Config:
        from_attributes = True

class CoffeeResponse(BaseModel):
    id: int
    name: str
    description: str
    category: str
    price: float
    stock: int
    image_url: str

    class Config:
        from_attributes = True

class CoffeeListResponse(BaseModel):
    page: int
    limit: int
    total: int
    data: list[CoffeeResponse]