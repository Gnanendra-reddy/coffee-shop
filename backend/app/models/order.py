from sqlalchemy import Column, Float, ForeignKey, Integer, String

from app.db.database import Base


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"))

    total_amount = Column(Float)

    status = Column(String, default="Pending")