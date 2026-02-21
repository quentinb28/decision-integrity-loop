from sqlalchemy import Column, Integer, Float, String, Boolean, Date
from db.base import Base

class IdentityAnchor(Base):
    __tablename__ = "identity_anchors"

    identity_anchor_id = Column(String, primary_key=True, index=True)
    user_id = Column(String)
    description = Column(String)
    created_at = Column(Date)
