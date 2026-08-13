import numpy as np
from PIL import Image
import cv2

class VisionModel:
    """
    Local image analysis for racing track condition detection.
    Racing-specific algorithm: focuses on track region, saturation,
    texture roughness, and spray detection.
    No external API - zero DNS/network failures on Render.
    """

    def __init__(self):
        print("Initializing Local Vision Model v2 (Racing-Specific)...")

    def _pil_to_bgr(self, image):
        if image.mode != "RGB":
            image = image.convert("RGB")
        arr = np.array(image)
        return cv2.cvtColor(arr, cv2.COLOR_RGB2BGR)

    def _analyze_track_condition(self, img_bgr):
        """
        Racing-specific wet track detection.

        KEY INSIGHT: Wet racing tracks are NOT necessarily darker overall
        (cameras auto-expose). The real indicators are:
        1. LOW SATURATION in track region - wet asphalt = desaturated dark gray
        2. TEXTURE SMOOTHNESS - wet = less Laplacian variance (smoother surface)
        3. WATER SPRAY detection - hazy, desaturated bright pixels (mist/spray)
        4. BLUE-RED RATIO - wet asphalt reflects sky (more blue than dry)
        5. GRAY PIXEL DENSITY - wet asphalt = dark & desaturated pixels
        6. HAZE/FOG - rain reduces global contrast
        """
        h, w = img_bgr.shape[:2]

        # Focus on track region: bottom 55% of image
        track_top = int(h * 0.45)
        track_bgr = img_bgr[track_top:, :]
        th, tw = track_bgr.shape[:2]

        track_hsv = cv2.cvtColor(track_bgr, cv2.COLOR_BGR2HSV).astype(np.float32)
        t_sat = track_hsv[:, :, 1]
        t_val = track_hsv[:, :, 2]

        gray_track = cv2.cvtColor(track_bgr, cv2.COLOR_BGR2GRAY).astype(np.float32)
        b_t, g_t, r_t = cv2.split(track_bgr.astype(np.float32))

        # Feature 1: Mean saturation - wet asphalt = low sat
        mean_sat = float(np.mean(t_sat))

        # Feature 2: Texture roughness (Laplacian variance)
        laplacian = cv2.Laplacian(gray_track, cv2.CV_64F)
        texture_var = float(np.var(laplacian))
        texture_norm = float(np.clip(texture_var / 2000.0, 0, 1))

        # Feature 3: Water spray - medium brightness + very low saturation
        spray_mask = (t_val > 130) & (t_val < 245) & (t_sat < 35)
        spray_ratio = float(np.sum(spray_mask)) / (th * tw)

        # Feature 4: Gray asphalt pixels - dark AND desaturated
        wet_asphalt_mask = (t_val < 140) & (t_sat < 55)
        wet_asphalt_ratio = float(np.sum(wet_asphalt_mask)) / (th * tw)

        # Feature 5: Blue-Red ratio - wet reflects sky
        br_ratio = float(np.mean((b_t + 1) / (r_t + 1)))

        # Feature 6: Haziness
        lap_mean_abs = float(np.mean(np.abs(laplacian)))
        haziness = float(np.clip(1.0 - lap_mean_abs / 15.0, 0, 1))

        # WET score
        wet_score = (
            0.30 * max(0.0, (80 - mean_sat) / 80) +
            0.20 * wet_asphalt_ratio +
            0.20 * min(1.0, spray_ratio / 0.12) +
            0.15 * max(0.0, 1.0 - texture_norm) +
            0.10 * max(0.0, (br_ratio - 0.95) / 0.3) +
            0.05 * haziness
        )
        wet_score = float(np.clip(wet_score, 0, 1))

        # DAMP score
        damp_score = float(np.clip(1.0 - abs(wet_score - 0.42) / 0.42, 0, 1)) * 0.80

        # DRY score
        dry_score = (
            0.50 * texture_norm +
            0.30 * min(1.0, mean_sat / 80.0) +
            0.20 * max(0.0, 1.0 - spray_ratio / 0.05)
        )
        dry_score = float(np.clip(dry_score, 0, 1))

        scores = {"WET": wet_score, "DAMP": damp_score, "DRY": dry_score}
        condition = max(scores, key=scores.get)
        confidence = round(min(0.95, max(0.45, float(scores[condition]))), 4)

        print(
            f"[LocalVision v2] sat={mean_sat:.1f} texture={texture_norm:.3f} "
            f"spray={spray_ratio:.3f} wetAsphalt={wet_asphalt_ratio:.3f} "
            f"br_ratio={br_ratio:.3f} haze={haziness:.3f} | "
            f"wet={wet_score:.3f} damp={damp_score:.3f} dry={dry_score:.3f} "
            f"-> {condition} ({confidence:.2%})"
        )

        return {"condition": condition, "confidence": confidence}

    def infer(self, image):
        try:
            img_bgr = self._pil_to_bgr(image)
            return self._analyze_track_condition(img_bgr)
        except Exception as e:
            print(f"[LocalVision] Error: {e}")
            return {"condition": "UNCERTAIN", "confidence": 0.0}
