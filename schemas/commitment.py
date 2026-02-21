from pydantic import BaseModel
from datetime import datetime

class CommitmentCreate(BaseModel):
    commitment_id: str
    decision_id: str
    user_id: str
    next_step: str
    deadline: datetime
    self_generated: bool
    created_at: datetime
