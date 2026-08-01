from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.auth import get_current_user
from app.db.database import get_db
from app.models.user import User
from app.schemas.wishlist import (
    WishlistCreate,
    WishlistResponse,
    MoveWishlistItem,
)
from app.services.wishlist_service import (
    add_to_wishlist,
    get_wishlist,
    remove_from_wishlist,
    move_to_cart,
    move_all_to_cart,
)

router = APIRouter(
    prefix="/wishlist",
    tags=["Wishlist"],
)


@router.post(
    "/",
    response_model=WishlistResponse,
)
def add(
    wishlist: WishlistCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        return add_to_wishlist(
            db,
            wishlist,
            current_user,
        )
    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )


@router.get(
    "/",
    response_model=list[WishlistResponse],
)
def view(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_wishlist(
        db,
        current_user,
    )


@router.delete("/{wishlist_id}")
def remove(
    wishlist_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        return remove_from_wishlist(
            db,
            wishlist_id,
            current_user,
        )
    except ValueError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e),
        )


@router.post("/{wishlist_id}/move")
def move(
    wishlist_id: int,
    request: MoveWishlistItem,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:

        return move_to_cart(
            db=db,
            wishlist_id=wishlist_id,
            quantity=request.quantity,
            current_user=current_user,
        )

    except ValueError as e:

        raise HTTPException(
            status_code=400,
            detail=str(e),
        )


@router.post("/move-all")
def move_all(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        return move_all_to_cart(
            db,
            current_user,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )