import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function TrackEvolution({ results }) {
  if (!results) return null;

  const data = [
    { name: 'Z1' },
    { name: 'Z2' },
    { name: 'Z3' },
    { name: 'Z4' },
    { name: 'Z5' }
  ];

  let hasData = false;

  ['sector_1', 'sector_2', 'sector_3', 'sector_4', 'sector_5'].forEach((sec, index) => {
    if (results[sec] && results[sec].observations) {
      const validObs = results[sec].observations.filter(obs => obs.condition !== 'INVALID');
      if (validObs.length > 0) {
        hasData = true;
        const latest = validObs[validObs.length - 1];
        data[index].latest = latest.condition === 'WET' ? 2 : latest.condition === 'DAMP' ? 1 : 0;
        
        if (validObs.length > 1) {
          const initial = validObs[0];
          data[index].initial = initial.condition === 'WET' ? 2 : initial.condition === 'DAMP' ? 1 : 0;
        }
      }
    }
  });

  if (!hasData) return (
    <div className="h-64 w-full flex items-center justify-center text-gray-600 font-mono text-sm">
      NO VALID DATA TO GRAPH
    </div>
  );

  const yAxisFormatter = (val) => {
    if (val === 2) return 'WET';
    if (val === 1) return 'DAMP';
    if (val === 0) return 'DRY';
    return '';
  };
  
  const customTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 p-3 rounded-lg border border-gray-700 shadow-xl">
          <p className="text-gray-400 mb-2 font-mono text-xs">ZONE: {label}</p>
          {payload.map((p, index) => (
             <div key={index} style={{ color: p.color }} className="font-bold text-sm tracking-wider">
               {p.name}: {yAxisFormatter(p.value)}
             </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 20, left: 20, bottom: 0 }}>
            <XAxis 
              dataKey="name" 
              stroke="#6B7280" 
              tick={{ fill: '#9CA3AF', fontWeight: 'bold' }}
            />
            <YAxis 
              ticks={[0, 1, 2]} 
              tickFormatter={yAxisFormatter} 
              stroke="#6B7280" 
              domain={[0, 2]}
            />
            <Tooltip content={customTooltip} cursor={{ stroke: '#374151', strokeWidth: 2 }} />
            <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold' }} />
            
            <Line name="INITIAL CONDITION" type="monotone" dataKey="initial" stroke="#6B7280" strokeWidth={3} strokeDasharray="5 5" dot={{ r: 4 }} activeDot={{ r: 6 }} connectNulls={true} />
            <Line name="LATEST CONDITION" type="monotone" dataKey="latest" stroke="#38BDF8" strokeWidth={4} dot={{ r: 6, fill: '#38BDF8' }} activeDot={{ r: 8 }} connectNulls={true} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
