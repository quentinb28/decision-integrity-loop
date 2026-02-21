from pydantic import BaseModel
from datetime import datetime

class CommitmentCreate(BaseModel):
    id: int
    decision_id: int
    user_id: str
    next_step: str
    start_at: datetime
    due_at: datetime
    source: str
    status: str
