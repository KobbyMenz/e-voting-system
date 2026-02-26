from sqlalchemy import Column, Integer, String, DateTime, Boolean
from core.database import Base
from datetime import datetime

class Election(Base):
    __tablename__ = "elections"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(String(500))
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=False)
    is_active = Column(Boolean, default=False)
    status = Column(String(20), default="draft")  # draft, active, closed
    created_at = Column(DateTime, default=datetime.utcnow)
