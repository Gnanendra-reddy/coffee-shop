from datetime import date

from sqlalchemy.orm import Session

from app.models.coupon import Coupon
from app.schemas.coupon import CouponCreate


def create_coupon(
    db: Session,
    coupon: CouponCreate,
):
    existing = (
        db.query(Coupon)
        .filter(
            Coupon.code == coupon.code
        )
        .first()
    )

    if existing:
        raise ValueError(
            "Coupon already exists"
        )

    if (
        coupon.discount_type == "percentage"
        and coupon.value > 100
    ):
        raise ValueError(
            "Percentage discount cannot exceed 100"
        )

    new_coupon = Coupon(
        code=coupon.code,
        discount_type=coupon.discount_type,
        value=coupon.value,
        expiry_date=coupon.expiry_date,
    )

    db.add(new_coupon)

    db.commit()

    db.refresh(new_coupon)

    return new_coupon