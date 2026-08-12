import os
from PIL import Image
from huggingface_hub import InferenceClient

class VisionModel:
    def __init__(self):
        print("Initializing Hugging Face Inference API Client...")
        # Get token from environment variables on Render
        token = os.environ.get("HF_TOKEN")
        self.client = InferenceClient(token=token)
        self.model_id = "openai/clip-vit-base-patch32"
        
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
            results = self.client.zero_shot_image_classification(
                image=image,
                candidate_labels=self.candidate_labels,
                model=self.model_id
            )
            
            if results and len(results) > 0:
                top_result = results[0]
                return {
                    "condition": self.label_map.get(top_result["label"], "UNCERTAIN"),
                    "confidence": top_result["score"]
                }
            else:
                return {"condition": "UNCERTAIN", "confidence": 0.0}
        except Exception as e:
            print(f"Error during API inference: {e}")
            return {"condition": "UNCERTAIN", "confidence": 0.0}

