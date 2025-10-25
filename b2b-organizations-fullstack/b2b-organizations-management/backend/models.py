from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from database import Base

class StatusEnum(str, enum.Enum):
    ACTIVE = "Active"
    BLOCKED = "Blocked"
    INACTIVE = "Inactive"

class RoleEnum(str, enum.Enum):
    ADMIN = "Admin"
    COORDINATOR = "Co-ordinator"

class Organization(Base):
    __tablename__ = "organizations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    slug = Column(String, unique=True, nullable=False, index=True)
    organization_mail = Column(String, nullable=False)
    contact = Column(String, nullable=False)
    website_url = Column(String)
    primary_admin_name = Column(String)
    primary_admin_email = Column(String)
    support_email = Column(String)
    phone_no = Column(String)
    alternative_phone_no = Column(String)
    max_coordinators = Column(String, default="Upto 5 Coordinators")
    timezone_name = Column(String, default="India Standard Time")
    timezone_region = Column(String, default="Asia/Colombo")
    language = Column(String, default="English")
    status = Column(Enum(StatusEnum), default=StatusEnum.ACTIVE)
    logo_url = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    users = relationship("User", back_populates="organization", cascade="all, delete-orphan")
    pending_requests = relationship("PendingRequest", back_populates="organization", cascade="all, delete-orphan")

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String)
    role = Column(Enum(RoleEnum), nullable=False)
    organization_id = Column(Integer, ForeignKey("organizations.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    organization = relationship("Organization", back_populates="users")

class PendingRequest(Base):
    __tablename__ = "pending_requests"

    id = Column(Integer, primary_key=True, index=True)
    organization_id = Column(Integer, ForeignKey("organizations.id"), nullable=False)
    request_type = Column(String)
    status = Column(String, default="pending")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    organization = relationship("Organization", back_populates="pending_requests")
