import React from 'react';

export default function AnalysisSummary({ result, mode, zoneLabel }) {
  if (!result || !result.observations) return null;

  const total = result.observations.length;
  const highConf = result.observations.filter(o => o.confidence >= 0.80).length;
  const medConf = result.observations.filter(o => o.confidence >= 0.60 && o.confidence < 0.80).length;
  const lowConf = result.observations.filter(o => o.confidence < 0.60).length;

  return (
    <div className="glass-panel p-6 mt-6 bg-gray-900/50 mb-4 border border-accent/20">
      <h3 className="font-bold tracking-wider text-xs text-gray-500 mb-3 uppercase">{zoneLabel || 'ZONE'} ANALYSIS SUMMARY</h3>
      <div className="font-mono text-sm space-y-1 text-gray-300">
        <p><span className="text-white font-bold">{total}</span> {mode === 'images' ? (total === 1 ? 'image' : 'images') : (total === 1 ? 'video frame' : 'video frames')} analyzed</p>
        <p>Current: <span className="text-white">{result.current_condition}</span></p>
        <p>Trend: <span className="text-accent">{result.trend}</span></p>
        
        <div className="mt-3 pt-3 border-t border-gray-800 space-y-1">
          <p className="text-xs text-gray-400">High-confidence (≥80%): <span className="text-white">{highConf}/{total}</span></p>
          <p className="text-xs text-gray-400">Medium-confidence (60–79%): <span className="text-white">{medConf}/{total}</span></p>
          <p className="text-xs text-gray-400">Low-confidence (&lt;60%): <span className="text-white">{lowConf}/{total}</span></p>
        </div>
      </div>
    </div>
  );
}
