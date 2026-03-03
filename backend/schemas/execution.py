from pydantic import BaseModel

class ExecutionCreate(BaseModel):
    commitment_id: int
    outcome: str
    prompt_response: str
