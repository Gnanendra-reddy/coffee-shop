import os
from datetime import datetime, timedelta, timezone

from dotenv import load_dotenv
from jose import jwt

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")

PASSWORD_RESET_EXPIRE_MINUTES = 15


def create_password_reset_token(
    email: str,
):
    expire = datetime.now(
        timezone.utc
    ) + timedelta(
        minutes=PASSWORD_RESET_EXPIRE_MINUTES
    )

    payload = {
        "sub": email,
        "type": "password_reset",
        "exp": expire,
    }

    return jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM,
    )