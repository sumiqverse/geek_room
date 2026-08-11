from pydantic import BaseModel
from typing import List, Dict, Any

class Observation(BaseModel):
    index: int
    timestamp: float
    condition: str
    confidence: float

class StrategySignal(BaseModel):
    signal: str
    message: str
    recommendation: str
    type: str

class AnalysisResponse(BaseModel):
    current_condition: str
    trend: str
    visual_confidence: float
    trend_confidence: float
    strategy_signal: StrategySignal
    observations: List[Observation]
    sectors: Dict[str, Any]
    previous_condition: str
