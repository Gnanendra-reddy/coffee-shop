from sqlalchemy.orm import Session

from app.models.coffee import Coffee
from app.schemas.coffee import (
    CoffeeCreate,
    CoffeeUpdate,
)


def create_coffee(
    db: Session,
    coffee: CoffeeCreate,
):
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
    page_size: int = 10,
    search: str | None = None,
    category: str | None = None,
    min_price: float | None = None,
    max_price: float | None = None,
    sort_by: str = "id",
    order: str = "asc",
):
    query = db.query(Coffee)

    # Search by coffee name
    if search:
        query = query.filter(
            Coffee.name.ilike(
                f"%{search}%"
            )
        )

    # Filter by category
    if category:
        query = query.filter(
            Coffee.category == category
        )

    # Filter by minimum price
    if min_price is not None:
        query = query.filter(
            Coffee.price >= min_price
        )

    # Filter by maximum price
    if max_price is not None:
        query = query.filter(
            Coffee.price <= max_price
        )

    # Allow only specific sorting fields
    allowed_sort_fields = {
        "id": Coffee.id,
        "name": Coffee.name,
        "price": Coffee.price,
    }

    sort_column = allowed_sort_fields.get(
        sort_by,
        Coffee.id,
    )

    # Sorting
    if order.lower() == "desc":
        query = query.order_by(
            sort_column.desc()
        )
    else:
        query = query.order_by(
            sort_column.asc()
        )

    # Total number of matching coffees
    total = query.count()

    # Calculate offset
    offset = (
        page - 1
    ) * page_size

    # Fetch current page
    coffees = (
        query
        .offset(offset)
        .limit(page_size)
        .all()
    )

    # Calculate total pages
    total_pages = (
        (total + page_size - 1)
        // page_size
    )

    return {
        "data": coffees,
        "pagination": {
            "page": page,
            "page_size": page_size,
            "total": total,
            "total_pages": total_pages,
        },
    }


def get_coffee_by_id(
    db: Session,
    coffee_id: int,
):
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