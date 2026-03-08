import os
os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"

from fastapi import APIRouter, Request, Depends, HTTPException
from sqlalchemy.orm import Session

from db.session import get_db
from app.services.google_auth import create_google_flow
from app.auth import get_current_user

from models.user import User


router = APIRouter()

code_verifier_store = {}


@router.get("/auth/google")
def connect_google(
    current_user: User = Depends(get_current_user)
):

    flow = create_google_flow()

    authorization_url, state = flow.authorization_url(
        access_type="offline",
        prompt="consent",
        state=current_user.id,
        include_granted_scopes="true"
    )

    # store verifier using state
    code_verifier_store[state] = flow.code_verifier

    return {
        "url": authorization_url,
        "state": state
    }


@router.get("/auth/google/callback")
def google_callback(
    request: Request,
    db: Session = Depends(get_db)
):

    flow = create_google_flow()

    state = request.query_params.get("state")

    code_verifier = code_verifier_store.get(state)

    if not code_verifier:
        raise HTTPException(status_code=400, detail="Missing code verifier")

    flow.fetch_token(
        authorization_response=str(request.url),
        code_verifier=code_verifier
    )

    credentials = flow.credentials

    access_token = credentials.token
    refresh_token = credentials.refresh_token
    expiry = credentials.expiry

    # user ID passed through OAuth state
    user_id = request.query_params.get("state")

    if not user_id:
        raise HTTPException(
            status_code=400,
            detail="Missing OAuth state"
        )

    user = db.query(User).filter(
        User.id == user_id
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    user.google_access_token = access_token
    user.google_refresh_token = refresh_token
    user.google_token_expiry = expiry 

    db.commit()

    return {
        "status": "Google Calendar connected"
    }
