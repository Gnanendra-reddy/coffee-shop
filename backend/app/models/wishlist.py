from sqlalchemy import Column, ForeignKey, Integer
from sqlalchemy.orm import relationship

from app.db.database import Base


class Wishlist(Base):
    __tablename__ = "wishlist"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
    )

    coffee_id = Column(
        Integer,
        ForeignKey("coffees.id"),
    )

    user = relationship(
        "User",
        back_populates="wishlist_items",
    )

    coffee = relationship(
        "Coffee",
        back_populates="wishlisted_by",
    )