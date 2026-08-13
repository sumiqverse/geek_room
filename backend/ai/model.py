import os
import base64
import json
import re
from io import BytesIO
from PIL import Image
import requests

class VisionModel:
    """
    Gemini Vision API for racing track condition detection.
    Real ML inference via Google Gemini 1.5 Flash (free tier: 1500 req/day).
    Falls back to local OpenCV heuristics if API key is missing.
    """

    LABELS_PROMPT = (
        "You are an expert motorsport safety analyst. Analyze this racing track image.\n"
        "Classify the track surface as EXACTLY one of: WET, DAMP, or DRY.\n\n"
        "WET  = Standing water, heavy rain, large water spray from cars, flooded patches\n"
        "DAMP = Light moisture, drying surface, damp patches, light spray\n"
        "DRY  = Completely dry tarmac, no visible moisture\n\n"
        "Respond with ONLY valid JSON, no extra text:\n"
        "{\"condition\": \"WET\", \"confidence\": 0.92}"
    )

    def __init__(self):
        self.gemini_key = os.environ.get("GEMINI_API_KEY", "")
        self.gemini_url = (
            "https://generativelanguage.googleapis.com/v1beta/models/"
            "gemini-1.5-flash:generateContent"
        )
        if self.gemini_key:
            print("Initializing Gemini Vision ML Model (gemini-1.5-flash)...")
        else:
            print("WARNING: GEMINI_API_KEY not set. Using local fallback.")

    # ── Gemini ML inference ────────────────────────────────────────────────
    def _gemini_infer(self, image: Image.Image) -> dict:
        if image.mode != "RGB":
            image = image.convert("RGB")

        buf = BytesIO()
        image.save(buf, format="JPEG")
        img_b64 = base64.b64encode(buf.getvalue()).decode()

        payload = {
            "contents": [{
                "parts": [
                    {"text": self.LABELS_PROMPT},
                    {"inline_data": {"mime_type": "image/jpeg", "data": img_b64}}
                ]
            }],
            "generationConfig": {
                "temperature": 0.05,
                "maxOutputTokens": 80
            }
        }

        r = requests.post(
            self.gemini_url,
            params={"key": self.gemini_key},
            json=payload,
            timeout=25
        )
        r.raise_for_status()
        data = r.json()

        text = data["candidates"][0]["content"]["parts"][0]["text"].strip()
        print(f"[Gemini raw] {text}")

        match = re.search(r'\{[^}]+\}', text, re.DOTALL)
        if not match:
            raise ValueError(f"No JSON in Gemini response: {text}")

        result = json.loads(match.group())
        condition = str(result.get("condition", "UNCERTAIN")).upper()
        confidence = float(result.get("confidence", 0.7))

        if condition not in ("WET", "DAMP", "DRY"):
            condition = "UNCERTAIN"

        return {"condition": condition, "confidence": round(min(0.99, max(0.0, confidence)), 4)}

    # ── Local OpenCV fallback (no API key) ────────────────────────────────
    def _local_infer(self, image: Image.Image) -> dict:
        import numpy as np
        import cv2
        if image.mode != "RGB":
            image = image.convert("RGB")
        arr = np.array(image)
        img_bgr = cv2.cvtColor(arr, cv2.COLOR_RGB2BGR)

        h, w = img_bgr.shape[:2]
        track_bgr = img_bgr[int(h * 0.45):, :]
        th, tw = track_bgr.shape[:2]

        track_hsv = cv2.cvtColor(track_bgr, cv2.COLOR_BGR2HSV).astype(np.float32)
        t_sat = track_hsv[:, :, 1]
        t_val = track_hsv[:, :, 2]
        gray  = cv2.cvtColor(track_bgr, cv2.COLOR_BGR2GRAY).astype(np.float32)
        b_t, _, r_t = cv2.split(track_bgr.astype(np.float32))

        mean_sat  = float(np.mean(t_sat))
        lap       = cv2.Laplacian(gray, cv2.CV_64F)
        tex_norm  = float(np.clip(np.var(lap) / 2000.0, 0, 1))
        spray     = float(np.sum((t_val > 130) & (t_val < 245) & (t_sat < 35))) / (th * tw)
        wet_asp   = float(np.sum((t_val < 140) & (t_sat < 55))) / (th * tw)
        br_ratio  = float(np.mean((b_t + 1) / (r_t + 1)))
        haze      = float(np.clip(1.0 - np.mean(np.abs(lap)) / 15.0, 0, 1))

        wet  = float(np.clip(
            0.30 * max(0.0, (80 - mean_sat) / 80) + 0.20 * wet_asp +
            0.20 * min(1.0, spray / 0.12) + 0.15 * max(0.0, 1.0 - tex_norm) +
            0.10 * max(0.0, (br_ratio - 0.95) / 0.3) + 0.05 * haze, 0, 1))
        damp = float(np.clip(1.0 - abs(wet - 0.42) / 0.42, 0, 1)) * 0.80
        dry  = float(np.clip(0.50 * tex_norm + 0.30 * min(1.0, mean_sat / 80.0) +
                              0.20 * max(0.0, 1.0 - spray / 0.05), 0, 1))

        scores = {"WET": wet, "DAMP": damp, "DRY": dry}
        cond = max(scores, key=scores.get)
        conf = round(min(0.85, max(0.45, scores[cond])), 4)
        print(f"[LocalFallback] sat={mean_sat:.1f} wet={wet:.3f} dry={dry:.3f} -> {cond}")
        return {"condition": cond, "confidence": conf}

    # ── Public API ────────────────────────────────────────────────────────
    def infer(self, image: Image.Image) -> dict:
        if self.gemini_key:
            try:
                result = self._gemini_infer(image)
                print(f"[Gemini ML] -> {result['condition']} ({result['confidence']:.2%})")
                return result
            except Exception as e:
                print(f"[Gemini ML] Error: {e}. Falling back to local.")

        return self._local_infer(image)
