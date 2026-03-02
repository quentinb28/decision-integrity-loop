from openai import OpenAI
from sqlalchemy.orm import Session
from models.decision_context import DecisionContext
from models.value_score import ValueScore
from dotenv import load_dotenv
import os
import json
import re

load_dotenv()

client = OpenAI()

def rank_commitments_from_valued(decision_context, values):

    # Build prompt
    prompt = f"""
    You are a decision-support assistant.

    Given the user's current decision context:

    "{decision_context}"

    And their stated values with importance scores:

    {values}

    Your task is to:

    1. Identify any plausible next-step commitments that are explicitly or implicitly suggested by the user's decision context.
    - Do NOT invent long-term goals.
    - Only extract short-term commitments that could realistically be completed within 48 hours.

    2. For each identified commitment, assign an alignment score (1–10) representing how well the commitment aligns with the user's stated values.
    - Higher scores indicate stronger alignment with the user's most important values.

    3. Rank the commitments in descending order based on this alignment score.

    Return ONLY valid JSON in the following format:

    [
    {{
        "commitment": "...",
        "alignment_score": int
    }}
    ]

    Where:
    - Each commitment is realistically completable within 48 hours
    - alignment_score ∈ [1–10]
    - The list is ordered from highest to lowest alignment_score
    """

    # Call LLM
    response = client.chat.completions.create(
        model=os.getenv("MODEL"),
        messages=[
            {"role": "system", "content": "You generate aligned short-term commitments."},
            {"role": "user", "content": prompt}
            ]
            )

    output = response.choices[0].message.content

    # Remove markdown code fences if present
    cleaned = re.sub(r"```json|```", "", output).strip()

    try:
        parsed = json.loads(cleaned)
    except json.JSONDecodeError:
        raise ValueError(f"AI output not valid JSON:\n{cleaned}")

    # Return commitments ordered by score
    priorities = sorted(
        parsed,
        key=lambda x: x["alignment_score"],
        reverse=True
    )

    return priorities
