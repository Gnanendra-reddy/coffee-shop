from sqlalchemy.orm import Session

from app.models.user import User


def get_all_users(
    db: Session,
):
    return (
        db.query(User)
        .order_by(User.id.asc())
        .all()
    )


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