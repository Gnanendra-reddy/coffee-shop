def test_admin_users_requires_authentication(client):
    response = client.get(
        "/admin/users/"
    )

    assert response.status_code == 401



def test_admin_can_view_users(
    admin_client,
):
    response = admin_client.get(
        "/admin/users/"
    )

    assert response.status_code == 200

    data = response.json()

    assert "data" in data
    assert "pagination" in data


def test_customer_cannot_view_users(
    customer_client,
):
    response = customer_client.get(
        "/admin/users/"
    )

    assert response.status_code == 403