import React from 'react';

export default function AnalysisSummary({ result, mode }) {
  if (!result || !result.observations) return null;

  const total = result.observations.length;
  const highConf = result.observations.filter(o => o.confidence >= 0.60).length;

  return (
    <div className="glass-panel p-6 mt-6 bg-gray-900/50 mb-4 border border-accent/20">
      <h3 className="font-bold tracking-wider text-xs text-gray-500 mb-3 uppercase">Analysis Summary</h3>
      <div className="font-mono text-sm space-y-1 text-gray-300">
        <p><span className="text-white font-bold">{total}</span> {mode === 'images' ? 'images' : 'video frames'} analyzed</p>
        <p>Current: <span className="text-white">{result.current_condition}</span></p>
        <p>Trend: <span className="text-accent">{result.trend}</span></p>
        <p>High-confidence observations: <span className="text-white">{highConf}/{total}</span></p>
      </div>
    </div>
  );
}
