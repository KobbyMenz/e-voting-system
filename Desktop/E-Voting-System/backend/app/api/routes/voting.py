from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session

from app.api.ws.live import manager
from core.database import get_db
from models.vote import Vote
from models.candidate import Candidate
from models.audit_log import AuditLog
from core.crypto import hash_vote, generate_salt

router = APIRouter(prefix="/vote", tags=["Voting"])


@router.post("/{candidate_id}")
async def cast_vote(
    candidate_id: int,
    request: Request,
    db: Session = Depends(get_db),
):
    voter_id = 1  # placeholder → replace with authenticated user later

    candidate = db.query(Candidate).filter(Candidate.id == candidate_id).first()
    if not candidate:
        raise HTTPException(404, "Candidate not found")

    # Check if voter already voted
    existing_vote = db.query(Vote).filter(Vote.voter_id == voter_id).first()
    if existing_vote:
        raise HTTPException(400, "You have already voted")

    salt = generate_salt()
    vote_hash = hash_vote(voter_id, candidate_id, salt)

    vote = Vote(
        voter_id=voter_id,
        candidate_id=candidate_id
    )

    db.add(vote)

    audit = AuditLog(
        action="CAST_VOTE",
        actor=f"user_{voter_id}",
        ip_address=request.client.host
    )

    db.add(audit)
    db.commit()

    await manager.broadcast({"event": "vote_cast"})

    return {"status": "Vote recorded securely", "hash": vote_hash}
