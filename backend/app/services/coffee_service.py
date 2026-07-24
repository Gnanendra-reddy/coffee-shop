from sqlalchemy.orm import Session

from app.models.coffee import Coffee
from app.schemas.coffee import CoffeeCreate, CoffeeUpdate


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

def update_coffee(
    db: Session,
    coffee_id: int,
    coffee_data: CoffeeUpdate,
):
    coffee = (
        db.query(Coffee)
        .filter(Coffee.id == coffee_id)
        .first()
    )

    if coffee is None:
        return None

    coffee.name = coffee_data.name
    coffee.description = coffee_data.description
    coffee.category = coffee_data.category
    coffee.price = coffee_data.price
    coffee.stock = coffee_data.stock
    coffee.image_url = coffee_data.image_url

    db.commit()
    db.refresh(coffee)

    return coffee


def delete_coffee(
    db: Session,
    coffee_id: int,
):
    coffee = (
        db.query(Coffee)
        .filter(Coffee.id == coffee_id)
        .first()
    )

    if coffee is None:
        return False

    db.delete(coffee)
    db.commit()

    return True

