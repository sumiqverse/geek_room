import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch
import sys
import os
from PIL import Image

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import app

client = TestClient(app)

@patch("main.analyze_image")
def test_api_integration_images(mock_analyze):
    mock_analyze.return_value = {"condition": "WET", "confidence": 0.95}
    
    # Create a small valid fake image
    img = Image.new('RGB', (10, 10), color = 'red')
    import io
    img_byte_arr = io.BytesIO()
    img.save(img_byte_arr, format='JPEG')
    fake_img = img_byte_arr.getvalue()
    
    response = client.post(
        "/api/analyze/images",
        files=[("images", ("test1.jpg", fake_img, "image/jpeg")),
               ("images", ("test2.jpg", fake_img, "image/jpeg"))],
        data={"sector": "sector_1"}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["current_condition"] == "WET"
    assert data["trend"] == "STABLE"
    assert len(data["observations"]) == 2
    assert data["observations"][0]["confidence"] == 0.95

@patch("main.extract_frames")
@patch("main.analyze_image")
def test_end_to_end_video_api(mock_analyze, mock_extract):
    mock_extract.return_value = [
        {"timestamp": 0.0, "image": None},
        {"timestamp": 2.0, "image": None},
        {"timestamp": 4.0, "image": None}
    ]
    # Simulate WET -> DAMP -> DRY sequence
    mock_analyze.side_effect = [
        {"condition": "WET", "confidence": 0.90},
        {"condition": "DAMP", "confidence": 0.90},
        {"condition": "DRY", "confidence": 0.90}
    ]
    
    fake_video = b"fake_video_content"
    
    response = client.post(
        "/api/analyze/video",
        files={"video": ("test.mp4", fake_video, "video/mp4")},
        data={"sector": "sector_2"}
    )
    
    assert response.status_code == 200
    data = response.json()
    
    assert data["current_condition"] == "DRY"
    assert data["trend"] == "DRYING"
    assert len(data["observations"]) == 3
    
    # Verify sector updated
    assert data["sectors"]["sector_2"]["condition"] == "DRY"
