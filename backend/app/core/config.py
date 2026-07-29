from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Nori"
    app_env: str = "development"
    app_host: str = "127.0.0.1"
    app_port: int = 8000
    debug: bool = True

    database_url: str

    secret_key: str
    algorithm: str
    access_token_expire_minutes: int

    ai_provider: str = "gemini"

    gemini_api_key: str

    frontend_url: str

    log_level: str = "INFO"

    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", case_sensitive=False
    )


@lru_cache
def get_settings():
    return Settings()


settings = get_settings()
