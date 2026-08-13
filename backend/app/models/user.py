from sqlalchemy import Boolean, Column, Integer, String

from sqlalchemy.orm import relationship

from app.db.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    full_name = Column(String, nullable=False)

    email = Column(String, unique=True, nullable=False)

    password = Column(String, nullable=False)

    phone = Column(String, nullable=True)

    role = Column(String, default="customer")

    orders = relationship(
        "Order",
        back_populates="user",
    )

    cart = relationship(
        "Cart",
        back_populates="user",
        uselist=False,
    )

    reviews = relationship(
        "Review",
        back_populates="user",
    )

    wishlist_items = relationship(
        "Wishlist",
        back_populates="user",
        cascade="all, delete-orphan",
    )

    email_verified = Column(
            Boolean,
            default=False,
            nullable=False,
    )