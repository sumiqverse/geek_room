import React from 'react';
import { Activity, AlertTriangle, CheckCircle, Info } from 'lucide-react';

export default function StrategySignal({ signalData, previousCondition, currentCondition, trend }) {
  if (!signalData) {
    return (
      <div className="glass-panel p-6 border-t border-gray-800 bg-[#080808] opacity-70 mt-4 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]"></div>
        <div className="flex items-center gap-3 mb-4">
          <Info className="w-6 h-6 text-gray-700" />
          <h3 className="font-bold tracking-widest uppercase text-gray-600 f1-text">AWAITING SIGNAL</h3>
        </div>
        <p className="text-sm opacity-90 font-mono mb-4 text-gray-600">Initiate full analysis to generate race strategy recommendations based on track conditions.</p>
        <div className="mt-4 pt-4 border-t border-gray-800/50">
          <p className="text-xs font-bold tracking-widest uppercase mb-1 opacity-70 text-gray-600 f1-text">RECOMMENDATION</p>
          <p className="font-mono text-sm text-gray-700 uppercase">STANDBY</p>
        </div>
      </div>
    );
  }

  const getSignalColor = (type) => {
    if (type === 'danger') return 'text-red-500 border-red-500/50 bg-[#2a0808] shadow-[0_0_15px_rgba(239,68,68,0.2)]';
    if (type === 'warning') return 'text-yellow-500 border-yellow-500/50 bg-[#2a2008] shadow-[0_0_15px_rgba(234,179,8,0.2)]';
    if (type === 'success') return 'text-green-500 border-green-500/50 bg-[#082a10] shadow-[0_0_15px_rgba(34,197,94,0.2)]';
    if (type === 'uncertain') return 'text-gray-300 border-gray-500 bg-[#1a1a1a] shadow-[0_0_15px_rgba(156,163,175,0.2)]';
    return 'text-gray-400 border-gray-700 bg-[#111]';
  };

  const getSignalIcon = (type) => {
    if (type === 'danger') return <AlertTriangle className="w-6 h-6 animate-pulse" />;
    if (type === 'warning') return <Activity className="w-6 h-6 animate-pulse" />;
    if (type === 'success') return <CheckCircle className="w-6 h-6" />;
    return <Info className="w-6 h-6" />;
  };

  return (
    <div className={`glass-panel p-6 border ${getSignalColor(signalData.type)} mt-4 transition-all duration-500 relative overflow-hidden`}>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-50"></div>
      <div className="flex items-center gap-3 mb-4">
        {getSignalIcon(signalData.type)}
        <h3 className="font-bold tracking-widest uppercase f1-text">{signalData.signal}</h3>
      </div>
      
      <p className="text-sm opacity-90 font-mono mb-4 text-white bg-black/40 p-3 rounded border border-white/10">{signalData.message}</p>
      
      <div className="mt-4 pt-4 border-t border-current/30">
        <p className="text-xs font-bold tracking-widest uppercase mb-1 opacity-70 f1-text">RECOMMENDATION</p>
        <p className="font-mono text-sm text-white font-bold">{signalData.recommendation}</p>
      </div>
    </div>
  );
}
