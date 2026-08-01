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
    get_order_history,
)

from app.schemas.order_history import (
    OrderHistoryResponse,
)

router = APIRouter(
    prefix="/orders",
    tags=["Orders"],
)


@router.post(
    "/",
    response_model=OrderResponse,
)
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


@router.get(
    "/my-orders",
    response_model=list[OrderResponse],
)
def my_orders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_user_orders(
        db,
        current_user.id,
    )


@router.get(
    "/",
    response_model=list[OrderResponse],
)
def all_orders(
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    return get_all_orders(db)


@router.put(
    "/{order_id}/status",
    response_model=OrderResponse,
)
def update_status(
    order_id: int,
    status: OrderStatusUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    try:

        return update_order_status(
            db,
            order_id,
            status.status,
        )

    except ValueError as e:

        raise HTTPException(
            status_code=400,
            detail=str(e),
        )



@router.put(
    "/{order_id}/cancel",
    response_model=OrderResponse,
)
def cancel(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        return cancel_order(
            db,
            order_id,
            current_user,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )

@router.get(
    "/{order_id}/history",
    response_model=list[OrderHistoryResponse],
)
def history(
    order_id: int,
    db: Session = Depends(get_db),
):
    try:
        return get_order_history(
            db,
            order_id,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e),
        )