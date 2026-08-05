from __future__ import annotations

from google import genai
from google.genai import types as genai_types

from app.core.config import settings


class GeminiProvider:
    def __init__(self, api_key: str, model: str | None = None) -> None:
        self._model = model or settings.gemini_model
        self._client = genai.Client(
            api_key=api_key,
            http_options=genai_types.HttpOptions(timeout=30_000),
        )

    def generate(self, prompt: str, system_instruction: str | None = None) -> str:
        kwargs: dict = {"model": self._model, "contents": prompt}
        if system_instruction:
            kwargs["config"] = genai_types.GenerateContentConfig(
                system_instruction=system_instruction
            )
        response = self._client.models.generate_content(**kwargs)
        text = response.text or ""
        return text.strip()
