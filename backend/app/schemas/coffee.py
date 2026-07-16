from pydantic import BaseModel


class CoffeeCreate(BaseModel):
    name: str
    description: str
    category: str
    price: float
    stock: int
    image_url: str


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