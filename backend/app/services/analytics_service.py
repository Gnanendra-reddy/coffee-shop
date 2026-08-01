from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.user import User
from app.models.order import Order
from app.models.coffee import Coffee
from app.models.order_item import OrderItem
from app.models.review import Review


def get_dashboard_stats(
    db: Session,
):
    total_customers = (
        db.query(User)
        .filter(User.role == "customer")
        .count()
    )

    total_orders = (
        db.query(Order)
        .count()
    )

    total_coffees = (
        db.query(Coffee)
        .count()
    )

    total_revenue = (
        db.query(
            func.coalesce(
                func.sum(Order.total_amount),
                0,
            )
        )
        .scalar()
    )

    return {
        "total_customers": total_customers,
        "total_orders": total_orders,
        "total_coffees": total_coffees,
        "total_revenue": total_revenue,
    }


def get_best_selling(
    db: Session,
):
    results = (
        db.query(
            Coffee.name,
            func.sum(OrderItem.quantity),
        )
        .join(
            OrderItem,
            Coffee.id == OrderItem.coffee_id,
        )
        .group_by(Coffee.id)
        .order_by(
            func.sum(OrderItem.quantity).desc()
        )
        .limit(5)
        .all()
    )

    return [
        {
            "coffee_name": row[0],
            "total_quantity": row[1],
        }
        for row in results
    ]



def get_top_rated(
    db: Session,
):
    results = (
        db.query(
            Coffee.name,
            func.avg(Review.rating),
        )
        .join(
            Review,
            Coffee.id == Review.coffee_id,
        )
        .group_by(Coffee.id)
        .order_by(
            func.avg(Review.rating).desc()
        )
        .limit(5)
        .all()
    )

    return [
        {
            "coffee_name": row[0],
            "average_rating": round(
                row[1],
                2,
            ),
        }
        for row in results
    ]