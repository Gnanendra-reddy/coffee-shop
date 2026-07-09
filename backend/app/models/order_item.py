from sqlalchemy import Column, Float, ForeignKey, Integer

from app.db.database import Base


class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)

    order_id = Column(Integer, ForeignKey("orders.id"))

    coffee_id = Column(Integer, ForeignKey("coffee.id"))

    quantity = Column(Integer)

    price = Column(Float)