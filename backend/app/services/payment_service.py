import uuid

from sqlalchemy.orm import Session

from app.models.order import Order
from app.models.payment import Payment
from app.schemas.payment import PaymentCreate


def create_payment(
    db: Session,
    payment_data: PaymentCreate,
):
    order = (
        db.query(Order)
        .filter(Order.id == payment_data.order_id)
        .first()
    )

    if order is None:
        raise ValueError("Order not found")

    if order.payment:
        raise ValueError(
            "Payment already exists for this order"
        )

    if order.status == "Cancelled":
        raise ValueError(
            "Cannot pay for a cancelled order"
        )
    payment = Payment(
        order_id=order.id,
        amount=order.total_amount,
        payment_method=payment_data.payment_method,
        payment_status="Success",
        transaction_id=str(uuid.uuid4()),
    )

    db.add(payment)

    db.commit()

    db.refresh(payment)

    return payment