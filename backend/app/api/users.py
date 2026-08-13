from fastapi import (
    APIRouter,
    BackgroundTasks, 
    Depends, 
    HTTPException,
)
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.user import User
from app.utils.security import hash_password
from app.core.auth import create_access_token

from app.schemas.user import (
    Token, 
    UserLogin, 
    UserCreate, 
    UserResponse,
    UserLogin,
    EmailVerificationRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
)

from app.utils.security import verify_password

from app.services.email_service import (
    send_verification_email,
    send_password_reset_email,
)

from app.services.user_service import (
    verify_email,
    request_password_reset,
    reset_password,
)

router = APIRouter(prefix="/users", tags=["Users"])


@router.post("/register", response_model=UserResponse)
def register_user(
    user: UserCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    existing_user = db.query(User).filter(User.email == user.email).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    new_user = User(
        full_name=user.full_name,
        email=user.email,
        password=hash_password(user.password),
        phone=user.phone,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    send_verification_email(
        background_tasks,
        new_user.email,
        new_user.full_name,
    )

    return new_user

@router.post("/login", response_model=Token)
def login(user: UserLogin, db: Session = Depends(get_db)):
    existing_user = (
        db.query(User)
        .filter(User.email == user.email)
        .first()
    )

    if not existing_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    password_valid = verify_password(
        user.password,
        existing_user.password
    )

    if not password_valid:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    access_token = create_access_token(
        data={
            "sub": existing_user.email
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


@router.post(
    "/verify-email",
)
def verify_user_email(
    request: EmailVerificationRequest,
    db: Session = Depends(get_db),
):
    try:
        user = verify_email(
            db,
            request.token,
        )

        return {
            "message": "Email verified successfully"
        }

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )


@router.post(
    "/forgot-password",
)
def forgot_password(
    request: ForgotPasswordRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    token = request_password_reset(
        db,
        request.email,
    )

    if token:
        send_password_reset_email(
            background_tasks,
            request.email,
        )

    return {
        "message": (
            "If the account exists, "
            "a password reset email "
            "has been sent"
        )
    }


@router.post(
    "/reset-password",
)
def reset_user_password(
    request: ResetPasswordRequest,
    db: Session = Depends(get_db),
):
    try:
        return reset_password(
            db,
            request.token,
            request.new_password,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )