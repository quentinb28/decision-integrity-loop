from sqlalchemy import Column, Integer, String, Boolean, Date
from db.base import Base

class Commitment(Base):
    __tablename__ = "commitments"

    commitment_id = Column(String, primary_key=True, index=True)
    decision_id = Column(String)
    user_id = Column(String)
    next_step = Column(String)
    deadline = Column(Date)
    self_generated = Column(Boolean)
    created_at = Column(Date)
    