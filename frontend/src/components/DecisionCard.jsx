import React from 'react';

export default function DecisionCard({ signalData }) {
  if (!signalData) {
    return (
      <div className="glass-panel p-6 flex flex-col justify-center h-full border-t border-gray-800" style={{ borderLeftColor: '#333' }}>
        <div className="mb-4 pb-4 border-b border-gray-800/50">
          <h3 className="text-gray-500 tracking-wider text-xs mb-1 uppercase">Strategy Decision</h3>
          <div className="text-3xl font-black tracking-tighter leading-none text-gray-700 animate-pulse mt-2">
            PENDING
          </div>
        </div>
        <div className="text-[10px] text-gray-600 font-mono tracking-widest uppercase">
          Awaiting telemetry
        </div>
      </div>
    );
  }

  let decision = 'WAIT';
  if (signalData.type === 'danger') decision = 'MONITOR';
  else if (signalData.type === 'warning') decision = 'PREPARE';
  else if (signalData.type === 'success') decision = 'HOLD';

  return (
    <div className="glass-panel p-6 flex flex-col justify-center h-full transition-all duration-500 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]" style={{ borderLeftColor: signalData.type === 'danger' ? '#ef4444' : signalData.type === 'warning' ? '#eab308' : signalData.type === 'success' ? '#22c55e' : '#6b7280' }}>
      
      <div className="mb-4 pb-4 border-b border-gray-800/50">
        <h3 className="text-gray-400 tracking-wider text-xs mb-1 uppercase">Strategy Decision</h3>
        <div className={`text-3xl font-black tracking-tighter leading-none mt-2 ${signalData.type === 'danger' ? 'text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]' : signalData.type === 'warning' ? 'text-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.3)]' : signalData.type === 'success' ? 'text-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]' : 'text-gray-500'}`}>
          {decision}
        </div>
      </div>

      <div className="text-[10px] text-gray-400 font-mono tracking-widest uppercase bg-[#111] p-2 rounded">
        {decision === 'MONITOR' ? 'Continue monitoring' : 
         decision === 'PREPARE' ? 'Prepare for change' : 
         decision === 'HOLD' ? 'Maintain strategy' : 'Awaiting clear trend'}
      </div>

    </div>
  );
}
