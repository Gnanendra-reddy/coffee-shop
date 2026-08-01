from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.auth import require_admin
from app.db.database import get_db
from app.schemas.analytics import (
    DashboardStats,
    BestSellingCoffee,
    TopRatedCoffee,
)
from app.services.analytics_service import (
    get_dashboard_stats,
    get_best_selling,
    get_top_rated,
)

router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"],
)


@router.get(
    "/dashboard",
    response_model=DashboardStats,
)
def dashboard(
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    return get_dashboard_stats(db)


@router.get(
    "/best-selling",
    response_model=list[BestSellingCoffee],
)
def best_selling(
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    return get_best_selling(db)


@router.get(
    "/top-rated",
    response_model=list[TopRatedCoffee],
)
def top_rated(
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    return get_top_rated(db)