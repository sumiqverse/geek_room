def get_strategy_signal(condition: str, trend: str, confidence: float) -> dict:
    """
    Rule-based strategy engine.
    """
    # Case 0: INVALID image
    if condition == "INVALID":
        return {
            "signal": "🚫 INVALID MEDIA DETECTED",
            "message": "The uploaded media does not appear to be a racing track.",
            "recommendation": "Please upload valid track footage.",
            "type": "uncertain"
        }

    # Case 5: Low Confidence
    if confidence < 0.60:
        return {
            "signal": "⚪ Insufficient visual confidence",
            "message": "No strategy recommendation.",
            "recommendation": "Maintain position.",
            "type": "uncertain"
        }

    # Case 1: WET + WETTING
    if condition == "WET" and trend == "WETTING":
        return {
            "signal": "🔴 TRACK MOISTURE INCREASING",
            "message": "Track surface moisture is increasing. No clear drying trend detected across the last 5 observations.",
            "recommendation": "Track moisture is increasing. Continue monitoring and evaluate wet-weather tyre strategy if the trend persists.",
            "type": "danger"
        }

    # Case 2: DAMP + DRYING
    if condition == "DAMP" and trend == "DRYING":
        return {
            "signal": "🟡 TRACK DRYING",
            "message": "Wet → Damp transition detected.",
            "recommendation": "Monitor slick-tyre transition window.",
            "type": "warning"
        }

    # Case 3: WET + STABLE
    if condition == "WET" and trend == "STABLE":
        return {
            "signal": "🔴 WET CONDITIONS STABLE",
            "message": "Sector remains significantly wet. No clear drying trend detected across the last 5 observations.",
            "recommendation": "Maintain current wet-weather strategy and continue monitoring sector.",
            "type": "danger"
        }

    # Case 4: DRY + STABLE or DRYING
    if condition == "DRY" and trend in ["STABLE", "DRYING"]:
        return {
            "signal": "🟢 DRY CONDITIONS STABLE",
            "message": "Track surface is optimal.",
            "recommendation": "Dry-track strategy currently supported.",
            "type": "success"
        }
        
    # Case 5: UNCERTAIN Trend
    if trend == "UNCERTAIN" or condition == "UNCERTAIN":
        return {
            "signal": "⚪ INSUFFICIENT TREND CONFIDENCE",
            "message": "Data is too inconsistent to establish a clear trend.",
            "recommendation": "Continue collecting observations before making a strategy decision.",
            "type": "uncertain"
        }
        
    # Case 6: INSUFFICIENT DATA (Single Observation)
    if trend == "INSUFFICIENT DATA":
        if condition == "WET":
            return {
                "signal": "🔴 WET (INSUFFICIENT TREND DATA)",
                "message": "Track is visually WET. One observation is insufficient to determine track evolution (drying/wetting).",
                "recommendation": "Wet conditions detected. Continue monitoring and evaluate wet-weather tyre strategy.",
                "type": "danger"
            }
        elif condition == "DRY":
            return {
                "signal": "🟢 DRY (INSUFFICIENT TREND DATA)",
                "message": "Track is visually DRY. One observation is insufficient to determine track evolution.",
                "recommendation": "Dry-track strategy currently supported. Continue monitoring.",
                "type": "success"
            }
        elif condition == "DAMP":
            return {
                "signal": "🟡 DAMP (INSUFFICIENT TREND DATA)",
                "message": "Track is visually DAMP. One observation is insufficient to determine track evolution.",
                "recommendation": "Consider Intermediate tyres. Continue monitoring.",
                "type": "warning"
            }
        else:
            return {
                "signal": "⚪ INSUFFICIENT DATA",
                "message": "One observation is insufficient to determine track evolution. Continue collecting observations.",
                "recommendation": "Monitor closely.",
                "type": "uncertain"
            }
        
    # Catch-all
    return {
        "signal": f"Track Condition: {condition}",
        "message": f"Trend is {trend}. Monitor closely.",
        "recommendation": "N/A",
        "type": "info"
    }
