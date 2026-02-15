from sqlalchemy import Column, Integer, ForeignKey, DateTime, UniqueConstraint
from datetime import datetime
from core.database import Base

class Vote(Base):
    __tablename__ = "votes"

    id = Column(Integer, primary_key=True, index=True)
    voter_id = Column(Integer, ForeignKey("users.id"))
    candidate_id = Column(Integer, ForeignKey("candidates.id"))
    timestamp = Column(DateTime, default=datetime.utcnow)

    __table_args__ = (
        UniqueConstraint('voter_id', 'candidate_id', name='unique_vote'),
    )
