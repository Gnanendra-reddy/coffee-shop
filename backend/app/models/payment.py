from sqlalchemy import Column, Float, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.db.database import Base


class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)

    order_id = Column(
        Integer,
        ForeignKey("orders.id"),
        unique=True,
    )

    amount = Column(Float)

    payment_method = Column(String)

    payment_status = Column(
        String,
        default="Pending",
    )

    transaction_id = Column(
        String,
        nullable=True,
    )

    order = relationship(
        "Order",
        back_populates="payment",
    )