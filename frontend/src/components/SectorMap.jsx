import React from 'react';

export default function SectorMap({ sectors }) {
  
  const getConditionDisplay = (condition) => {
    if (condition === 'WET') return '🔴 WET';
    if (condition === 'DAMP') return '🟡 DAMP';
    if (condition === 'DRY') return '🟢 DRY';
    if (condition === 'INVALID') return '🚫 INVALID';
    return '⚪ NO DATA';
  };

  const getColor = (condition) => {
    if (condition === 'WET') return 'border-red-500/50 bg-red-500/10 text-red-500';
    if (condition === 'DAMP') return 'border-yellow-500/50 bg-yellow-500/10 text-yellow-500';
    if (condition === 'DRY') return 'border-green-500/50 bg-green-500/10 text-green-500';
    return 'border-gray-700 bg-gray-800 text-gray-500';
  };

  const getTrendDisplay = (trend) => {
    if (trend === 'WETTING') return '↘ WETTING';
    if (trend === 'DRYING') return '↗ DRYING';
    if (trend === 'STABLE') return '→ STABLE';
    if (trend === 'MIXED' || trend === 'UNCERTAIN') return '〰 UNCERTAIN';
    if (trend === 'INSUFFICIENT DATA') return '⚪ INSUF. DATA';
    if (!trend || trend === 'NO DATA') return '';
    return trend;
  };

  return (
    <div className="flex flex-col gap-4 font-mono text-sm h-64 justify-center">
      {['sector_1', 'sector_2', 'sector_3', 'sector_4', 'sector_5'].map((sec, index) => {
        const zoneLabels = ['TURN 1', 'TURN 4', 'TURN 8', 'TURN 11', 'TURN 15'];
        const cond = sectors?.[sec]?.condition || 'NO DATA';
        const condColor = cond === 'WET' ? 'text-red-500' : cond === 'DAMP' ? 'text-yellow-500' : cond === 'DRY' ? 'text-green-500' : cond === 'INVALID' ? 'text-red-900 line-through' : 'text-gray-600';
        const dotColor = cond === 'WET' ? 'bg-red-500' : cond === 'DAMP' ? 'bg-yellow-500' : cond === 'DRY' ? 'bg-green-500' : cond === 'INVALID' ? 'bg-red-900' : 'bg-gray-600';
        
        return (
          <div key={sec} className="flex items-center justify-between border-b border-gray-800/50 pb-3 last:border-0 last:pb-0">
            <div className="flex items-center gap-3">
              <div className={`w-2.5 h-2.5 rounded-full ${dotColor}`}></div>
              <span className="text-gray-300 font-bold tracking-widest">{zoneLabels[index]}</span>
            </div>
            <span className={`font-black tracking-wider ${condColor}`}>{cond}</span>
          </div>
        );
      })}
    </div>
  );
}
