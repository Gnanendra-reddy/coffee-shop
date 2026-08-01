from sqlalchemy import Column, Date, Float, Integer, String

from app.db.database import Base


class Coupon(Base):
    __tablename__ = "coupons"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    code = Column(
        String,
        unique=True,
        nullable=False,
    )

    discount_type = Column(
        String,
    )

    value = Column(Float)

    expiry_date = Column(Date)

