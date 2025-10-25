from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import os
from dotenv import load_dotenv

import models
import schemas
import crud
from database import engine, get_db

load_dotenv()

# Create tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="B2B Organizations Management API")

# CORS configuration
origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Organization endpoints
@app.get("/api/organizations", response_model=List[schemas.Organization])
def read_organizations(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    organizations = crud.get_organizations(db, skip=skip, limit=limit)
    return organizations

@app.get("/api/organizations/{organization_id}", response_model=schemas.Organization)
def read_organization(organization_id: int, db: Session = Depends(get_db)):
    db_organization = crud.get_organization(db, organization_id=organization_id)
    if db_organization is None:
        raise HTTPException(status_code=404, detail="Organization not found")
    return db_organization

@app.post("/api/organizations", response_model=schemas.Organization)
def create_organization(organization: schemas.OrganizationCreate, db: Session = Depends(get_db)):
    return crud.create_organization(db=db, organization=organization)

@app.put("/api/organizations/{organization_id}", response_model=schemas.Organization)
def update_organization(
    organization_id: int,
    organization: schemas.OrganizationUpdate,
    db: Session = Depends(get_db)
):
    db_organization = crud.update_organization(db, organization_id=organization_id, organization=organization)
    if db_organization is None:
        raise HTTPException(status_code=404, detail="Organization not found")
    return db_organization

@app.delete("/api/organizations/{organization_id}")
def delete_organization(organization_id: int, db: Session = Depends(get_db)):
    success = crud.delete_organization(db, organization_id=organization_id)
    if not success:
        raise HTTPException(status_code=404, detail="Organization not found")
    return {"message": "Organization deleted successfully"}

# User endpoints
@app.get("/api/organizations/{organization_id}/users", response_model=List[schemas.User])
def read_users(organization_id: int, db: Session = Depends(get_db)):
    users = crud.get_users_by_organization(db, organization_id=organization_id)
    return users

@app.post("/api/users", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    return crud.create_user(db=db, user=user)

@app.put("/api/users/{user_id}", response_model=schemas.User)
def update_user(user_id: int, user: schemas.UserUpdate, db: Session = Depends(get_db)):
    db_user = crud.update_user(db, user_id=user_id, user=user)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@app.delete("/api/users/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    success = crud.delete_user(db, user_id=user_id)
    if not success:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User deleted successfully"}

@app.get("/")
def root():
    return {"message": "B2B Organizations Management API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
