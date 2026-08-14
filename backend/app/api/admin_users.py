from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Query,
)

from sqlalchemy.orm import Session

from app.core.auth import require_admin
from app.db.database import get_db
from app.models.user import User

from app.schemas.user import (
    AdminUserResponse,
    UserActiveStatusUpdate,
    UserRoleUpdate,
)

from app.schemas.common import (
    PaginatedUsersResponse,
)

from app.services.admin_user_service import (
    get_all_users,
    get_user_by_id,
    set_user_active_status,
    update_user_role,
)


router = APIRouter(
    prefix="/admin/users",
    tags=["Admin Users"],
)


@router.get(
    "/",
    response_model=PaginatedUsersResponse,
)
def all_users(
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
    role: str | None = None,
    is_active: bool | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_admin
    ),
):
    return get_all_users(
        db=db,
        page=page,
        page_size=page_size,
        search=search,
        role=role,
        is_active=is_active,
    )


@router.get(
    "/{user_id}",
    response_model=AdminUserResponse,
)
def user_details(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_admin
    ),
):
    user = get_user_by_id(
        db,
        user_id,
    )

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    return user


@router.put(
    "/{user_id}/status",
    response_model=AdminUserResponse,
)
def update_user_status(
    user_id: int,
    data: UserActiveStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_admin
    ),
):
    try:
        return set_user_active_status(
            db,
            user_id,
            data.is_active,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e),
        )


@router.put(
    "/{user_id}/role",
    response_model=AdminUserResponse,
)
def change_user_role(
    user_id: int,
    data: UserRoleUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_admin
    ),
):
    try:
        return update_user_role(
            db,
            user_id,
            data.role,
            current_user.id,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )