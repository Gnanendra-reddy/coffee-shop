import uuid

from sqlalchemy.orm import Session

from app.models.order import Order
from app.models.payment import Payment
from app.schemas.payment import PaymentCreate


def create_payment(
    db: Session,
    payment_data: PaymentCreate,
    current_user,
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

    if order.user_id != current_user.id:
        raise PermissionError(
            "You can only pay for your own orders"
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

def get_my_payments(
    db: Session,
    user_id: int,
):
    return (
        db.query(Payment)
        .join(Order)
        .filter(Order.user_id == user_id)
        .all()
    )

def get_payment(
    db: Session,
    payment_id: int,
    current_user,
):
    payment = (
        db.query(Payment)
        .filter(Payment.id == payment_id)
        .first()
    )

    if payment is None:
        return None

    # Allow admins to view any payment
    if current_user.role != "admin":
        if payment.order.user_id != current_user.id:
            raise PermissionError(
                "Access denied"
            )

    return payment

def get_all_payments(
    db: Session,
):
    return (
        db.query(Payment)
        .all()
    )