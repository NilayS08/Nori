from datetime import UTC, datetime

from fastapi import APIRouter

router = APIRouter(tags=["Health"])


@router.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "Nori Backend",
        "version": "0.1.0",
        "timestamp": datetime.now(UTC).isoformat(),
    }
