from datetime import UTC, datetime
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from jose import jwt
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.config import settings
from app.core.database import get_db
from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_password,
    verify_password,
)
from app.models.refresh_token import RefreshToken
from app.models.user import User
from app.schemas.auth import (
    RefreshTokenRequest,
    TokenResponse,
    UserCreate,
    UserLogin,
    UserResponse,
)

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(
    payload: UserCreate,
    db: Annotated[Session, Depends(get_db)],
):
    existing = db.execute(select(User).where(User.email == payload.email)).scalar_one_or_none()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered",
        )

    user = User(
        email=payload.email,
        name=payload.name,
        hashed_password=hash_password(payload.password),
        user_type=payload.user_type,
        monthly_income=payload.monthly_income,
        monthly_expenses=payload.monthly_expenses,
        current_savings=payload.current_savings,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.post("/login", response_model=TokenResponse)
def login(
    payload: UserLogin,
    db: Annotated[Session, Depends(get_db)],
):
    user = db.execute(select(User).where(User.email == payload.email)).scalar_one_or_none()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    access_token = create_access_token({"sub": str(user.id)})
    refresh_token_str = create_refresh_token({"sub": str(user.id)})

    refresh_payload = jwt.decode(
        refresh_token_str, settings.secret_key, algorithms=[settings.algorithm]
    )
    db.add(
        RefreshToken(
            token=refresh_token_str,
            user_id=user.id,
            expires_at=datetime.fromtimestamp(refresh_payload["exp"], tz=UTC),
        )
    )
    db.commit()

    return TokenResponse(access_token=access_token, refresh_token=refresh_token_str)


@router.post("/refresh", response_model=TokenResponse)
def refresh(
    payload: RefreshTokenRequest,
    db: Annotated[Session, Depends(get_db)],
):
    payload_data = decode_token(payload.refresh_token)
    if payload_data is None or payload_data.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token",
        )

    stored = db.execute(
        select(RefreshToken).where(RefreshToken.token == payload.refresh_token)
    ).scalar_one_or_none()
    if not stored:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token has been revoked",
        )

    db.delete(stored)
    db.commit()

    user_id = int(payload_data["sub"])
    access_token = create_access_token({"sub": str(user_id)})
    new_refresh_token_str = create_refresh_token({"sub": str(user_id)})

    new_refresh_payload = jwt.decode(
        new_refresh_token_str, settings.secret_key, algorithms=[settings.algorithm]
    )
    db.add(
        RefreshToken(
            token=new_refresh_token_str,
            user_id=user_id,
            expires_at=datetime.fromtimestamp(new_refresh_payload["exp"], tz=UTC),
        )
    )
    db.commit()

    return TokenResponse(access_token=access_token, refresh_token=new_refresh_token_str)


@router.get("/me", response_model=UserResponse)
def get_me(
    current_user: Annotated[User, Depends(get_current_user)],
):
    return current_user
