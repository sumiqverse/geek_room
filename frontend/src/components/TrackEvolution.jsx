import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function TrackEvolution({ observations }) {
  if (!observations || observations.length === 0) return null;

  const data = observations.map(obs => ({
    time: obs.timestamp,
    wetness: obs.condition === 'WET' ? 2 : obs.condition === 'DAMP' ? 1 : 0
  }));

  const yAxisFormatter = (val) => {
    if (val === 2) return 'WET';
    if (val === 1) return 'DAMP';
    if (val === 0) return 'DRY';
    return '';
  };

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 20, left: 20, bottom: 0 }}>
          <XAxis 
            dataKey="time" 
            stroke="#6B7280" 
            tickFormatter={(val) => `${val}s`}
          />
          <YAxis 
            ticks={[0, 1, 2]} 
            tickFormatter={yAxisFormatter} 
            stroke="#6B7280" 
            domain={[0, 2]}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '0.5rem' }}
            labelStyle={{ color: '#9CA3AF' }}
            formatter={(value) => [yAxisFormatter(value), 'Condition']}
            labelFormatter={(label) => `Time: ${label}s`}
          />
          <Line 
            type="stepAfter" 
            dataKey="wetness" 
            stroke="#38BDF8" 
            strokeWidth={3} 
            dot={{ r: 6, fill: '#38BDF8' }} 
            activeDot={{ r: 8 }} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
