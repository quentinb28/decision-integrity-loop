from pydantic import BaseModel
from datetime import datetime

class ExecutionCreate(BaseModel):
    execution_id: str
    commitment_id: str
    completed: bool
    alignment_rating: float
    executed_at: datetime
