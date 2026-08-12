# Weather Whiplash: AI Track Condition Intelligence

Weather Whiplash is a real-time, AI-driven track condition intelligence system built for racing teams and race control. It analyzes visual media (images or video) to predict track conditions (WET, DAMP, DRY), tracks the evolutionary trend over time (WETTING, DRYING, STABLE), and outputs strategy recommendations for tire selection.

## Team: Variants
Leader: Sumit Kumar \
Email: sumitkumar807640@gmail.com


## 🏁 Problem Statement
In motorsports, weather can change track conditions rapidly. The transition from Wet to Damp to Dry (or vice versa) is often difficult to predict with the naked eye. Incorrect tire strategy costs seconds per lap and can result in dangerous crashes. Current systems rely on sparse sensors or human interpretation.

## 💡 Solution
Weather Whiplash uses a zero-shot Vision AI model (Hugging Face CLIP) to classify track surface conditions frame-by-frame. 
Crucially, it employs a **Temporal Analysis Engine** to smooth anomalies, discard low-confidence predictions, and determine the true evolutionary trend of the circuit. The data is presented in a dark, telemetry-style dashboard suitable for race control environments.

## ✨ Features
- **Hugging Face AI Integration**: Uses `openai/clip-vit-base-patch32` for zero-shot track classification.
- **Multiple Media Support**: Analyze either a sequential batch of images or a raw MP4 video.
- **Temporal Engine**: Applies a sliding window algorithm to filter out anomalies and detect trends (WETTING, DRYING, STABLE, UNCERTAIN).
- **Confidence Gating**: Low confidence predictions (<60%) are discarded from the trend calculation.
- **Strategy Engine**: Translates visual analysis and temporal trends into actionable decisions (e.g. "🟡 TRACK DRYING - Monitor slick-tyre transition window").
- **Global Track Evolution**: A multi-line telemetry chart plotting the real-time condition (DRY, DAMP, WET) of all 5 zones simultaneously.
- **5-Zone Intelligence**: Granular analysis isolated by up to 5 key track zones (e.g. ZONE 1 - Turn 1, ZONE 2 - Turn 4, etc).
- **Invalid Media Rejection**: The AI actively identifies and rejects non-track images (graphs, texts, unrelated scenes) and heavy tire-smoke anomalies to prevent false positives.

## 🏗️ Architecture & Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, Recharts (for telemetry-style evolution graphs)
- **Backend**: FastAPI, Python, OpenCV (Video frame extraction)
- **AI/ML**: Hugging Face `transformers`, Pillow, PyTorch

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v18+)
- Python (3.10+)

### Backend Setup
```bash
cd backend
python -m venv venv
# Activate virtual environment (Windows: venv\Scripts\activate, Mac/Linux: source venv/bin/activate)
pip install -r requirements.txt
uvicorn main:app --reload
```
*The backend will run on http://localhost:8000*

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*The frontend will run on http://localhost:5173*

## 🧠 AI & Temporal Logic Explained
1. **Frame Extraction**: Video is sampled at ~1 fps to prevent duplicate analysis.
2. **Vision Inference**: Each frame is evaluated by CLIP against highly descriptive labels (e.g. `"a completely dry racing track surface in sunny weather"`). A 4th class is used to filter out completely invalid non-track images.
3. **Temporal Smoothing**: The backend converts conditions to ordinal values (DRY=0, DAMP=1, WET=2) and calculates a mathematical slope across recent reliable frames.
5. **Strategy Formulation**: Based on the trend slope and current condition, a rule-based engine outputs a `DECISION` (MONITOR, PREPARE, HOLD).
6. **Global Track Aggregation**: The system calculates a unified track-wide state using a weighted majority of reliable zone observations (DRY=0, DAMP=1, WET=2), prioritizing high-confidence physical visual data to plot the Global Track Evolution profile.

## 🧪 Testing
The system includes automated tests for both the temporal logic engine and the strategy signal engine.
To run tests:
```bash
cd backend
pytest tests/
```

## 📜 License
MIT License
