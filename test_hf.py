import requests
import base64
import json
from io import BytesIO
from PIL import Image

# Create a small dummy image
img = Image.new('RGB', (10, 10), color = 'red')
buffered = BytesIO()
img.save(buffered, format="JPEG")
img_bytes = buffered.getvalue()
img_b64 = base64.b64encode(img_bytes).decode("utf-8")

# Attempt 1: api-inference.huggingface.co
url1 = "https://api-inference.huggingface.co/models/openai/clip-vit-base-patch32"
# Attempt 2: router.huggingface.co
url2 = "https://router.huggingface.co/hf-inference/models/openai/clip-vit-base-patch32"

payload1 = {
    "inputs": img_b64,
    "parameters": {"candidate_labels": ["red", "blue"]}
}

payload2 = {
    "inputs": {
        "image": img_b64,
        "candidate_labels": ["red", "blue"]
    }
}

try:
    print("Testing url2 with payload1...")
    r = requests.post(url2, json=payload1)
    print("Status:", r.status_code)
    print("Response:", r.text)
except Exception as e:
    print("Error:", e)

try:
    print("Testing url2 with payload2...")
    r = requests.post(url2, json=payload2)
    print("Status:", r.status_code)
    print("Response:", r.text)
except Exception as e:
    print("Error:", e)
