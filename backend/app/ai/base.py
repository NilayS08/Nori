from __future__ import annotations

from typing import Protocol


class AIProvider(Protocol):
    def generate(self, prompt: str, system_instruction: str | None = None) -> str:
        """Return a text response for ``prompt``. Raise on failure."""
        ...
