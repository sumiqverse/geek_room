import pytest
from unittest.mock import patch, MagicMock
import sys
import os
import numpy as np

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from video.frame_extractor import extract_frames

@patch("video.frame_extractor.cv2.VideoCapture")
def test_video_frame_extraction(mock_cap):
    mock_video = MagicMock()
    mock_video.isOpened.return_value = True
    
    # Mock fps (CV_CAP_PROP_FPS = 5 usually in cv2)
    mock_video.get.return_value = 30.0
    
    # Mock read: returns (True, frame) for 3 frames, then (False, None)
    fake_frame = np.zeros((100, 100, 3), dtype=np.uint8)
    
    mock_video.read.side_effect = [
        (True, fake_frame),
        (True, fake_frame),
        (True, fake_frame),
        (False, None)
    ]
    
    mock_cap.return_value = mock_video
    
    # Run extractor targeting 30 fps (so it should extract every frame in our small mock)
    frames = extract_frames("dummy.mp4", fps_target=30.0)
    
    assert len(frames) == 3
    assert frames[0]["timestamp"] == 0.0
    # Because we mocked get(cv2.CAP_PROP_POS_MSEC) it might be 0.0 unless we mock it specifically,
    # but the extractor does not fail. 
    # Just verifying the list of frames is extracted properly:
    assert frames[0]["image"] is not None
