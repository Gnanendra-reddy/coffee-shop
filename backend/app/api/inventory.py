from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)

from sqlalchemy.orm import Session

from app.core.auth import require_admin
from app.db.database import get_db
from app.schemas.inventory import (
    InventoryResponse,
    RestockRequest,
)
from app.services.inventory_service import (
    get_inventory,
    get_low_stock,
    restock_coffee,
)

router = APIRouter(
    prefix="/inventory",
    tags=["Inventory"],
)


@router.get(
    "/",
    response_model=list[InventoryResponse],
)
def inventory(
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    return get_inventory(db)


@router.get(
    "/low-stock",
    response_model=list[InventoryResponse],
)
def low_stock(
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    return get_low_stock(db)


@router.put(
    "/{coffee_id}/restock",
    response_model=InventoryResponse,
)
def restock(
    coffee_id: int,
    data: RestockRequest,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    try:
        return restock_coffee(
            db,
            coffee_id,
            data.quantity,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )