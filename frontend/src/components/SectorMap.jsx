import React from 'react';

export default function SectorMap({ sectors }) {
  
  const getConditionDisplay = (condition) => {
    if (condition === 'WET') return '🔴 WET';
    if (condition === 'DAMP') return '🟡 DAMP';
    if (condition === 'DRY') return '🟢 DRY';
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
    if (trend === 'MIXED') return '〰 MIXED';
    if (trend === 'NO DATA') return '';
    return '→ STABLE';
  };

  return (
    <div className="flex justify-between items-center bg-gray-800/50 p-4 rounded-xl border border-gray-700">
      <div className="text-center">
        <div className="text-xs text-gray-400 mb-1 font-bold">SECTOR 1</div>
        <div className="font-black text-white">{getConditionDisplay(sectors?.sector_1?.condition)}</div>
        <div className="text-xs text-gray-400 mt-1">{getTrendDisplay(sectors?.sector_1?.trend)}</div>
      </div>
      <div className="text-gray-600">❯</div>
      <div className="text-center">
        <div className="text-xs text-gray-400 mb-1 font-bold">SECTOR 2</div>
        <div className="font-black text-white">{getConditionDisplay(sectors?.sector_2?.condition)}</div>
        <div className="text-xs text-gray-400 mt-1">{getTrendDisplay(sectors?.sector_2?.trend)}</div>
      </div>
      <div className="text-gray-600">❯</div>
      <div className="text-center">
        <div className="text-xs text-gray-400 mb-1 font-bold">SECTOR 3</div>
        <div className="font-black text-white">{getConditionDisplay(sectors?.sector_3?.condition)}</div>
        <div className="text-xs text-gray-400 mt-1">{getTrendDisplay(sectors?.sector_3?.trend)}</div>
      </div>
    </div>
  );
}
