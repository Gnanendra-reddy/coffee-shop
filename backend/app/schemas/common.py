from pydantic import BaseModel

from app.schemas.user import AdminUserResponse


class PaginationResponse(BaseModel):
    page: int
    page_size: int
    total: int
    total_pages: int


class PaginatedUsersResponse(BaseModel):
    data: list[AdminUserResponse]
    pagination: PaginationResponse