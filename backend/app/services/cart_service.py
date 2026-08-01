from sqlalchemy.orm import Session

from app.models.cart import Cart
from app.models.cart_item import CartItem
from app.models.coffee import Coffee
from app.schemas.cart import CartItemCreate

from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.coffee import Coffee


from datetime import date
from app.models.coupon import Coupon
from app.models.coupon_usage import CouponUsage

def add_to_cart(
    db: Session,
    cart_item: CartItemCreate,
    current_user,
):
    cart = (
        db.query(Cart)
        .filter(Cart.user_id == current_user.id)
        .first()
    )

    if cart is None:
        cart = Cart(user_id=current_user.id)
        db.add(cart)
        db.commit()
        db.refresh(cart)

    coffee = (
        db.query(Coffee)
        .filter(Coffee.id == cart_item.coffee_id)
        .first()
    )

    if coffee is None:
        raise ValueError("Coffee not found")

    existing_item = (
        db.query(CartItem)
        .filter(
            CartItem.cart_id == cart.id,
            CartItem.coffee_id == cart_item.coffee_id,
        )
        .first()
    )

    if existing_item:
        existing_item.quantity += cart_item.quantity
    else:
        existing_item = CartItem(
            cart_id=cart.id,
            coffee_id=cart_item.coffee_id,
            quantity=cart_item.quantity,
        )
        db.add(existing_item)

    db.commit()
    db.refresh(existing_item)
    db.refresh(existing_item, attribute_names=["coffee"])

    subtotal = existing_item.quantity * existing_item.coffee.price

    return {
    "id": existing_item.id,
    "coffee": existing_item.coffee,
    "quantity": existing_item.quantity,
    "subtotal": subtotal,
    }

def get_cart(
    db: Session,
    current_user,
):
    cart = (
        db.query(Cart)
        .filter(Cart.user_id == current_user.id)
        .first()
    )

    if cart is None:
        return {
            "items": [],
            "total": 0,
        }

    response = []
    total = 0

    for item in cart.items:

        subtotal = item.quantity * item.coffee.price

        total += subtotal

        response.append(
            {
                "id": item.id,
                "coffee": item.coffee,
                "quantity": item.quantity,
                "subtotal": subtotal,
            }
        )


    return {
    "items": response,
    "total": total,
    }


def update_cart_item(
    db: Session,
    item_id: int,
    quantity: int,
    current_user,
):
    cart = (
        db.query(Cart)
        .filter(Cart.user_id == current_user.id)
        .first()
    )

    if cart is None:
        raise ValueError("Cart not found")

    item = (
        db.query(CartItem)
        .filter(
            CartItem.id == item_id,
            CartItem.cart_id == cart.id,
        )
        .first()
    )

    if item is None:
        raise ValueError("Cart item not found")

    if quantity <= 0:
        raise ValueError("Quantity must be greater than 0")

    item.quantity = quantity

    db.commit()
    db.refresh(item)

    return item

def remove_cart_item(
    db: Session,
    item_id: int,
    current_user,
):
    cart = (
        db.query(Cart)
        .filter(Cart.user_id == current_user.id)
        .first()
    )

    if cart is None:
        raise ValueError("Cart not found")

    item = (
        db.query(CartItem)
        .filter(
            CartItem.id == item_id,
            CartItem.cart_id == cart.id,
        )
        .first()
    )

    if item is None:
        raise ValueError("Cart item not found")

    db.delete(item)
    db.commit()

    return {"message": "Item removed from cart"}


def clear_cart(
    db: Session,
    current_user,
):
    cart = (
        db.query(Cart)
        .filter(Cart.user_id == current_user.id)
        .first()
    )

    if cart is None:
        return {"message": "Cart already empty"}

    (
        db.query(CartItem)
        .filter(CartItem.cart_id == cart.id)
        .delete()
    )

    db.commit()

    return {"message": "Cart cleared"}


def checkout_cart(
    db: Session,
    current_user,
    coupon_code: str | None = None,
):
    cart = (
        db.query(Cart)
        .filter(Cart.user_id == current_user.id)
        .first()
    )

    if cart is None or len(cart.items) == 0:
        raise ValueError("Cart is empty")

    total = 0

    discount = 0

    coupon = None

    if coupon_code:

        coupon = (
            db.query(Coupon)
            .filter(
                Coupon.code == coupon_code
            )
            .first()
        )

        if coupon is None:
            raise ValueError(
                "Invalid coupon"
            )

        if coupon.expiry_date < date.today():
            raise ValueError(
                "Coupon expired"
            )

        used = (
            db.query(CouponUsage)
            .filter(
                CouponUsage.coupon_id == coupon.id,
                CouponUsage.user_id == current_user.id,
            )
            .first()
        )

        if used:
            raise ValueError(
                "Coupon already used"
            )

    order = Order(
        user_id=current_user.id,
        total_amount=0,
        status="Pending",
    )

    db.add(order)
    db.commit()
    db.refresh(order)

    for item in cart.items:

        coffee = (
            db.query(Coffee)
            .filter(Coffee.id == item.coffee_id)
            .first()
        )

        if coffee.stock < item.quantity:
            raise ValueError(
                f"Not enough stock for {coffee.name}"
            )

        coffee.stock -= item.quantity

        subtotal = coffee.price * item.quantity

        total += subtotal

        order_item = OrderItem(
            order_id=order.id,
            coffee_id=coffee.id,
            quantity=item.quantity,
            price=coffee.price,
        )

        db.add(order_item)

    order.total_amount = total

    if coupon:

        if coupon.discount_type == "percentage":

            discount = (
                total * coupon.value
            ) / 100

        else:

            discount = coupon.value

        if discount > total:
            discount = total

        order.total_amount = total - discount

        usage = CouponUsage(
            coupon_id=coupon.id,
            user_id=current_user.id,
        )

        db.add(usage)

    (
        db.query(CartItem)
        .filter(CartItem.cart_id == cart.id)
        .delete()
    )

    db.commit()
    db.refresh(order)

    return order