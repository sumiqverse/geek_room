import io
from typing import List
from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from PIL import Image

from ai.inference import analyze_image
from analysis.trend import analyze_trend
from analysis.strategy import get_strategy_signal
from video.frame_extractor import extract_frames
from schemas.responses import AnalysisResponse, Observation, StrategySignal
import tempfile
import os

app = FastAPI(title="Weather Whiplash AI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for prototype history and sectors
sector_state = {
    "sector_1": {"condition": "NO DATA", "trend": "NO DATA"},
    "sector_2": {"condition": "NO DATA", "trend": "NO DATA"},
    "sector_3": {"condition": "NO DATA", "trend": "NO DATA"}
}

def process_observations(observations: List[dict], sector: str) -> AnalysisResponse:
    # Temporal Analysis
    trend_data = analyze_trend(observations)
    
    current_condition = trend_data["current_condition"]
    trend = trend_data["trend"]
    visual_conf = trend_data["visual_confidence"]
    trend_conf = trend_data["trend_confidence"]
    
    # Previous condition for explainability
    previous_condition = observations[0]["condition"] if observations else current_condition

    # Strategy Engine
    strategy_dict = get_strategy_signal(current_condition, trend, trend_conf)
    strategy = StrategySignal(**strategy_dict)
    
    # Update global sector state
    sector_state[sector] = {
        "condition": current_condition,
        "trend": trend
    }
    
    obs_models = [Observation(**obs) for obs in observations]
    
    return AnalysisResponse(
        current_condition=current_condition,
        trend=trend,
        visual_confidence=visual_conf,
        trend_confidence=trend_conf,
        strategy_signal=strategy,
        observations=obs_models,
        sectors=sector_state,
        previous_condition=previous_condition
    )

@app.post("/api/analyze/images", response_model=AnalysisResponse)
async def analyze_images_endpoint(images: List[UploadFile] = File(...), sector: str = Form("sector_1")):
    try:
        if not images:
            raise HTTPException(status_code=400, detail="No images provided")
            
        observations = []
        for idx, img in enumerate(images):
            contents = await img.read()
            pil_image = Image.open(io.BytesIO(contents))
            result = analyze_image(pil_image)
            
            observations.append({
                "index": idx + 1,
                "timestamp": float(idx), # Synthetic timestamp for images
                "condition": result["condition"],
                "confidence": result["confidence"]
            })
            
        return process_observations(observations, sector)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/analyze/video", response_model=AnalysisResponse)
async def analyze_video_endpoint(video: UploadFile = File(...), sector: str = Form("sector_1")):
    try:
        # Save uploaded video to temp file
        with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as tmp:
            contents = await video.read()
            tmp.write(contents)
            tmp_path = tmp.name

        # Extract frames
        frames = extract_frames(tmp_path, fps_target=0.5)
        os.remove(tmp_path)
        
        if not frames:
            raise HTTPException(status_code=400, detail="Could not extract frames from video")

        observations = []
        for idx, frame_data in enumerate(frames):
            result = analyze_image(frame_data["image"])
            observations.append({
                "index": idx + 1,
                "timestamp": frame_data["timestamp"],
                "condition": result["condition"],
                "confidence": result["confidence"]
            })
            
        return process_observations(observations, sector)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/analyze/image", response_model=AnalysisResponse)
async def analyze_image_endpoint(image: UploadFile = File(...), sector: str = Form("sector_1")):
    # Backward compatible single-image endpoint using the same structure
    return await analyze_images_endpoint(images=[image], sector=sector)

@app.get("/api/track/history", response_model=dict)
async def get_history():
    return sector_state
