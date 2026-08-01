from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)

from sqlalchemy.orm import Session

from app.core.auth import require_admin

from app.db.database import get_db

from app.schemas.coupon import (
    CouponCreate,
    CouponResponse,
)

from app.services.coupon_service import (
    create_coupon,
)

router = APIRouter(
    prefix="/coupons",
    tags=["Coupons"],
)


@router.post(
    "/",
    response_model=CouponResponse,
)
def add_coupon(
    coupon: CouponCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    try:

        return create_coupon(
            db,
            coupon,
        )

    except ValueError as e:

        raise HTTPException(
            status_code=400,
            detail=str(e),
        )