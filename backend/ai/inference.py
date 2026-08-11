from PIL import Image
from ai.model import VisionModel

# Singleton instance
_model_instance = None

def get_model():
    global _model_instance
    if _model_instance is None:
        _model_instance = VisionModel()
    return _model_instance

def analyze_image(image: Image.Image) -> dict:
    """
    Takes a PIL image and returns the condition and confidence using the vision model.
    """
    model = get_model()
    return model.infer(image)
