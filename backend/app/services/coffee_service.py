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


def get_all_coffees(
    db: Session,
    page: int = 1,
    limit: int = 10,
    search: str | None = None,
    category: str | None = None,
    min_price: float | None = None,
    max_price: float | None = None,
    sort_by: str = "id",
    order: str = "asc",
):
    query = db.query(Coffee)

    if search:
        query = query.filter(
            Coffee.name.ilike(f"%{search}%")
        )

    if category:
        query = query.filter(
            Coffee.category == category
        )

    if min_price is not None:
        query = query.filter(
            Coffee.price >= min_price
        )

    if max_price is not None:
        query = query.filter(
            Coffee.price <= max_price
        )

    sort_column = getattr(
        Coffee,
        sort_by,
        Coffee.id,
    )

    if order.lower() == "desc":
        query = query.order_by(
            sort_column.desc()
        )
    else:
        query = query.order_by(
            sort_column.asc()
        )

    total = query.count()

    coffees = (
        query.offset((page - 1) * limit)
        .limit(limit)
        .all()
    )

    return {
        "page": page,
        "limit": limit,
        "total": total,
        "data": coffees,
    }



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

