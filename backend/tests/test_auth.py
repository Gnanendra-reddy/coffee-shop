def test_profile_requires_authentication(client):
    response = client.get("/profile")

    assert response.status_code == 401


def test_profile_rejects_invalid_token(client):
    response = client.get(
        "/profile",
        headers={
            "Authorization": "Bearer invalid-token"
        },
    )

    assert response.status_code == 401


def test_customer_can_access_profile(
    customer_client,
):
    response = customer_client.get(
        "/profile"
    )

    assert response.status_code == 200

    data = response.json()

    assert data["message"] == "Welcome!"
    assert data["email"] == "customer@test.com"



def test_customer_fixture(
    customer_user,
):
    assert customer_user.email == (
        "customer@test.com"
    )

    assert customer_user.role == (
        "customer"
    )

    assert customer_user.is_active is True


def test_admin_fixture(
    admin_user,
):
    assert admin_user.email == (
        "admin@test.com"
    )

    assert admin_user.role == (
        "admin"
    )

    assert admin_user.is_active is True