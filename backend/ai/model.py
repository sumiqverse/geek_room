import os
from PIL import Image
import requests
import base64
from io import BytesIO

class VisionModel:
    def __init__(self):
        print("Initializing Hugging Face Inference API Request...")
        self.token = os.environ.get("HF_TOKEN", "")
        # Direct HF Inference API — supports CLIP zero-shot image classification
        # router.huggingface.co/hf-inference does NOT support openai/clip-vit-base-patch32
        self.api_url = "https://api-inference.huggingface.co/models/openai/clip-vit-base-patch32"
        
        self.candidate_labels = [
            "a completely dry racing track surface, motorsport cars, tire smoke, clear weather",
            "a damp racing track with slight moisture and wet patches",
            "a very wet racing track with standing water, heavy rain, water spray from cars",
            "a stock market graph, text document, or an image entirely unrelated to motorsport"
        ]
        self.label_map = {
            "a completely dry racing track surface, motorsport cars, tire smoke, clear weather": "DRY",
            "a damp racing track with slight moisture and wet patches": "DAMP",
            "a very wet racing track with standing water, heavy rain, water spray from cars": "WET",
            "a stock market graph, text document, or an image entirely unrelated to motorsport": "INVALID"
        }

    def infer(self, image: Image.Image):
        if image.mode != "RGB":
            image = image.convert("RGB")
            
        try:
            buffered = BytesIO()
            image.save(buffered, format="JPEG")
            img_bytes = buffered.getvalue()
            
            headers = {
                "Content-Type": "application/json"
            }
            if self.token:
                headers["Authorization"] = f"Bearer {self.token}"
            
            # Direct HF Inference API uses image bytes + candidate_labels as parameters
            # NOT base64 — send raw bytes with multipart OR use the JSON format below
            payload = {
                "inputs": base64.b64encode(img_bytes).decode("utf-8"),
                "parameters": {
                    "candidate_labels": self.candidate_labels
                }
            }
            
            response = requests.post(self.api_url, headers=headers, json=payload, timeout=45)
            
            # Handle model loading (503) — HF cold start
            if response.status_code == 503:
                print("Model is loading on HuggingFace, retrying after delay...")
                import time
                time.sleep(10)
                response = requests.post(self.api_url, headers=headers, json=payload, timeout=45)
            
            response.raise_for_status()
            results = response.json()
            
            # HF returns list of {label, score} dicts sorted by score desc
            if isinstance(results, list) and len(results) > 0:
                top_result = results[0]
                return {
                    "condition": self.label_map.get(top_result["label"], "UNCERTAIN"),
                    "confidence": round(top_result["score"], 4)
                }
            else:
                print(f"Unexpected response format: {results}")
                return {"condition": "UNCERTAIN", "confidence": 0.0}
                
        except Exception as e:
            print(f"Error during API inference: {e}")
            if hasattr(e, 'response') and e.response is not None:
                print(f"Response: {e.response.text}")
            return {"condition": "UNCERTAIN", "confidence": 0.0}

