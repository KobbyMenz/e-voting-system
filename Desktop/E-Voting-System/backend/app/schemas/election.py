from pydantic import BaseModel
from datetime import datetime

class ElectionCreate(BaseModel):
    title: str
    description: str
    start_time: datetime
    end_time: datetime

class ElectionOut(ElectionCreate):
    id: int
    is_active: bool

    class Config:
        from_attributes = True
