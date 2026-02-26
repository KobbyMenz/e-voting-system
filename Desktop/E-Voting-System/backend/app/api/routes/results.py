from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from core.database import get_db
from models.vote import Vote
from models.candidate import Candidate
from models.election import Election
from services.election_service import get_election_with_updated_status

router = APIRouter(prefix="/results", tags=["Results"])


@router.get("/{election_id}")
def get_results(election_id: int, db: Session = Depends(get_db)):
    # Update election status before fetching results
    election = get_election_with_updated_status(db, election_id)
    if not election:
        raise HTTPException(404, "Election not found")

    results = (
        db.query(
            Candidate.name,
            func.count(Vote.id).label("votes")
        )
        .join(Vote, Vote.candidate_id == Candidate.id)
        .filter(Candidate.election_id == election_id)
        .group_by(Candidate.name)
        .all()
    )

    return [{"candidate": r[0], "votes": r[1]} for r in results]
