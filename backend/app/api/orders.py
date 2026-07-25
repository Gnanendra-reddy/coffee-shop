from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.auth import (
    get_current_user,
    require_admin,
)

from app.db.database import get_db
from app.models.user import User

from app.schemas.order import (
    OrderCreate,
    OrderResponse,
    OrderStatusUpdate,
)

from app.services.order_service import (
    create_order,
    get_user_orders,
    get_all_orders,
    update_order_status,
    cancel_order,
)

router = APIRouter(
    prefix="/orders",
    tags=["Orders"],
)


@router.post("/", response_model=OrderResponse)
def place_order(
    order: OrderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        return create_order(
            db,
            current_user.id,
            order,
        )
    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )

@router.get("/my-orders", response_model=list[OrderResponse])
def my_orders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_user_orders(
        db,
        current_user.id,
    )

@router.get("/", response_model=list[OrderResponse])
def all_orders(
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    return get_all_orders(db)


@router.put("/{order_id}/status", response_model=OrderResponse)
def change_order_status(
    order_id: int,
    order_status: OrderStatusUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    order = update_order_status(
        db,
        order_id,
        order_status.status,
    )

    if order is None:
        raise HTTPException(
            status_code=404,
            detail="Order not found",
        )

    return order


@router.put("/{order_id}/cancel", response_model=OrderResponse)
def cancel_existing_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    try:
        order = cancel_order(
            db,
            order_id,
        )
    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )

    if order is None:
        raise HTTPException(
            status_code=404,
            detail="Order not found",
        )

    return order