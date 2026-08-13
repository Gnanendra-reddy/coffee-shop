from sqlalchemy.orm import Session

from app.models.coffee import Coffee


LOW_STOCK_LIMIT = 5


def get_inventory(
    db: Session,
):
    return (
        db.query(Coffee)
        .order_by(Coffee.stock.asc())
        .all()
    )


def get_low_stock(
    db: Session,
):
    return (
        db.query(Coffee)
        .filter(
            Coffee.stock <= LOW_STOCK_LIMIT
        )
        .order_by(Coffee.stock.asc())
        .all()
    )


def restock_coffee(
    db: Session,
    coffee_id: int,
    quantity: int,
):
    if quantity <= 0:
        raise ValueError(
            "Restock quantity must be greater than 0"
        )

    coffee = (
        db.query(Coffee)
        .filter(
            Coffee.id == coffee_id
        )
        .first()
    )

    if coffee is None:
        raise ValueError(
            "Coffee not found"
        )

    coffee.stock += quantity

    db.commit()

    db.refresh(coffee)

    return coffee