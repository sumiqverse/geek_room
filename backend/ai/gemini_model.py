"""
Gemini Vision API backup model.
Use if HF providers don't work on Render.
Requires GEMINI_API_KEY environment variable.
Free tier: 1500 requests/day.
"""
import os
import base64
from io import BytesIO
from PIL import Image
import requests

class GeminiVisionModel:
    def __init__(self):
        self.api_key = os.environ.get("GEMINI_API_KEY", "")
        self.url = (
            "https://generativelanguage.googleapis.com/v1beta/models/"
            "gemini-1.5-flash:generateContent"
        )
        print("Initializing Gemini Vision Model...")

    def infer(self, image: Image.Image) -> dict:
        if not self.api_key:
            print("[Gemini] No API key — falling back to UNCERTAIN")
            return {"condition": "UNCERTAIN", "confidence": 0.0}

        try:
            if image.mode != "RGB":
                image = image.convert("RGB")
            buf = BytesIO()
            image.save(buf, format="JPEG")
            img_b64 = base64.b64encode(buf.getvalue()).decode()

            prompt = (
                "You are analyzing a racing track image for weather conditions. "
                "Classify the track surface condition as EXACTLY one of: WET, DAMP, or DRY.\n\n"
                "Definitions:\n"
                "- WET: Standing water, heavy rain, water spray from cars, very wet surface\n"
                "- DAMP: Drying after rain, light moisture, damp patches but no standing water\n"
                "- DRY: Completely dry track surface, no moisture visible\n\n"
                "Respond with ONLY a JSON object like: "
                "{\"condition\": \"WET\", \"confidence\": 0.92}\n"
                "confidence must be between 0.0 and 1.0."
            )

            payload = {
                "contents": [{
                    "parts": [
                        {"text": prompt},
                        {"inline_data": {"mime_type": "image/jpeg", "data": img_b64}}
                    ]
                }],
                "generationConfig": {"temperature": 0.1, "maxOutputTokens": 64}
            }

            r = requests.post(
                self.url,
                params={"key": self.api_key},
                json=payload,
                timeout=20
            )
            r.raise_for_status()
            data = r.json()

            text = data["candidates"][0]["content"]["parts"][0]["text"].strip()
            # Extract JSON from response
            import json, re
            match = re.search(r'\{.*?\}', text, re.DOTALL)
            if match:
                result = json.loads(match.group())
                condition = result.get("condition", "UNCERTAIN").upper()
                confidence = float(result.get("confidence", 0.7))
                if condition not in ("WET", "DAMP", "DRY"):
                    condition = "UNCERTAIN"
                print(f"[Gemini] → {condition} ({confidence:.2%})")
                return {"condition": condition, "confidence": round(confidence, 4)}
            else:
                print(f"[Gemini] Could not parse response: {text}")
                return {"condition": "UNCERTAIN", "confidence": 0.0}

        except Exception as e:
            print(f"[Gemini] Error: {e}")
            return {"condition": "UNCERTAIN", "confidence": 0.0}
