from sqlalchemy.orm import Session

from app.models.user import User


def get_all_users(
    db: Session,
    page: int,
    page_size: int,
    search: str | None = None,
    role: str | None = None,
    is_active: bool | None = None,
):
    query = db.query(User)

    if search:
        query = query.filter(
            (User.full_name.ilike(f"%{search}%"))
            |
            (User.email.ilike(f"%{search}%"))
        )

    if role:
        query = query.filter(
            User.role == role
        )

    if is_active is not None:
        query = query.filter(
            User.is_active == is_active
        )

    total = query.count()

    offset = (page - 1) * page_size

    users = (
        query
        .order_by(User.id.asc())
        .offset(offset)
        .limit(page_size)
        .all()
    )

    total_pages = (
        (total + page_size - 1)
        // page_size
    )

    return {
        "data": users,
        "pagination": {
            "page": page,
            "page_size": page_size,
            "total": total,
            "total_pages": total_pages,
        },
    }


def get_user_by_id(
    db: Session,
    user_id: int,
):
    return (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )


def search_users(
    db: Session,
    search: str,
):
    return (
        db.query(User)
        .filter(
            (User.email.ilike(f"%{search}%"))
            |
            (User.full_name.ilike(f"%{search}%"))
        )
        .order_by(User.id.asc())
        .all()
    )



def set_user_active_status(
    db: Session,
    user_id: int,
    is_active: bool,
):
    user = get_user_by_id(
        db,
        user_id,
    )

    if user is None:
        raise ValueError(
            "User not found"
        )

    user.is_active = is_active

    db.commit()

    db.refresh(user)

    return user


def update_user_role(
    db: Session,
    user_id: int,
    role: str,
    current_admin_id: int,
):
    user = get_user_by_id(
        db,
        user_id,
    )

    if user is None:
        raise ValueError(
            "User not found"
        )

    if user.id == current_admin_id:
        raise ValueError(
            "You cannot change your own role"
        )

    user.role = role

    db.commit()

    db.refresh(user)

    return user