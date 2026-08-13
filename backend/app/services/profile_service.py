from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.user import ProfileUpdate

from app.utils.security import (
    hash_password,
    verify_password,
)

def update_profile(
    db: Session,
    current_user: User,
    data: ProfileUpdate,
):
    if data.full_name is not None:
        current_user.full_name = data.full_name

    if data.phone is not None:
        current_user.phone = data.phone

    db.commit()

    db.refresh(current_user)

    return current_user


def change_password(
    db: Session,
    current_user: User,
    current_password: str,
    new_password: str,
):
    if not verify_password(
        current_password,
        current_user.password,
    ):
        raise ValueError(
            "Current password is incorrect"
        )

    if current_password == new_password:
        raise ValueError(
            "New password must be different"
        )

    current_user.password = hash_password(
        new_password
    )

    db.commit()

    return {
        "message": "Password changed successfully"
    }


def deactivate_account(
    db: Session,
    current_user: User,
    password: str,
):
    if not verify_password(
        password,
        current_user.password,
    ):
        raise ValueError(
            "Password is incorrect"
        )

    current_user.is_active = False

    db.commit()

    return {
        "message": "Account deactivated successfully"
    }