import httpx
import logging
from app.config import settings

logger = logging.getLogger(__name__)

# List of models to try in order of preference
MODELS = [
    "gemini-1.5-flash",
    "gemini-1.5-pro",
    "gemini-2.0-flash-exp",
]

class GeminiClient:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY

    async def _call_gemini(self, payload: dict) -> str:
        if not self.api_key:
            return "Pensez à bien vous hydrater et à privilégier 7 à 8h de sommeil pour maximiser votre récupération et vos gains."

        async with httpx.AsyncClient(timeout=25.0) as client:
            last_error = None
            for model in MODELS:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={self.api_key}"
                try:
                    response = await client.post(url, json=payload)
                    if response.status_code == 200:
                        data = response.json()
                        candidates = data.get("candidates", [])
                        if candidates:
                            parts = candidates[0].get("content", {}).get("parts", [])
                            if parts:
                                return parts[0].get("text", "")
                    else:
                        last_error = f"Status {response.status_code}: {response.text}"
                except Exception as e:
                    last_error = str(e)
                    continue

            logger.error(f"Gemini API failed on all models: {last_error}")
            return "Privilégiez la régularité et une surcharge progressive sur vos exercices polyarticulaires pour continuer à progresser !"

    async def generate_content(self, prompt: str) -> str:
        payload = {
            "contents": [{"parts": [{"text": prompt}]}]
        }
        return await self._call_gemini(payload)

    async def generate_with_system_prompt(self, system_prompt: str, user_message: str) -> str:
        payload = {
            "system_instruction": {
                "parts": [{"text": system_prompt}]
            },
            "contents": [
                {"parts": [{"text": user_message}]}
            ]
        }
        return await self._call_gemini(payload)
