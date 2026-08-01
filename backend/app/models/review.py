from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.db.database import Base


class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
    )

    coffee_id = Column(
        Integer,
        ForeignKey("coffees.id"),
    )

    rating = Column(Integer)

    comment = Column(String)

    user = relationship(
        "User",
        back_populates="reviews",
    )

    coffee = relationship(
        "Coffee",
        back_populates="reviews",
    )