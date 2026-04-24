"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

export default function SensorChart({ data, threshold }: { data: any[], threshold: any }) {

  const formatXAxis = (tickItem: string) => {
    const date = new Date(tickItem);
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="h-64 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
          <XAxis 
            dataKey="timestamp" 
            tickFormatter={formatXAxis} 
            minTickGap={50}
            stroke="#9ca3af"
            fontSize={12}
          />
          <YAxis 
            domain={['dataMin - 10', 'dataMax + 10']} 
            stroke="#9ca3af"
            fontSize={12}
          />
          <Tooltip 
            labelFormatter={(label) => new Date(label).toLocaleString('id-ID')}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          
          <ReferenceLine y={threshold.siaga} stroke="#3b82f6" strokeDasharray="3 3" label={{ position: 'top', value: 'Siaga', fill: '#3b82f6', fontSize: 12 }} />
          <ReferenceLine y={threshold.waspada} stroke="#f97316" strokeDasharray="3 3" label={{ position: 'top', value: 'Waspada', fill: '#f97316', fontSize: 12 }} />
          <ReferenceLine y={threshold.awas} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'top', value: 'Awas', fill: '#ef4444', fontSize: 12 }} />
          
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke="#10b981" 
            strokeWidth={2} 
            dot={false} 
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}