import cv2
import os
from PIL import Image

def extract_frames(video_path: str, fps_target: float = 0.5) -> list:
    """
    Extracts frames from a video.
    fps_target: How many frames per second to extract. 0.5 = 1 frame every 2 seconds.
    Returns a list of dicts: {"timestamp": float, "image": PIL.Image.Image}.
    """
    frames = []
    
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        print(f"Error opening video file {video_path}")
        return frames

    original_fps = cap.get(cv2.CAP_PROP_FPS)
    if original_fps <= 0:
        original_fps = 30 # fallback
        
    frame_interval = int(original_fps / fps_target)
    
    frame_count = 0
    extracted_count = 0
    
    while True:
        ret, frame = cap.read()
        if not ret:
            break
            
        if frame_count % frame_interval == 0:
            # Convert BGR to RGB
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            pil_img = Image.fromarray(rgb_frame)
            
            # Calculate timestamp in seconds
            timestamp = frame_count / original_fps
            
            frames.append({
                "timestamp": round(timestamp, 1),
                "image": pil_img
            })
            extracted_count += 1
            
        frame_count += 1

    cap.release()
    print(f"Extracted {extracted_count} frames from video.")
    return frames
