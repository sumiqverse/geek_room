from transformers import pipeline
from PIL import Image

class VisionModel:
    def __init__(self):
        print("Loading Hugging Face Zero-Shot Image Classification Model...")
        self.classifier = pipeline(
            "zero-shot-image-classification",
            model="openai/clip-vit-base-patch32"
        )
        self.candidate_labels = [
            "a completely dry racing track surface in sunny weather",
            "a damp racing track with slight moisture and wet patches",
            "a very wet racing track with standing water and heavy rain"
        ]
        self.label_map = {
            "a completely dry racing track surface in sunny weather": "DRY",
            "a damp racing track with slight moisture and wet patches": "DAMP",
            "a very wet racing track with standing water and heavy rain": "WET"
        }

    def infer(self, image: Image.Image):
        if image.mode != "RGB":
            image = image.convert("RGB")
            
        results = self.classifier(image, candidate_labels=self.candidate_labels)
        top_result = results[0]
        
        return {
            "condition": self.label_map[top_result["label"]],
            "confidence": top_result["score"]
        }
