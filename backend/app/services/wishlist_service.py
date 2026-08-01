from sqlalchemy.orm import Session

from app.models.coffee import Coffee
from app.models.wishlist import Wishlist
from app.schemas.wishlist import WishlistCreate


def add_to_wishlist(
    db: Session,
    wishlist: WishlistCreate,
    current_user,
):
    coffee = (
        db.query(Coffee)
        .filter(
            Coffee.id == wishlist.coffee_id
        )
        .first()
    )

    if coffee is None:
        raise ValueError(
            "Coffee not found"
        )

    existing = (
        db.query(Wishlist)
        .filter(
            Wishlist.user_id == current_user.id,
            Wishlist.coffee_id == wishlist.coffee_id,
        )
        .first()
    )

    if existing:
        raise ValueError(
            "Coffee already in wishlist"
        )

    item = Wishlist(
        user_id=current_user.id,
        coffee_id=wishlist.coffee_id,
    )

    db.add(item)

    db.commit()

    db.refresh(item)

    return item


def get_wishlist(
    db: Session,
    current_user,
):
    return (
        db.query(Wishlist)
        .filter(
            Wishlist.user_id == current_user.id
        )
        .all()
    )


def remove_from_wishlist(
    db: Session,
    wishlist_id: int,
    current_user,
):
    item = (
        db.query(Wishlist)
        .filter(
            Wishlist.id == wishlist_id,
            Wishlist.user_id == current_user.id,
        )
        .first()
    )

    if item is None:
        raise ValueError(
            "Wishlist item not found"
        )

    db.delete(item)

    db.commit()

    return {
        "message": "Removed from wishlist"
    }