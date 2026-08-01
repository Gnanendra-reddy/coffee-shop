from sqlalchemy.orm import Session

from app.models.coffee import Coffee
from app.models.wishlist import Wishlist
from app.schemas.wishlist import WishlistCreate

from app.models.cart import Cart
from app.models.cart_item import CartItem

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


def move_to_cart(
    db: Session,
    wishlist_id: int,
    quantity: int,
    current_user,
):
    wishlist_item = (
        db.query(Wishlist)
        .filter(
            Wishlist.id == wishlist_id,
            Wishlist.user_id == current_user.id,
        )
        .first()
    )

    if wishlist_item is None:
        raise ValueError(
            "Wishlist item not found"
        )

    coffee = (
        db.query(Coffee)
        .filter(
            Coffee.id == wishlist_item.coffee_id
        )
        .first()
    )

    if coffee.stock < quantity:
        raise ValueError(
            "Not enough stock available"
        )

    cart = (
        db.query(Cart)
        .filter(
            Cart.user_id == current_user.id
        )
        .first()
    )

    if cart is None:
        cart = Cart(
            user_id=current_user.id
        )

        db.add(cart)
        db.commit()
        db.refresh(cart)

    existing_item = (
        db.query(CartItem)
        .filter(
            CartItem.cart_id == cart.id,
            CartItem.coffee_id == wishlist_item.coffee_id,
        )
        .first()
    )

    if existing_item:
        existing_item.quantity += quantity

    else:
        db.add(
            CartItem(
                cart_id=cart.id,
                coffee_id=wishlist_item.coffee_id,
                quantity=quantity,
            )
        )

    db.delete(wishlist_item)

    db.commit()

    return {
        "message": "Item moved successfully",
        "coffee": coffee.name,
        "quantity": quantity,
    }

def move_all_to_cart(
    db: Session,
    current_user,
):
    wishlist_items = (
        db.query(Wishlist)
        .filter(
            Wishlist.user_id == current_user.id
        )
        .all()
    )

    if not wishlist_items:
        raise ValueError(
            "Wishlist is empty"
        )

    cart = (
        db.query(Cart)
        .filter(
            Cart.user_id == current_user.id
        )
        .first()
    )

    if cart is None:
        cart = Cart(
            user_id=current_user.id
        )

        db.add(cart)
        db.commit()
        db.refresh(cart)

    for item in wishlist_items:

        existing = (
            db.query(CartItem)
            .filter(
                CartItem.cart_id == cart.id,
                CartItem.coffee_id == item.coffee_id,
            )
            .first()
        )

        if existing:
            existing.quantity += 1

        else:
            db.add(
                CartItem(
                    cart_id=cart.id,
                    coffee_id=item.coffee_id,
                    quantity=1,
                )
            )

        db.delete(item)

    db.commit()

    return {
        "message": "Wishlist moved to cart"
    }