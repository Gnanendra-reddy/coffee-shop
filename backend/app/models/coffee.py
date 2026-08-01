from sqlalchemy import Column, Float, Integer, String

from sqlalchemy.orm import relationship

from app.db.database import Base


class Coffee(Base):
    __tablename__ = "coffees"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)

    description = Column(String)

    category = Column(String)

    price = Column(Float)

    stock = Column(Integer)

    image_url = Column(String)

    order_items = relationship(
        "OrderItem",
        back_populates="coffee",
    )

    cart_items = relationship(
        "CartItem",
        back_populates="coffee",
    )

    reviews = relationship(
        "Review",
        back_populates="coffee",
    )