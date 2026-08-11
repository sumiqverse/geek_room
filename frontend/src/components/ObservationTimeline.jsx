import React from 'react';

export default function ObservationTimeline({ observations, mode }) {
  if (!observations || observations.length === 0) return null;

  return (
    <div className="glass-panel p-6 mt-6 bg-gray-900/50">
      <h3 className="font-bold tracking-wider text-xs text-gray-500 mb-4 uppercase">Observation Timeline</h3>
      
      <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
        {observations.map((obs) => (
          <div key={obs.index} className="flex items-center justify-between bg-black/40 p-2 rounded font-mono text-sm border border-gray-800">
            <div className="flex items-center gap-4">
              <span className="text-gray-500 w-8">
                {String(obs.index).padStart(2, '0')}
              </span>
              <span className="text-gray-400 w-12">
                {mode === 'images' ? `OBS ${obs.index}` : `${Number(obs.timestamp).toFixed(1)}s`}
              </span>
              <span className={`font-bold w-16 ${
                obs.condition === 'WET' ? 'text-red-500' : 
                obs.condition === 'DAMP' ? 'text-yellow-500' : 
                'text-green-500'
              }`}>
                {obs.condition}
              </span>
            </div>
            <div className="text-accent flex items-center gap-2">
              <div className="w-16 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-accent" 
                  style={{ width: `${Math.round(obs.confidence * 100)}%` }}
                />
              </div>
              <span className="w-10 text-right">
                {Math.round(obs.confidence * 100)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
