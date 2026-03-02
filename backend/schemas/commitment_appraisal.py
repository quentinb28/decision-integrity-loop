from pydantic import BaseModel, Field

class CommitmentAppraisalCreate(BaseModel):
    candidate_commitment: str
