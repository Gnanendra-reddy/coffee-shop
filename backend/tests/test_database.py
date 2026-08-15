from app.models.user import User


def test_database_fixture_creates_user(
    db_session,
):
    user = User(
        full_name="Temporary User",
        email="temporary@test.com",
        password="temporary-password",
        role="customer",
        is_active=True,
        email_verified=True,
    )

    db_session.add(user)
    db_session.flush()

    assert user.id is not None