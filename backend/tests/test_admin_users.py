def test_admin_users_requires_authentication(client):
    response = client.get(
        "/admin/users/"
    )

    assert response.status_code == 401