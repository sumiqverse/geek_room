import React from 'react';
import { Activity, AlertTriangle, CheckCircle, Info } from 'lucide-react';

export default function StrategySignal({ signalData, previousCondition, currentCondition, trend }) {
  if (!signalData) return null;

  const getSignalColor = (type) => {
    if (type === 'danger') return 'text-red-500 border-red-500/50 bg-red-500/10';
    if (type === 'warning') return 'text-yellow-500 border-yellow-500/50 bg-yellow-500/10';
    if (type === 'success') return 'text-green-500 border-green-500/50 bg-green-500/10';
    if (type === 'uncertain') return 'text-gray-300 border-gray-400 bg-gray-600/20';
    return 'text-gray-400 border-gray-600 bg-gray-800';
  };

  const getSignalIcon = (type) => {
    if (type === 'danger') return <AlertTriangle className="w-6 h-6" />;
    if (type === 'warning') return <Activity className="w-6 h-6" />;
    if (type === 'success') return <CheckCircle className="w-6 h-6" />;
    return <Info className="w-6 h-6" />;
  };

  return (
    <div className={`glass-panel p-6 border ${getSignalColor(signalData.type)}`}>
      <div className="flex items-center gap-3 mb-4">
        {getSignalIcon(signalData.type)}
        <h3 className="font-bold tracking-widest uppercase">{signalData.signal}</h3>
      </div>
      
      {/* Pipeline Explainability */}
      <div className="flex items-center justify-between text-[10px] font-mono mb-4 text-gray-500 border-b border-gray-800/50 pb-2">
        <div className="flex items-center gap-2">
          <span>VISUAL AI</span>
          <span className="text-white">{previousCondition || '---'}</span>
        </div>
        <span>&rarr;</span>
        <div className="flex items-center gap-2">
          <span>TEMPORAL</span>
          <span className="text-white">{trend || '---'}</span>
        </div>
        <span>&rarr;</span>
        <div className="flex items-center gap-2">
          <span>DECISION</span>
          <span className="text-white">
            {signalData.type === 'danger' ? 'MONITOR' : 
             signalData.type === 'warning' ? 'PREPARE' : 
             signalData.type === 'success' ? 'HOLD' : 'WAIT'}
          </span>
        </div>
      </div>

      <p className="text-sm opacity-90 font-mono mb-4 text-gray-300">{signalData.message}</p>
      
      <div className="mt-4 pt-4 border-t border-current/20">
        <p className="text-xs font-bold tracking-widest uppercase mb-1 opacity-70 text-gray-400">RECOMMENDATION</p>
        <p className="font-mono text-sm text-white">{signalData.recommendation}</p>
      </div>
    </div>
  );
}
