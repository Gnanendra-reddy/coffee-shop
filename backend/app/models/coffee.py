from sqlalchemy import Column, Float, Integer, String

from app.db.database import Base


class Coffee(Base):
    __tablename__ = "coffee"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)

    description = Column(String)

    category = Column(String)

    price = Column(Float)

    stock = Column(Integer)

    image_url = Column(String)