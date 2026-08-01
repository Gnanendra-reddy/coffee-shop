from sqlalchemy.orm import Session

from app.models.coffee import Coffee
from app.models.review import Review
from app.schemas.review import ReviewCreate


def create_review(
    db: Session,
    review: ReviewCreate,
    current_user,
):
    coffee = (
        db.query(Coffee)
        .filter(Coffee.id == review.coffee_id)
        .first()
    )

    if coffee is None:
        raise ValueError(
            "Coffee not found"
        )

    existing_review = (
        db.query(Review)
        .filter(
            Review.user_id == current_user.id,
            Review.coffee_id == review.coffee_id,
        )
        .first()
    )

    if existing_review:
        raise ValueError(
            "You have already reviewed this coffee"
        )

    new_review = Review(
        user_id=current_user.id,
        coffee_id=review.coffee_id,
        rating=review.rating,
        comment=review.comment,
    )

    db.add(new_review)

    db.commit()

    db.refresh(new_review)

    return new_review


def get_reviews(
    db: Session,
    coffee_id: int,
):
    coffee = (
        db.query(Coffee)
        .filter(Coffee.id == coffee_id)
        .first()
    )

    if coffee is None:
        raise ValueError(
            "Coffee not found"
        )

    return coffee.reviews


def get_review_summary(
    db: Session,
    coffee_id: int,
):
    coffee = (
        db.query(Coffee)
        .filter(Coffee.id == coffee_id)
        .first()
    )

    if coffee is None:
        raise ValueError(
            "Coffee not found"
        )

    reviews = coffee.reviews

    if len(reviews) == 0:
        return {
            "average_rating": 0,
            "total_reviews": 0,
        }

    average = (
        sum(
            review.rating
            for review in reviews
        )
        / len(reviews)
    )

    return {
        "average_rating": round(
            average,
            2,
        ),
        "total_reviews": len(reviews),
    }