from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from enum import Enum

class StatusEnum(str, Enum):
    ACTIVE = "Active"
    BLOCKED = "Blocked"
    INACTIVE = "Inactive"

class RoleEnum(str, Enum):
    ADMIN = "Admin"
    COORDINATOR = "Co-ordinator"

# Organization Schemas
class OrganizationBase(BaseModel):
    name: str
    slug: str
    organization_mail: str
    contact: str
    website_url: Optional[str] = None
    primary_admin_name: Optional[str] = None
    primary_admin_email: Optional[str] = None
    support_email: Optional[str] = None
    phone_no: Optional[str] = None
    alternative_phone_no: Optional[str] = None
    max_coordinators: Optional[str] = "Upto 5 Coordinators"
    timezone_name: Optional[str] = "India Standard Time"
    timezone_region: Optional[str] = "Asia/Colombo"
    language: Optional[str] = "English"
    status: Optional[StatusEnum] = StatusEnum.ACTIVE
    logo_url: Optional[str] = None

class OrganizationCreate(OrganizationBase):
    pass

class OrganizationUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    organization_mail: Optional[str] = None
    contact: Optional[str] = None
    website_url: Optional[str] = None
    primary_admin_name: Optional[str] = None
    primary_admin_email: Optional[str] = None
    support_email: Optional[str] = None
    phone_no: Optional[str] = None
    alternative_phone_no: Optional[str] = None
    max_coordinators: Optional[str] = None
    timezone_name: Optional[str] = None
    timezone_region: Optional[str] = None
    language: Optional[str] = None
    status: Optional[StatusEnum] = None
    logo_url: Optional[str] = None

class Organization(OrganizationBase):
    id: int
    created_at: datetime
    updated_at: datetime
    pending_requests_count: int = 0

    class Config:
        from_attributes = True

# User Schemas
class UserBase(BaseModel):
    name: str
    role: RoleEnum
    email: Optional[str] = None

class UserCreate(UserBase):
    organization_id: int

class UserUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[RoleEnum] = None
    email: Optional[str] = None

class User(UserBase):
    id: int
    organization_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Organization with Users
class OrganizationWithUsers(Organization):
    users: List[User] = []

    class Config:
        from_attributes = True
