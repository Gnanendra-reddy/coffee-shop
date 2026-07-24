from sqlalchemy.orm import Session

from app.models.coffee import Coffee
from app.models.order import Order
from app.models.order_item import OrderItem
from app.schemas.order import OrderCreate


def create_order(
    db: Session,
    user_id: int,
    order_data: OrderCreate,
):
    total = 0

    order = Order(
    user_id=user_id,
    total_amount=0,
    status="Pending",
)

    db.add(order)
    db.flush()

    for item in order_data.items:

        coffee = (
            db.query(Coffee)
            .filter(Coffee.id == item.coffee_id)
            .first()
        )

        if coffee is None:
            raise ValueError(
                f"Coffee {item.coffee_id} not found"
            )

        if coffee.stock < item.quantity:
            raise ValueError(
                f"Not enough stock for {coffee.name}"
            )

        coffee.stock -= item.quantity

        order_item = OrderItem(
            order_id=order.id,
            coffee_id=item.coffee_id,
            quantity=item.quantity,
            price=coffee.price,
        )

        db.add(order_item)

        total += coffee.price * item.quantity

    order.total_amount = total

    db.commit()

    db.refresh(order)

    return order