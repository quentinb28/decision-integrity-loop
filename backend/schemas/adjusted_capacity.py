from pydantic import BaseModel, Field

class AdjustedCapacityCreate(BaseModel):
    baseline_capacity: int = Field(ge=1, le=100)
    commitment_appraisal: float = Field(ge=1, le=10)
