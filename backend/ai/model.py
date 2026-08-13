import numpy as np
from PIL import Image
import cv2

class VisionModel:
    """
    Local image analysis for racing track condition detection.
    Uses color science and pixel statistics — no external API required.
    Eliminates DNS/network failures on Render/Vercel deployments.
    """

    def __init__(self):
        print("Initializing Local Vision Model (PIL + OpenCV)...")

    def _pil_to_bgr(self, image: Image.Image) -> np.ndarray:
        if image.mode != "RGB":
            image = image.convert("RGB")
        arr = np.array(image)
        return cv2.cvtColor(arr, cv2.COLOR_RGB2BGR)

    def _analyze_track_condition(self, img_bgr: np.ndarray) -> dict:
        """
        Analyze track wetness using multiple visual cues:
        1. Brightness (V channel HSV)  — wet tracks are darker
        2. Saturation (S channel HSV)  — wet asphalt desaturates
        3. Blue-channel ratio          — wet surfaces reflect sky (more blue)
        4. Brightness std dev          — wet = high specular contrast
        5. Dark pixel ratio            — wet regions are significantly darker
        6. Specular reflection spots   — very bright spots on dark background
        """
        h, w = img_bgr.shape[:2]

        img_hsv = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2HSV).astype(np.float32)
        val = img_hsv[:, :, 2]   # brightness 0-255

        b, g, r = cv2.split(img_bgr.astype(np.float32))

        mean_brightness = float(np.mean(val))
        mean_saturation = float(np.mean(img_hsv[:, :, 1]))

        total = b + g + r + 1e-6
        blue_ratio = float(np.mean(b / total))

        brightness_std = float(np.std(val))

        dark_ratio  = float(np.sum(val < 80))  / (h * w)
        bright_ratio = float(np.sum(val > 220)) / (h * w)

        # Wetness score [0..1]
        wetness_score = (
            0.30 * max(0.0, (120 - mean_brightness) / 120) +
            0.20 * dark_ratio +
            0.20 * max(0.0, (blue_ratio - 0.30) / 0.15) +
            0.15 * min(1.0, bright_ratio / 0.05) +
            0.15 * min(1.0, brightness_std / 60)
        )
        wetness_score = float(np.clip(wetness_score, 0, 1))

        # Dampness peaks at medium wetness
        dampness_score = float(np.clip(1.0 - abs(wetness_score - 0.38) / 0.38, 0, 1))
        dryness_score  = float(np.clip(1.0 - wetness_score, 0, 1))

        scores = {
            "WET":  wetness_score,
            "DAMP": dampness_score * 0.75,
            "DRY":  dryness_score,
        }
        condition  = max(scores, key=scores.get)
        confidence = round(min(0.97, max(0.40, float(scores[condition]))), 4)

        print(f"[LocalVision] brightness={mean_brightness:.1f} sat={mean_saturation:.1f} "
              f"blue={blue_ratio:.3f} dark={dark_ratio:.3f} specular={bright_ratio:.3f} "
              f"wetness={wetness_score:.3f} → {condition} ({confidence:.2%})")

        return {"condition": condition, "confidence": confidence}

    def infer(self, image: Image.Image) -> dict:
        try:
            img_bgr = self._pil_to_bgr(image)
            return self._analyze_track_condition(img_bgr)
        except Exception as e:
            print(f"[LocalVision] Error: {e}")
            return {"condition": "UNCERTAIN", "confidence": 0.0}


