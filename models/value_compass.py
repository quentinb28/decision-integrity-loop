from sqlalchemy import Column, String, JSON, DateTime
from db.base import Base

class ValueCompass(Base):
    __tablename__ = "value_compasses"

    value_compass_id = Column(String, primary_key=True, index=True)
    user_id = Column(String)
    values = Column(JSON)
    scores = Column(JSON)
    created_at = Column(DateTime)
