from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.payment import (
    PaymentCreate,
    PaymentResponse,
)
from app.services.payment_service import (
    create_payment,
)

router = APIRouter(
    prefix="/payments",
    tags=["Payments"],
)


@router.post(
    "/",
    response_model=PaymentResponse,
)
def pay(
    payment: PaymentCreate,
    db: Session = Depends(get_db),
):
    try:
        return create_payment(
            db,
            payment,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )