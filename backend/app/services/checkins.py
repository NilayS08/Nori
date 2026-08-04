from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.checkin import CheckIn
from app.models.user import User
from app.schemas.checkins import CheckInCreate, CheckInResponse


def create_checkin(user: User, payload: CheckInCreate, db: Session) -> CheckInResponse:
    checkin = CheckIn(
        user_id=user.id,
        amount_spent=payload.amount_spent,
        notes=payload.notes,
    )
    db.add(checkin)
    db.commit()
    db.refresh(checkin)
    return CheckInResponse.model_validate(checkin)


def list_checkins(user: User, db: Session, limit: int = 20) -> list[CheckInResponse]:
    checkins = (
        db.execute(
            select(CheckIn)
            .where(CheckIn.user_id == user.id)
            .order_by(CheckIn.created_at.desc())
            .limit(limit)
        )
        .scalars()
        .all()
    )
    return [CheckInResponse.model_validate(checkin) for checkin in checkins]


def get_latest_checkin(user: User, db: Session) -> CheckInResponse | None:
    checkin = db.execute(
        select(CheckIn)
        .where(CheckIn.user_id == user.id)
        .order_by(CheckIn.created_at.desc())
        .limit(1)
    ).scalar_one_or_none()
    if checkin is None:
        return None
    return CheckInResponse.model_validate(checkin)
