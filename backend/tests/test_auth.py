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