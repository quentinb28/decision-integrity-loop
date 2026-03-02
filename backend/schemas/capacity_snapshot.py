from pydantic import BaseModel, Field

class CapacitySnapshotCreate(BaseModel):
    sleep_quality: int = Field(ge=1, le=5)
    energy_level: int = Field(ge=1, le=5)
    stress_level: int = Field(ge=1, le=5)
    emotional_state: int = Field(ge=1, le=5)
    social_demand: int = Field(ge=1, le=5)
