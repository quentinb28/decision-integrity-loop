from openai import OpenAI
from dotenv import load_dotenv
import os
import json

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def extract_top_values(identity_text: str):

    prompt = f"""
    
    From the following identity description:
    
    "{identity_text}"
    
    Infer the top 5 core values this person prioritizes in difficult situations.

    Choose ONLY from this list

    Security
    Belonging
    Autonomy
    Achievement
    Status
    Integrity
    Growth
    Contribution
    Pleasure
    Meaning

    Return a JSON with:

    values: list of 5 values
    scores: list of 5 floats representing estimated importance (sum should add up to 1)

    Response should be directly parsable using json.loads in the following format:

    Format:
    {{
    "values": ["Integrity", "Growth", ...],
    "scores": [0.9, 0.8, ...]
    }}
    """

    response = client.chat.completions.create(
        model=os.getenv("MODEL"), 
        messages=[{"role": "user", "content": prompt}],
        temperature=0,
        response_format={"type": "json_object"}
    )

    print(response.choices[0].message.content)

    return json.loads(response.choices[0].message.content)
