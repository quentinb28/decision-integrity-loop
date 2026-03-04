from datetime import datetime
from db.session import SessionLocal
from models.commitment import Commitment


def expire_commitments():
    db = SessionLocal()

    try:
        db.query(Commitment).filter(
            Commitment.due_at <= datetime.utcnow(),
            Commitment.status == "active"
        ).update(
            {"status": "expired"},
            synchronize_session=False
        )

        db.commit()

    finally:
        db.close()
