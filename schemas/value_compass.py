from pydantic import BaseModel
from datetime import datetime
from typing import List

class ValueCompassCreate(BaseModel):
    value_compass_id: str
    user_id: str
    values: List[str]
    scores: List[float]
    created_at: datetime
