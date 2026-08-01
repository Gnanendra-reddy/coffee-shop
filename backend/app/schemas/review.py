from pydantic import BaseModel, ConfigDict, Field


class ReviewCreate(BaseModel):
    coffee_id: int

    rating: int = Field(
        ge=1,
        le=5,
    )

    comment: str


class UserSummary(BaseModel):
    id: int
    full_name: str

    model_config = ConfigDict(
        from_attributes=True
    )


class ReviewResponse(BaseModel):
    id: int

    user: UserSummary

    rating: int

    comment: str

    model_config = ConfigDict(
        from_attributes=True
    )


class ReviewSummary(BaseModel):
    average_rating: float

    total_reviews: int