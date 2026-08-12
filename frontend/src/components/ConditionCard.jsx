import React from 'react';

export default function ConditionCard({ results }) {
  if (!results) {
    return (
      <div className="glass-panel p-5 flex flex-col relative overflow-hidden h-full border-t border-gray-800">
        <div className="z-10 flex flex-col items-center mb-4 border-b border-gray-800/50 pb-4">
          <h3 className="text-gray-500 tracking-wider text-sm mb-1 uppercase">GLOBAL TRACK STATE</h3>
          <span className="text-gray-600 text-[10px] font-mono font-bold uppercase tracking-widest whitespace-nowrap mt-1">AWAITING TELEMETRY</span>
          <div className="text-4xl font-black tracking-tighter mt-2 text-gray-700 animate-pulse">
            N/A
          </div>
        </div>
        <div className="z-10 flex flex-col gap-2 font-mono text-[10px] justify-center items-center h-full text-gray-600 tracking-widest uppercase">
          SYSTEM STANDBY
        </div>
      </div>
    );
  }

  let wet = 0, damp = 0, dry = 0, total = 0, totalObs = 0;
  
  ['sector_1', 'sector_2', 'sector_3', 'sector_4', 'sector_5'].forEach((sec) => {
    if (results[sec] && results[sec].current_condition) {
      if (results[sec].observations) {
        totalObs += results[sec].observations.length;
      }
      const cond = results[sec].current_condition;
      if (cond === 'WET') wet++;
      if (cond === 'DAMP') damp++;
      if (cond === 'DRY') dry++;
      if (cond !== 'INVALID' && cond !== 'UNCERTAIN') total++;
    }
  });

  let globalCondition = 'NO DATA';
  if (total > 0) {
    const score = ((wet * 2) + (damp * 1) + (dry * 0)) / total;
    if (score > 1.3) globalCondition = 'WET';
    else if (score >= 0.7) globalCondition = 'DAMP';
    else globalCondition = 'DRY';
  }

  return (
    <div className="glass-panel p-5 flex flex-col relative overflow-hidden h-full">
      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-accent/20 to-transparent rounded-bl-full"></div>
      
      <div className="z-10 flex flex-col items-center mb-4 border-b border-gray-800/50 pb-4">
        <h3 className="text-gray-400 tracking-wider text-sm mb-1 uppercase">GLOBAL TRACK STATE</h3>
        <span className="text-gray-300 text-[10px] font-mono font-bold uppercase tracking-widest whitespace-nowrap mt-1">{total} ZONES &bull; {totalObs} OBSERVATIONS</span>
        <div className={`text-4xl font-black tracking-tighter mt-2 ${
          globalCondition === 'WET' ? 'text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]' :
          globalCondition === 'DAMP' ? 'text-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.5)]' :
          globalCondition === 'DRY' ? 'text-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]' : 'text-gray-500'
        }`}>
          {globalCondition}
        </div>
      </div>

      <div className="z-10 flex flex-col gap-2 font-mono text-[10px]">
        <div className="text-gray-500 font-bold mb-1 tracking-widest text-center">ZONE DISTRIBUTION</div>
        
        <div className="flex items-center gap-3 group hover:bg-[#111] p-1 rounded transition-colors">
          <span className="w-8 text-red-500 font-bold">WET</span>
          <div className="flex-1 bg-gray-800 h-2 rounded overflow-hidden">
            <div className="bg-red-500 h-full shadow-[0_0_8px_#ef4444]" style={{ width: `${total > 0 ? (wet / total) * 100 : 0}%` }}></div>
          </div>
          <span className="w-8 text-right text-gray-400">{wet}/{total}</span>
        </div>

        <div className="flex items-center gap-3 group hover:bg-[#111] p-1 rounded transition-colors">
          <span className="w-8 text-yellow-500 font-bold">DAMP</span>
          <div className="flex-1 bg-gray-800 h-2 rounded overflow-hidden">
            <div className="bg-yellow-500 h-full shadow-[0_0_8px_#eab308]" style={{ width: `${total > 0 ? (damp / total) * 100 : 0}%` }}></div>
          </div>
          <span className="w-8 text-right text-gray-400">{damp}/{total}</span>
        </div>

        <div className="flex items-center gap-3 group hover:bg-[#111] p-1 rounded transition-colors">
          <span className="w-8 text-green-500 font-bold">DRY</span>
          <div className="flex-1 bg-gray-800 h-2 rounded overflow-hidden">
            <div className="bg-green-500 h-full shadow-[0_0_8px_#22c55e]" style={{ width: `${total > 0 ? (dry / total) * 100 : 0}%` }}></div>
          </div>
          <span className="w-8 text-right text-gray-400">{dry}/{total}</span>
        </div>
      </div>
    </div>
  );
}
