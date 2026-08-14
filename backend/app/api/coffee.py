from typing import Literal
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.db.database import get_db

from app.core.auth import require_admin

from app.schemas.coffee import (
    CoffeeCreate,
    CoffeeResponse,
    CoffeeUpdate,
    CoffeeListResponse,
)

from app.services.coffee_service import (
    create_coffee,
    get_all_coffees,
    get_coffee_by_id,
    update_coffee,
    delete_coffee,
)

router = APIRouter(
    prefix="/coffee",
    tags=["Coffee"],
)


@router.post("/", response_model=CoffeeResponse)

def add_coffee(
    coffee: CoffeeCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    return create_coffee(db, coffee)

@router.get("/")
def get_coffees(
    page: int = Query(
        default=1,
        ge=1,
    ),
    page_size: int = Query(
        default=10,
        ge=1,
        le=100,
    ),
    search: str | None = None,
    category: str | None = None,
    min_price: float | None = Query(
        default=None,
        ge=0,
    ),
    max_price: float | None = Query(
        default=None,
        ge=0,
    ),
    sort_by: Literal[
        "id",
        "name",
        "price",
    ] = "id",
    order: Literal[
        "asc",
        "desc",
    ] = "asc",
    db: Session = Depends(get_db),
):
    return get_all_coffees(
        db=db,
        page=page,
        page_size=page_size,
        search=search,
        category=category,
        min_price=min_price,
        max_price=max_price,
        sort_by=sort_by,
        order=order,
    )


@router.get("/{coffee_id}", response_model=CoffeeResponse)
def get_single_coffee(
    coffee_id: int,
    db: Session = Depends(get_db),
):
    coffee = get_coffee_by_id(db, coffee_id)

    if coffee is None:
        raise HTTPException(
            status_code=404,
            detail="Coffee not found",
        )

    return coffee

@router.put("/{coffee_id}", response_model=CoffeeResponse)
def update_single_coffee(
    coffee_id: int,
    coffee: CoffeeUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    updated = update_coffee(
        db,
        coffee_id,
        coffee,
    )

    if updated is None:
        raise HTTPException(
            status_code=404,
            detail="Coffee not found",
        )

    return updated

@router.delete("/{coffee_id}")
def delete_single_coffee(
    coffee_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    deleted = delete_coffee(
        db,
        coffee_id,
    )

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Coffee not found",
        )

    return {
        "message": "Coffee deleted successfully"
    }