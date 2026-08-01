from sqlalchemy import (
    Column,
    ForeignKey,
    Integer,
)

from app.db.database import Base


class CouponUsage(Base):
    __tablename__ = "coupon_usages"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    coupon_id = Column(
        Integer,
        ForeignKey("coupons.id"),
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
    )