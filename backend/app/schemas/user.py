from pydantic import BaseModel, ConfigDict, EmailStr

from typing import Literal

class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    phone: str | None = None


class UserResponse(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    phone: str | None = None
    role: str

    model_config = ConfigDict(
        from_attributes=True
    )

class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str

class EmailVerificationRequest(BaseModel):
    token: str

class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

class ProfileResponse(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    phone: str | None = None
    role: str
    email_verified: bool

    model_config = ConfigDict(
        from_attributes=True
    )

class ProfileUpdate(BaseModel):
    full_name: str | None = None
    phone: str | None = None

class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str

class DeleteAccountRequest(BaseModel):
    password: str

class AdminUserResponse(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    phone: str | None = None
    role: str
    email_verified: bool
    is_active: bool

    model_config = ConfigDict(
        from_attributes=True
    )

class UserRoleUpdate(BaseModel):
    role: Literal[
        "customer",
        "admin",
    ]

class UserActiveStatusUpdate(BaseModel):
    is_active: bool