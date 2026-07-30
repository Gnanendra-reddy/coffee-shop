from sqlalchemy import Column, ForeignKey, Integer
from sqlalchemy.orm import relationship

from app.db.database import Base


class CartItem(Base):
    __tablename__ = "cart_items"

    id = Column(Integer, primary_key=True, index=True)

    cart_id = Column(
        Integer,
        ForeignKey("carts.id"),
    )

    coffee_id = Column(
        Integer,
        ForeignKey("coffees.id"),
    )

    quantity = Column(Integer)

    cart = relationship(
        "Cart",
        back_populates="items",
    )

    coffee = relationship(
        "Coffee",
        back_populates="cart_items",
    )