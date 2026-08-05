from __future__ import annotations

from app.ai.base import AIProvider
from app.ai.gemini import GeminiProvider
from app.core.config import settings


def get_ai_provider() -> AIProvider:
    if settings.ai_provider == "gemini":
        return GeminiProvider(
            api_key=settings.gemini_api_key,
            model=settings.gemini_model,
        )
    raise ValueError(f"Unsupported AI provider: {settings.ai_provider}")
