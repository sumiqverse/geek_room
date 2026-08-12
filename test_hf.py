import requests
import base64
from io import BytesIO
from PIL import Image
import sys

TOKEN = sys.argv[1] if len(sys.argv) > 1 else ""

# Try OLD api-inference endpoint with this token
API_URL_OLD = "https://api-inference.huggingface.co/models/openai/clip-vit-base-patch32"
API_URL_NEW = "https://router.huggingface.co/hf-inference/models/openai/clip-vit-base-patch32"

headers = {"Authorization": f"Bearer {TOKEN}"}

candidate_labels = ["a dry racing track", "a wet racing track", "unrelated image"]

img = Image.new('RGB', (224, 224), color=(180, 140, 90))
buffered = BytesIO()
img.save(buffered, format="JPEG")
img_bytes = buffered.getvalue()
img_b64 = base64.b64encode(img_bytes).decode("utf-8")

print("\n--- Test OLD api-inference.huggingface.co ---")
try:
    payload = {
        "inputs": img_b64,
        "parameters": {"candidate_labels": candidate_labels}
    }
    r = requests.post(API_URL_OLD, headers=headers, json=payload, timeout=30)
    print("Status:", r.status_code)
    print("Response:", r.text[:500])
except Exception as e:
    print("Error:", e)

# Also check token info
print("\n--- Checking token info ---")
try:
    r = requests.get("https://huggingface.co/api/whoami-v2", headers=headers)
    print("Status:", r.status_code)
    print("Response:", r.text[:800])
except Exception as e:
    print("Error:", e)
