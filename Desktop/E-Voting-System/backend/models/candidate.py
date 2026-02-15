from sqlalchemy import Column, Integer, String, ForeignKey
from core.database import Base

class Candidate(Base):
    __tablename__ = "candidates"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    election_id = Column(Integer, ForeignKey("elections.id"))
