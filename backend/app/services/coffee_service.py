from sqlalchemy.orm import Session

from app.models.coffee import Coffee
from app.schemas.coffee import CoffeeCreate


def create_coffee(db: Session, coffee: CoffeeCreate):
    new_coffee = Coffee(
        name=coffee.name,
        description=coffee.description,
        category=coffee.category,
        price=coffee.price,
        stock=coffee.stock,
        image_url=coffee.image_url,
    )

    db.add(new_coffee)
    db.commit()
    db.refresh(new_coffee)

    return new_coffee


def get_all_coffees(db: Session):
    return db.query(Coffee).all()


def get_coffee_by_id(db: Session, coffee_id: int):
    return (
        db.query(Coffee)
        .filter(Coffee.id == coffee_id)
        .first()
    )