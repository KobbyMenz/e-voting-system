from datetime import datetime
from sqlalchemy.orm import Session
from models.election import Election


def update_election_status(election: Election) -> None:
    """
    Automatically updates election status based on current time and start/end times.
    
    Status transitions:
    - draft → active: when current time >= start_time
    - active → closed: when current time >= end_time
    - closed: final status, no further changes
    """
    now = datetime.utcnow()
    
    # If election has ended
    if now >= election.end_time:
        election.status = "closed"
        election.is_active = False
    # If election has started
    elif now >= election.start_time:
        election.status = "active"
        election.is_active = True
    # Election hasn't started yet
    else:
        election.status = "draft"
        election.is_active = False


def update_all_elections_status(db: Session) -> None:
    """
    Updates the status of all elections in the database based on current time.
    """
    elections = db.query(Election).all()
    for election in elections:
        update_election_status(election)
    db.commit()


def get_election_with_updated_status(db: Session, election_id: int) -> Election:
    """
    Retrieves a single election and updates its status before returning.
    """
    election = db.query(Election).filter(Election.id == election_id).first()
    if election:
        update_election_status(election)
        db.commit()
    return election
