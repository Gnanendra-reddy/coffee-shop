from jose import JWTError, jwt
from sqlalchemy.orm import Session

from app.core.email_tokens import (
    SECRET_KEY,
    ALGORITHM,
)
from app.models.user import User

from app.core.password_reset import (
    SECRET_KEY,
    ALGORITHM,
    create_password_reset_token,
)

from app.utils.security import hash_password

def verify_email(
    db: Session,
    token: str,
):
    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM],
        )

        if payload.get("type") != "email_verification":
            raise ValueError(
                "Invalid verification token"
            )

        email = payload.get("sub")

        if email is None:
            raise ValueError(
                "Invalid verification token"
            )

    except JWTError:
        raise ValueError(
            "Invalid or expired verification token"
        )

    user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    if user is None:
        raise ValueError(
            "User not found"
        )

    if user.email_verified:
        raise ValueError(
            "Email already verified"
        )

    user.email_verified = True

    db.commit()

    db.refresh(user)

    return user


def request_password_reset(
    db: Session,
    email: str,
):
    user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    if user is None:
        return None

    return create_password_reset_token(
        user.email
    )


def reset_password(
    db: Session,
    token: str,
    new_password: str,
):
    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM],
        )

        if payload.get("type") != "password_reset":
            raise ValueError(
                "Invalid reset token"
            )

        email = payload.get("sub")

        if email is None:
            raise ValueError(
                "Invalid reset token"
            )

    except JWTError:
        raise ValueError(
            "Invalid or expired reset token"
        )

    user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    if user is None:
        raise ValueError(
            "User not found"
        )

    user.password = hash_password(
        new_password
    )

    db.commit()

    return {
        "message": "Password reset successfully"
    }