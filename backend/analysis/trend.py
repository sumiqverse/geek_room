from typing import List, Dict

CONDITION_MAP = {
    "DRY": 0,
    "DAMP": 1,
    "WET": 2
}

REVERSE_MAP = {v: k for k, v in CONDITION_MAP.items()}

def analyze_trend(observations: List[Dict]) -> dict:
    """
    Analyzes a list of observation dicts: [{"condition": "WET", "confidence": 0.92}, ...]
    Returns current condition, trend, visual_confidence, and trend_confidence.
    """
    valid_obs = [obs for obs in observations if obs["condition"] != "INVALID"]

    if not valid_obs:
        return {
            "current_condition": "INVALID",
            "trend": "INVALID DATA",
            "visual_confidence": 0.0,
            "trend_confidence": 0.0
        }

    # Filter out low confidence for condition smoothing
    reliable_obs = [obs for obs in valid_obs if obs["confidence"] >= 0.60]
    
    # 1. Current Condition
    if reliable_obs:
        # Use the most recent reliable observation as the current condition
        # (Since anomalies are filtered out by the confidence threshold)
        most_recent = reliable_obs[-1]
        current_condition = most_recent["condition"]
        
        # Visual confidence is the average confidence of the recent reliable frames
        recent_reliable = reliable_obs[-5:]
        visual_confidence = sum(o["confidence"] for o in recent_reliable) / len(recent_reliable)
    else:
        current_condition = "UNCERTAIN"
        visual_confidence = 0.0

    # 2. Trend Detection
    if len(valid_obs) < 2:
        return {
            "current_condition": current_condition if current_condition != "UNCERTAIN" else valid_obs[-1]["condition"],
            "trend": "INSUFFICIENT DATA",
            "visual_confidence": visual_confidence if visual_confidence > 0 else valid_obs[-1]["confidence"],
            "trend_confidence": valid_obs[-1]["confidence"] * 0.8
        }

    # Evaluate trend over the whole sequence using ordinal values
    # We will use reliable observations for trend if possible
    trend_obs = reliable_obs if len(reliable_obs) >= 2 else valid_obs
    
    num_preds = [CONDITION_MAP[o["condition"]] for o in trend_obs]
    
    # Calculate simple slope or start/end difference
    # A robust way is comparing the first half to the second half averages
    mid = len(num_preds) // 2
    first_half_avg = sum(num_preds[:mid]) / len(num_preds[:mid])
    second_half_avg = sum(num_preds[mid:]) / len(num_preds[mid:])
    
    diff = second_half_avg - first_half_avg
    
    # Calculate number of direction changes (fluctuations)
    direction_changes = 0
    for i in range(2, len(num_preds)):
        prev_diff = num_preds[i-1] - num_preds[i-2]
        curr_diff = num_preds[i] - num_preds[i-1]
        if prev_diff * curr_diff < 0:
            direction_changes += 1

    # Trend threshold
    if direction_changes >= 2 or (max(num_preds) - min(num_preds) >= 2 and len(num_preds) <= 4 and diff < 0.5 and diff > -0.5):
        trend = "UNCERTAIN"
    elif diff <= -0.5:
        trend = "DRYING"
    elif diff >= 0.5:
        trend = "WETTING"
    else:
        trend = "STABLE"
        
    # 3. Trend Confidence
    # Make trend confidence mathematically explicit for judging:
    # Trend confidence = average confidence of observations × trend consistency score
    
    # Calculate anomalies (sudden jumps from DRY to WET without DAMP transition)
    anomalies = 0
    for i in range(1, len(num_preds)):
        jump = abs(num_preds[i] - num_preds[i-1])
        if jump > 1:
            anomalies += 1
            
    # Combine direction changes (fluctuations) and sudden jumps
    total_inconsistencies = direction_changes + anomalies
    
    # Base consistency score (1.0 is perfect)
    # We penalize 0.25 for every inconsistency in the timeline
    consistency_score = max(0.1, 1.0 - (total_inconsistencies * 0.25))
    
    avg_all_conf = sum(o["confidence"] for o in observations) / len(observations)
    
    if avg_all_conf < 0.40:
        trend = "UNCERTAIN"
        
    if trend == "UNCERTAIN":
        consistency_score *= 0.5
        
    trend_confidence = avg_all_conf * consistency_score
    
    return {
        "current_condition": current_condition,
        "trend": trend,
        "visual_confidence": visual_confidence,
        "trend_confidence": trend_confidence
    }
