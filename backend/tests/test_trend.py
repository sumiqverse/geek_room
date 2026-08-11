import pytest
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from analysis.trend import analyze_trend

def test_stable_wet():
    obs = [
        {"condition": "WET", "confidence": 0.90},
        {"condition": "WET", "confidence": 0.92},
        {"condition": "WET", "confidence": 0.88},
    ]
    result = analyze_trend(obs)
    assert result["trend"] == "STABLE"
    assert result["current_condition"] == "WET"

def test_drying_trend():
    obs = [
        {"condition": "WET", "confidence": 0.90},
        {"condition": "WET", "confidence": 0.90},
        {"condition": "DAMP", "confidence": 0.90},
        {"condition": "DRY", "confidence": 0.90},
    ]
    result = analyze_trend(obs)
    assert result["trend"] == "DRYING"
    assert result["current_condition"] == "DRY"

def test_wetting_trend():
    obs = [
        {"condition": "DRY", "confidence": 0.90},
        {"condition": "DAMP", "confidence": 0.90},
        {"condition": "WET", "confidence": 0.90},
    ]
    result = analyze_trend(obs)
    assert result["trend"] == "WETTING"
    assert result["current_condition"] == "WET"

def test_uncertain_trend():
    obs = [
        {"condition": "WET", "confidence": 0.90},
        {"condition": "DRY", "confidence": 0.90},
        {"condition": "WET", "confidence": 0.90},
        {"condition": "DAMP", "confidence": 0.90},
    ]
    result = analyze_trend(obs)
    assert result["trend"] == "UNCERTAIN"

def test_low_confidence_filtering():
    obs = [
        {"condition": "WET", "confidence": 0.90},
        {"condition": "WET", "confidence": 0.88},
        {"condition": "DRY", "confidence": 0.40}, # Should be filtered out
    ]
    result = analyze_trend(obs)
    # Since DRY is filtered out, the recent reliable frames are just WET
    assert result["trend"] == "STABLE"
    assert result["current_condition"] == "WET"
