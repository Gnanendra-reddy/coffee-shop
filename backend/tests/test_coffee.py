def test_get_coffees(client):
    response = client.get("/coffee/")

    assert response.status_code == 200

    data = response.json()

    assert "data" in data
    assert "pagination" in data


def test_coffee_pagination(client):
    response = client.get(
        "/coffee/?page=1&page_size=5"
    )

    assert response.status_code == 200

    data = response.json()

    assert data["pagination"]["page"] == 1
    assert data["pagination"]["page_size"] == 5


def test_coffee_invalid_page(client):
    response = client.get(
        "/coffee/?page=0"
    )

    assert response.status_code == 422


def test_coffee_invalid_page_size(client):
    response = client.get(
        "/coffee/?page_size=101"
    )

    assert response.status_code == 422