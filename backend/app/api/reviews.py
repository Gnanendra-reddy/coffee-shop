from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.auth import get_current_user
from app.db.database import get_db
from app.models.user import User
from app.schemas.review import (
    ReviewCreate,
    ReviewResponse,
    ReviewSummary,
)
from app.services.review_service import (
    create_review,
    get_reviews,
    get_review_summary,
)

router = APIRouter(
    prefix="/reviews",
    tags=["Reviews"],
)


@router.post(
    "/",
    response_model=ReviewResponse,
)
def add_review(
    review: ReviewCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        return create_review(
            db,
            review,
            current_user,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )


@router.get(
    "/{coffee_id}",
    response_model=list[ReviewResponse],
)
def all_reviews(
    coffee_id: int,
    db: Session = Depends(get_db),
):
    try:
        return get_reviews(
            db,
            coffee_id,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e),
        )


@router.get(
    "/{coffee_id}/summary",
    response_model=ReviewSummary,
)
def review_summary(
    coffee_id: int,
    db: Session = Depends(get_db),
):
    try:
        return get_review_summary(
            db,
            coffee_id,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e),
        )