from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime

from core.database import get_db
from models.election import Election
from app.schemas.election import ElectionCreate, ElectionOut

router = APIRouter(prefix="/elections", tags=["Elections"])


@router.post("/", response_model=ElectionOut)
def create_election(payload: ElectionCreate, db: Session = Depends(get_db)):
    election = Election(**payload.dict())
    db.add(election)
    db.commit()
    db.refresh(election)
    return election


@router.get("/", response_model=list[ElectionOut])
def list_elections(db: Session = Depends(get_db)):
    return db.query(Election).all()


@router.post("/{election_id}/activate")
def activate_election(election_id: int, db: Session = Depends(get_db)):
    election = db.query(Election).filter(Election.id == election_id).first()

    if not election:
        raise HTTPException(404, "Election not found")

    if datetime.utcnow() < election.start_time:
        raise HTTPException(400, "Election has not started")

    if datetime.utcnow() > election.end_time:
        raise HTTPException(400, "Election already ended")

    election.is_active = True
    db.commit()

    return {"status": "Election activated"}
