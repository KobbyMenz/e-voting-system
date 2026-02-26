from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime

from core.database import get_db
from models.election import Election
from app.schemas.election import ElectionCreate, ElectionOut
from services.election_service import (
    update_election_status,
    update_all_elections_status,
    get_election_with_updated_status,
)

router = APIRouter(prefix="/elections", tags=["Elections"])


@router.post("/", response_model=ElectionOut)
def create_election(payload: ElectionCreate, db: Session = Depends(get_db)):
    election = Election(**payload.dict())
    db.add(election)
    db.commit()
    db.refresh(election)
    # Update status based on current time
    update_election_status(election)
    db.commit()
    return election


@router.get("/", response_model=list[ElectionOut])
def list_elections(db: Session = Depends(get_db)):
    # Automatically update status for all elections
    update_all_elections_status(db)
    return db.query(Election).all()


@router.get("/{election_id}", response_model=ElectionOut)
def get_election(election_id: int, db: Session = Depends(get_db)):
    election = get_election_with_updated_status(db, election_id)
    
    if not election:
        raise HTTPException(404, "Election not found")
    
    return election


@router.post("/{election_id}/activate")
def activate_election(election_id: int, db: Session = Depends(get_db)):
    election = get_election_with_updated_status(db, election_id)

    if not election:
        raise HTTPException(404, "Election not found")

    # Check if election should be automatically active based on time
    now = datetime.utcnow()
    
    if now < election.start_time:
        raise HTTPException(400, "Election has not started yet")

    if now > election.end_time:
        raise HTTPException(400, "Election has already ended")

    election.status = "active"
    election.is_active = True
    db.commit()

    return {"status": "Election activated", "election_status": election.status}
