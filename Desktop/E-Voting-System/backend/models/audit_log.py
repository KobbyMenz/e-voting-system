from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from core.database import Base

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    action = Column(String(255), nullable=False)
    actor = Column(String(255), nullable=False)
    ip_address = Column(String(45))
    timestamp = Column(DateTime, default=datetime.utcnow)
