from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.auth import get_current_user
from app.db.database import get_db
from app.models.user import User
from app.schemas.cart import (
    CartItemCreate,
    CartItemResponse,
    CartResponse,
    CheckoutRequest,
    CheckoutResponse,
)

from app.schemas.order import OrderResponse

from app.services.cart_service import (
    add_to_cart,
    get_cart,
    update_cart_item,
    remove_cart_item,
    clear_cart,
    checkout_cart,
)

router = APIRouter(
    prefix="/cart",
    tags=["Cart"],
)


@router.post(
    "/add",
    response_model=CartItemResponse,
)
def add_item(
    cart_item: CartItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        return add_to_cart(
            db,
            cart_item,
            current_user,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )


@router.get(
    "/",
    response_model = CartResponse,
)
def view_cart(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_cart(
        db,
        current_user,
    )

@router.put("/{item_id}")
def update_item(
    item_id: int,
    quantity: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        return update_cart_item(
            db,
            item_id,
            quantity,
            current_user,
        )
    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )


@router.delete("/{item_id}")
def delete_item(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        return remove_cart_item(
            db,
            item_id,
            current_user,
        )
    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )


@router.delete("/")
def empty_cart(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return clear_cart(
        db,
        current_user,
    )


@router.post(
    "/checkout",
    response_model=CheckoutResponse,
)
def checkout(
    checkout: CheckoutRequest | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        return checkout_cart(
            db=db,
            current_user=current_user,
            coupon_code=(
            checkout.coupon_code
                if checkout
                else None
            ),
        )

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )