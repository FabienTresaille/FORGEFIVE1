import httpx
from app.config import settings

class GeminiClient:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.base_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"

    async def generate_content(self, prompt: str) -> str:
        if not self.api_key:
            return "Mock Gemini response. (API Key not set)"
            
        async with httpx.AsyncClient(timeout=30.0) as client:
            for attempt in range(2):
                try:
                    response = await client.post(
                        f"{self.base_url}?key={self.api_key}",
                        json={"contents": [{"parts": [{"text": prompt}]}]}
                    )
                    response.raise_for_status()
                    data = response.json()
                    return data.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "")
                except Exception as e:
                    if attempt == 1:
                        return f"Error communicating with AI: {str(e)}"

    async def generate_with_system_prompt(self, system_prompt: str, user_message: str) -> str:
        if not self.api_key:
            return f"Mock Gemini response to '{user_message}' with system prompt."

        async with httpx.AsyncClient(timeout=30.0) as client:
            for attempt in range(2):
                try:
                    response = await client.post(
                        f"{self.base_url}?key={self.api_key}",
                        json={
                            "system_instruction": {
                                "parts": [{"text": system_prompt}]
                            },
                            "contents": [
                                {"parts": [{"text": user_message}]}
                            ]
                        }
                    )
                    response.raise_for_status()
                    data = response.json()
                    return data.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "")
                except Exception as e:
                    if attempt == 1:
                        return f"Error communicating with AI: {str(e)}"
