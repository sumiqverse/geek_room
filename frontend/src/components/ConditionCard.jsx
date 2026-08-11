import React from 'react';

export default function ConditionCard({ condition }) {
  return (
    <div className="glass-panel p-6 flex flex-col justify-center items-center relative overflow-hidden">
      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-accent/20 to-transparent rounded-bl-full"></div>
      <h3 className="text-gray-400 tracking-wider text-sm mb-2 z-10">CURRENT TRACK</h3>
      <div className={`text-5xl font-black tracking-tighter z-10 ${
        condition === 'WET' ? 'text-red-500' :
        condition === 'DAMP' ? 'text-yellow-500' :
        condition === 'DRY' ? 'text-green-500' : 'text-white'
      }`}>
        {condition || 'N/A'}
      </div>
    </div>
  );
}
