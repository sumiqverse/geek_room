import pytest
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from analysis.strategy import get_strategy_signal

def test_strategy_low_confidence():
    result = get_strategy_signal("WET", "STABLE", 0.50)
    assert result["type"] == "uncertain"
    assert "Insufficient visual confidence" in result["signal"]

def test_strategy_wet_wetting():
    result = get_strategy_signal("WET", "WETTING", 0.90)
    assert result["type"] == "danger"
    assert "DETERIORATING" in result["signal"]

def test_strategy_damp_drying():
    result = get_strategy_signal("DAMP", "DRYING", 0.90)
    assert result["type"] == "warning"
    assert "DRYING" in result["signal"]

def test_strategy_wet_stable():
    result = get_strategy_signal("WET", "STABLE", 0.90)
    assert result["type"] == "danger"
    assert "STABLE" in result["signal"]

def test_strategy_dry_stable():
    result = get_strategy_signal("DRY", "STABLE", 0.90)
    assert result["type"] == "success"
    assert "STABLE" in result["signal"]

def test_strategy_uncertain():
    result = get_strategy_signal("UNCERTAIN", "UNCERTAIN", 0.90)
    assert result["type"] == "uncertain"
    assert "INSUFFICIENT" in result["signal"]
