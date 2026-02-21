from sqlalchemy import Column, Integer, Float, String, Boolean, Date
from db.base import Base

class Execution(Base):
    __tablename__ = "executions"

    execution_id = Column(String, primary_key=True, index=True)
    commitment_id = Column(String)
    completed = Column(Boolean)
    alignment_rating = Column(Float)
    executed_at = Column(Date)
