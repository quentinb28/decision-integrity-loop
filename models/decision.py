from sqlalchemy import Column, String, Boolean
from db.base import Base

class Decision(Base):
    __tablename__ = "decisions"

    user_id = Column(String, primary_key=True, index=True)
    decision_id = Column(String)
    description = Column(String)
    
