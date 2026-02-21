from pydantic import BaseModel
from datetime import datetime

class IdentityAnchorCreate(BaseModel):
    identity_anchor_id: str
    user_id: str
    description: str
    created_at: datetime
