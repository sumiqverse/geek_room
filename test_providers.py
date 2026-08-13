"""
Run: python test_providers.py YOUR_HF_TOKEN
Tests which HF router provider supports CLIP zero-shot image classification.
"""
import sys
import requests
import base64
from PIL import Image
from io import BytesIO

TOKEN = sys.argv[1] if len(sys.argv) > 1 else ""
if not TOKEN:
    print("Usage: python test_providers.py YOUR_HF_TOKEN")
    sys.exit(1)

# Wet-looking test image (dark gray — simulates wet asphalt)
img = Image.new('RGB', (224, 224), color=(30, 40, 50))
buf = BytesIO()
img.save(buf, format='JPEG')
img_b64 = base64.b64encode(buf.getvalue()).decode()

labels = [
    "a dry sunny racing track",
    "a wet racing track with water spray and rain",
    "unrelated image"
]

HEADERS = {
    "Authorization": f"Bearer {TOKEN}",
    "Content-Type": "application/json"
}

MODEL = "openai/clip-vit-base-patch32"
PROVIDERS = ["hf-inference", "featherless-ai", "nebius", "together", "novita", "replicate"]

print(f"\nTesting {len(PROVIDERS)} providers on router.huggingface.co with token...\n")

for provider in PROVIDERS:
    url = f"https://router.huggingface.co/{provider}/models/{MODEL}"
    payload = {
        "inputs": img_b64,
        "parameters": {"candidate_labels": labels}
    }
    try:
        r = requests.post(url, headers=HEADERS, json=payload, timeout=15)
        short = r.text[:200].replace('\n', ' ')
        print(f"✅ [{provider}] Status={r.status_code} | {short}")
    except Exception as e:
        print(f"❌ [{provider}] ERROR: {e}")

print("\nDone.")
