import React from 'react';

export default function ConfidenceCard({ visualConfidence, trendConfidence, trend }) {
  if (visualConfidence === undefined && trendConfidence === undefined) {
    return (
      <div className="glass-panel p-6 flex flex-col justify-center h-full border-t border-gray-800">
        
        <div className="mb-4 pb-4 border-b border-gray-800/50">
          <div className="flex flex-col items-start mt-1">
            <h3 className="text-gray-500 tracking-wider text-xs mb-1 uppercase">Temporal Trend</h3>
            <span className="text-gray-600 text-[10px] font-mono mb-2 uppercase">Awaiting history</span>
          </div>
          <div className="text-3xl font-black text-gray-700 tracking-tighter leading-none animate-pulse">
            N/A
          </div>
        </div>

        <div className="mb-4 opacity-50">
          <h3 className="text-gray-500 tracking-wider text-xs mb-1 uppercase">Visual Confidence</h3>
          <div className="flex items-end gap-2 mb-2">
            <div className="text-4xl font-black text-gray-700 tracking-tighter leading-none">
              --<span className="text-xl text-gray-700/50">%</span>
            </div>
          </div>
          <div className="w-full bg-gray-900 rounded-full h-1.5">
            <div className="bg-gray-700 h-1.5 rounded-full" style={{ width: `0%` }}></div>
          </div>
        </div>

        <div className="opacity-50">
          <h3 className="text-gray-500 tracking-wider text-xs mb-1 uppercase">Trend Score</h3>
          <div className="flex items-end gap-2 mb-2">
            <div className="text-3xl font-black text-gray-700 tracking-tighter leading-none">
              --<span className="text-lg text-gray-700/50">%</span>
            </div>
          </div>
          <div className="w-full bg-gray-900 rounded-full h-1.5">
            <div className="bg-gray-700 h-1.5 rounded-full" style={{ width: `0%` }}></div>
          </div>
        </div>

      </div>
    );
  }

  return (
    <div className="glass-panel p-6 flex flex-col justify-center h-full transition-all duration-500 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] relative overflow-hidden">
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl"></div>
      
      <div className="mb-4 pb-4 border-b border-gray-800/50 relative z-10">
        <div className="flex flex-col items-start mt-1">
          <h3 className="text-gray-400 tracking-wider text-xs mb-1 uppercase">Temporal Trend</h3>
          <span className="text-gray-400 text-[10px] font-mono mb-2 uppercase">Based on last 5 reliable obs.</span>
        </div>
        <div className="text-3xl font-black text-white tracking-tighter leading-none drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
          {trend || 'N/A'}
        </div>
      </div>

      <div className="mb-4 relative z-10">
        <h3 className="text-gray-400 tracking-wider text-xs mb-1 uppercase">Visual Confidence</h3>
        <div className="flex items-end gap-2 mb-2">
          <div className="text-4xl font-black text-accent tracking-tighter leading-none drop-shadow-[0_0_15px_rgba(255,40,0,0.4)]">
            {Math.round((visualConfidence || 0) * 100)}<span className="text-xl text-accent/50">%</span>
          </div>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
          <div className="bg-accent h-1.5 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_#ff2800]" style={{ width: `${(visualConfidence || 0) * 100}%` }}></div>
        </div>
      </div>

      <div className="relative z-10">
        <h3 className="text-gray-400 tracking-wider text-xs mb-1 uppercase">Trend Score</h3>
        <div className="flex items-end gap-2 mb-2">
          <div className="text-3xl font-black text-purple-400 tracking-tighter leading-none drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]">
            {Math.round((trendConfidence || 0) * 100)}<span className="text-lg text-purple-400/50">%</span>
          </div>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
          <div className="bg-purple-500 h-1.5 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_#a855f7]" style={{ width: `${(trendConfidence || 0) * 100}%` }}></div>
        </div>
      </div>

    </div>
  );
}
