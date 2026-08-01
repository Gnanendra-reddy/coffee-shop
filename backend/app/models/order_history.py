from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.db.database import Base


class OrderHistory(Base):
    __tablename__ = "order_history"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    order_id = Column(
        Integer,
        ForeignKey("orders.id"),
    )

    status = Column(String)

    changed_at = Column(
        DateTime,
        default=datetime.utcnow,
    )

    order = relationship(
        "Order",
        back_populates="history",
    )