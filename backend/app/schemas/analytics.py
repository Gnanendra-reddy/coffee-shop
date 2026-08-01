from pydantic import BaseModel


class DashboardStats(BaseModel):
    total_customers: int
    total_orders: int
    total_coffees: int
    total_revenue: float


class BestSellingCoffee(BaseModel):
    coffee_name: str
    total_quantity: int


class TopRatedCoffee(BaseModel):
    coffee_name: str
    average_rating: float