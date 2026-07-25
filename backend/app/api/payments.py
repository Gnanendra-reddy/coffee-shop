from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.payment import (
    PaymentCreate,
    PaymentResponse,
)
from app.services.payment_service import (
    create_payment,
    get_my_payments,
    get_payment,
    get_all_payments,
)

from app.core.auth import (
    get_current_user,
    require_admin,
)

from app.models.user import User

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
    current_user: User = Depends(get_current_user),
):
    try:
        return create_payment(
            db,
            payment,
            current_user,
        )
    except PermissionError as e:
        raise HTTPException(
            status_code=403,
            detail=str(e),
        )
    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )

@router.get(
    "/",
    response_model=list[PaymentResponse],
)
def all_payments(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    return get_all_payments(db)


@router.get(
    "/my-payments",
    response_model=list[PaymentResponse],
)
def my_payments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_my_payments(
        db,
        current_user.id,
    )


@router.get(
    "/{payment_id}",
    response_model=PaymentResponse,
)
def payment_details(
    payment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        payment = get_payment(
            db,
            payment_id,
            current_user,
        )

    except PermissionError as e:
        raise HTTPException(
            status_code=403,
            detail=str(e),
        )

    if payment is None:
        raise HTTPException(
            status_code=404,
            detail="Payment not found",
        )

    return payment


