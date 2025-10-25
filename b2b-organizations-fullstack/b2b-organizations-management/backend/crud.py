from sqlalchemy.orm import Session
from sqlalchemy import func
import models
import schemas
from typing import List, Optional

# Organization CRUD
def get_organizations(db: Session, skip: int = 0, limit: int = 100):
    organizations = db.query(models.Organization).offset(skip).limit(limit).all()
    result = []
    for org in organizations:
        org_dict = {
            "id": org.id,
            "name": org.name,
            "slug": org.slug,
            "organization_mail": org.organization_mail,
            "contact": org.contact,
            "website_url": org.website_url,
            "primary_admin_name": org.primary_admin_name,
            "primary_admin_email": org.primary_admin_email,
            "support_email": org.support_email,
            "phone_no": org.phone_no,
            "alternative_phone_no": org.alternative_phone_no,
            "max_coordinators": org.max_coordinators,
            "timezone_name": org.timezone_name,
            "timezone_region": org.timezone_region,
            "language": org.language,
            "status": org.status,
            "logo_url": org.logo_url,
            "created_at": org.created_at,
            "updated_at": org.updated_at,
            "pending_requests_count": db.query(func.count(models.PendingRequest.id)).filter(
                models.PendingRequest.organization_id == org.id
            ).scalar()
        }
        result.append(org_dict)
    return result

def get_organization(db: Session, organization_id: int):
    org = db.query(models.Organization).filter(models.Organization.id == organization_id).first()
    if org:
        org_dict = {
            "id": org.id,
            "name": org.name,
            "slug": org.slug,
            "organization_mail": org.organization_mail,
            "contact": org.contact,
            "website_url": org.website_url,
            "primary_admin_name": org.primary_admin_name,
            "primary_admin_email": org.primary_admin_email,
            "support_email": org.support_email,
            "phone_no": org.phone_no,
            "alternative_phone_no": org.alternative_phone_no,
            "max_coordinators": org.max_coordinators,
            "timezone_name": org.timezone_name,
            "timezone_region": org.timezone_region,
            "language": org.language,
            "status": org.status,
            "logo_url": org.logo_url,
            "created_at": org.created_at,
            "updated_at": org.updated_at,
            "pending_requests_count": db.query(func.count(models.PendingRequest.id)).filter(
                models.PendingRequest.organization_id == org.id
            ).scalar()
        }
        return org_dict
    return None

def create_organization(db: Session, organization: schemas.OrganizationCreate):
    db_organization = models.Organization(**organization.dict())
    db.add(db_organization)
    db.commit()
    db.refresh(db_organization)
    # Add some default pending requests
    for i in range(45):
        pending_request = models.PendingRequest(
            organization_id=db_organization.id,
            request_type=f"Request {i+1}",
            status="pending"
        )
        db.add(pending_request)
    db.commit()
    return get_organization(db, db_organization.id)

def update_organization(db: Session, organization_id: int, organization: schemas.OrganizationUpdate):
    db_organization = db.query(models.Organization).filter(models.Organization.id == organization_id).first()
    if db_organization:
        update_data = organization.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_organization, key, value)
        db.commit()
        db.refresh(db_organization)
        return get_organization(db, organization_id)
    return None

def delete_organization(db: Session, organization_id: int):
    db_organization = db.query(models.Organization).filter(models.Organization.id == organization_id).first()
    if db_organization:
        db.delete(db_organization)
        db.commit()
        return True
    return False

# User CRUD
def get_users_by_organization(db: Session, organization_id: int):
    return db.query(models.User).filter(models.User.organization_id == organization_id).all()

def create_user(db: Session, user: schemas.UserCreate):
    db_user = models.User(**user.dict())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def update_user(db: Session, user_id: int, user: schemas.UserUpdate):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if db_user:
        update_data = user.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_user, key, value)
        db.commit()
        db.refresh(db_user)
        return db_user
    return None

def delete_user(db: Session, user_id: int):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if db_user:
        db.delete(db_user)
        db.commit()
        return True
    return False
