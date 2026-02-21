from pydantic import BaseModel
from datetime import datetime

class DecisionCreate(BaseModel):
    user_id: str
    decision_id: str
    description: str
