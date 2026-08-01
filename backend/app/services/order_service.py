from sqlalchemy.orm import Session

from app.models.coffee import Coffee
from app.models.order import Order
from app.models.order_item import OrderItem
from app.schemas.order import OrderCreate

from app.core.order_status import (
    VALID_STATUS_FLOW,
    PENDING,
    CANCELLED,
)

from app.models.order_history import OrderHistory

def create_order(
    db: Session,
    user_id: int,
    order_data: OrderCreate,
):
    total = 0

    order = Order(
        user_id=user_id,
        total_amount=0,
        status=PENDING,
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


def get_user_orders(
    db: Session,
    user_id: int,
):
    return (
        db.query(Order)
        .filter(Order.user_id == user_id)
        .all()
    )


def get_all_orders(
    db: Session,
):
    return db.query(Order).all()


def update_order_status(
    db: Session,
    order_id: int,
    new_status: str,
):
    order = (
        db.query(Order)
        .filter(Order.id == order_id)
        .first()
    )

    if order is None:
        raise ValueError(
            "Order not found"
        )

    if not can_change_status(
        order.status,
        new_status,
    ):
        raise ValueError(
            f"Cannot change status from "
            f"{order.status} to {new_status}"
        )

    order.status = new_status

    history = OrderHistory(
        order_id=order.id,
        status=new_status,
    )

    db.add(history)

    db.commit()

    db.refresh(order)

    return order


def can_change_status(
    current_status: str,
    new_status: str,
):
    allowed = VALID_STATUS_FLOW.get(
        current_status,
        [],
    )

    return new_status in allowed


def cancel_order(
    db: Session,
    order_id: int,
    current_user,
):
    order = (
        db.query(Order)
        .filter(
            Order.id == order_id,
            Order.user_id == current_user.id,
        )
        .first()
    )

    if order is None:
        raise ValueError(
            "Order not found"
        )

    if order.status != PENDING:
        raise ValueError(
            "Order cannot be cancelled"
        )

    order.status = CANCELLED

    db.commit()

    db.refresh(order)

    return order


def get_order_history(
    db: Session,
    order_id: int,
):
    order = (
        db.query(Order)
        .filter(Order.id == order_id)
        .first()
    )

    if order is None:
        raise ValueError(
            "Order not found"
        )

    return order.history