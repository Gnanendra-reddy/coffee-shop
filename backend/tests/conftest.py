import os

import pytest

from dotenv import load_dotenv

from sqlalchemy import create_engine
from sqlalchemy.orm import Session

from fastapi.testclient import TestClient

from app.main import app
from app.db.database import Base, get_db

from app.models import (
    User,
    Coffee,
    Order,
    OrderItem,
    Payment,
    Cart,
    CartItem,
)

from app.core.auth import (
    get_current_user,
    require_admin,
    verify_token,
)

from app.utils.security import hash_password


load_dotenv()

os.environ["TESTING"] = "true"

TEST_DATABASE_URL = os.getenv(
    "TEST_DATABASE_URL"
)

if not TEST_DATABASE_URL:
    raise RuntimeError(
        "TEST_DATABASE_URL is not set"
    )


test_engine = create_engine(
    TEST_DATABASE_URL,
    pool_pre_ping=True,
)


@pytest.fixture(scope="session", autouse=True)
def setup_test_database():
    Base.metadata.create_all(
        bind=test_engine
    )

    yield

    Base.metadata.drop_all(
        bind=test_engine
    )


@pytest.fixture
def db_session():
    connection = test_engine.connect()

    transaction = connection.begin()

    session = Session(
        bind=connection,
        join_transaction_mode="create_savepoint",
    )

    try:
        yield session
    finally:
        session.close()
        transaction.rollback()
        connection.close()


@pytest.fixture
def client(db_session):
    def override_get_db():
        yield db_session

    app.dependency_overrides[
        get_db
    ] = override_get_db

    with TestClient(app) as test_client:
        yield test_client

    app.dependency_overrides.clear()


@pytest.fixture
def customer_user(db_session):
    user = User(
        full_name="Test Customer",
        email="customer@test.com",
        password=hash_password(
            "CustomerPass123!"
        ),
        phone="9000000001",
        role="customer",
        is_active=True,
        email_verified=True,
    )

    db_session.add(user)
    db_session.flush()

    return user


@pytest.fixture
def admin_user(db_session):
    user = User(
        full_name="Test Admin",
        email="admin@test.com",
        password=hash_password(
            "AdminPass123!"
        ),
        phone="9000000002",
        role="admin",
        is_active=True,
        email_verified=True,
    )

    db_session.add(user)
    db_session.flush()

    return user


@pytest.fixture
def customer_client(
    client,
    customer_user,
):
    def override_current_user():
        return customer_user

    def override_verify_token():
        return customer_user.email

    app.dependency_overrides[
        get_current_user
    ] = override_current_user

    app.dependency_overrides[
        verify_token
    ] = override_verify_token

    yield client

    app.dependency_overrides.pop(
        get_current_user,
        None,
    )

    app.dependency_overrides.pop(
        verify_token,
        None,
    )
    

@pytest.fixture
def admin_client(
    client,
    admin_user,
):
    def override_current_user():
        return admin_user

    def override_require_admin():
        return admin_user

    app.dependency_overrides[
        get_current_user
    ] = override_current_user

    app.dependency_overrides[
        require_admin
    ] = override_require_admin

    yield client

    app.dependency_overrides.pop(
        get_current_user,
        None,
    )

    app.dependency_overrides.pop(
        require_admin,
        None,
    )