import sys
import os

sys.path.append(os.path.dirname(__file__))

from analysis.trend import analyze_trend
from analysis.strategy import get_strategy_signal

scenarios = [
    # A: WET -> WET -> WET -> DAMP -> DAMP -> DRY
    [{'condition': 'WET', 'confidence': 0.9}, {'condition': 'WET', 'confidence': 0.9}, {'condition': 'WET', 'confidence': 0.9}, {'condition': 'DAMP', 'confidence': 0.9}, {'condition': 'DAMP', 'confidence': 0.9}, {'condition': 'DRY', 'confidence': 0.9}],
    # B: DRY -> DRY -> DAMP -> WET -> WET
    [{'condition': 'DRY', 'confidence': 0.9}, {'condition': 'DRY', 'confidence': 0.9}, {'condition': 'DAMP', 'confidence': 0.9}, {'condition': 'WET', 'confidence': 0.9}, {'condition': 'WET', 'confidence': 0.9}],
    # C: WET -> WET -> WET -> WET -> WET
    [{'condition': 'WET', 'confidence': 0.9}, {'condition': 'WET', 'confidence': 0.9}, {'condition': 'WET', 'confidence': 0.9}, {'condition': 'WET', 'confidence': 0.9}, {'condition': 'WET', 'confidence': 0.9}],
    # D: WET -> DRY -> WET -> DRY -> DAMP (Fluctuating)
    [{'condition': 'WET', 'confidence': 0.9}, {'condition': 'DRY', 'confidence': 0.9}, {'condition': 'WET', 'confidence': 0.9}, {'condition': 'DRY', 'confidence': 0.9}, {'condition': 'DAMP', 'confidence': 0.9}]
]

for i, obs in enumerate(scenarios):
    res = analyze_trend(obs)
    strat = get_strategy_signal(res['current_condition'], res['trend'], res['trend_confidence'])
    print(f'Scenario {chr(65+i)}:')
    print(f'  Current: {res["current_condition"]}')
    print(f'  Trend: {res["trend"]}')
    print(f'  Strategy: {strat["signal"]}')
