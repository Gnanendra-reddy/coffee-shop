import os
from datetime import datetime, timedelta, timezone

from jose import jwt

from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")

EMAIL_TOKEN_EXPIRE_MINUTES = 30


def create_email_verification_token(
    email: str,
):
    expire = datetime.now(
        timezone.utc
    ) + timedelta(
        minutes=EMAIL_TOKEN_EXPIRE_MINUTES
    )

    payload = {
        "sub": email,
        "type": "email_verification",
        "exp": expire,
    }

    return jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM,
    )