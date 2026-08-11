import React from 'react';

export default function ConfidenceCard({ visualConfidence, trendConfidence }) {
  return (
    <div className="glass-panel p-6 flex flex-col justify-center">
      
      {/* Visual Confidence */}
      <div className="mb-6">
        <h3 className="text-gray-400 tracking-wider text-xs mb-1 uppercase">Visual Confidence</h3>
        <div className="flex items-end gap-2 mb-2">
          <div className="text-4xl font-black text-accent tracking-tighter leading-none">
            {Math.round((visualConfidence || 0) * 100)}<span className="text-xl text-accent/50">%</span>
          </div>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-1.5">
          <div className="bg-accent h-1.5 rounded-full transition-all duration-500" style={{ width: `${(visualConfidence || 0) * 100}%` }}></div>
        </div>
      </div>

      {/* Trend Confidence */}
      <div>
        <h3 className="text-gray-400 tracking-wider text-xs mb-1 uppercase">Trend Confidence</h3>
        <div className="flex items-end gap-2 mb-2">
          <div className="text-3xl font-black text-purple-400 tracking-tighter leading-none">
            {Math.round((trendConfidence || 0) * 100)}<span className="text-lg text-purple-400/50">%</span>
          </div>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-1.5">
          <div className="bg-purple-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${(trendConfidence || 0) * 100}%` }}></div>
        </div>
      </div>

    </div>
  );
}
