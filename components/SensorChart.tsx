"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Area, AreaChart } from 'recharts';

const DEFAULT_THRESHOLDS: any = {
  "WL-001": { siaga: 200, waspada: 250, awas: 300 },
  "WL-002": { siaga: 180, waspada: 230, awas: 280 },
  "WL-003": { siaga: 170, waspada: 220, awas: 270 },
};

interface SensorChartProps {
  data: any[];
  color: string;
  sensorId?: string;
}

export default function SensorChart({ data, color, sensorId }: SensorChartProps) {
  const selectedSensorId = sensorId || (data.length > 0 ? data[0].sensor_id : "WL-001");
  const threshold = DEFAULT_THRESHOLDS[selectedSensorId];

  const formatXAxis = (tickItem: any) => {
    return new Date(tickItem).toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-sm border-2 border-gray-200 rounded-xl p-3 shadow-xl">
          <p className="text-xs font-bold text-gray-500 mb-1">
            {new Date(label).toLocaleString('id-ID', {
              day: '2-digit',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
          <p className="text-lg font-black" style={{ color }}>
            {payload[0].value.toFixed(2)} cm
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
        <defs>
          <linearGradient id={`colorValue-${selectedSensorId}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
            <stop offset="95%" stopColor={color} stopOpacity={0}/>
          </linearGradient>
        </defs>
        
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" opacity={0.5} />
        
        <XAxis 
          dataKey="timestamp" 
          tickFormatter={formatXAxis} 
          minTickGap={40}
          tick={{ fontSize: 10, fill: '#6b7280', fontWeight: 600 }}
          axisLine={{ stroke: '#d1d5db' }}
          tickLine={{ stroke: '#d1d5db' }}
        />
        
        <YAxis 
          tick={{ fontSize: 10, fill: '#6b7280', fontWeight: 600 }}
          axisLine={{ stroke: '#d1d5db' }}
          tickLine={{ stroke: '#d1d5db' }}
          domain={['dataMin - 20', 'dataMax + 20']}
        />
        
        <Tooltip content={<CustomTooltip />} />
        
        <ReferenceLine 
          y={threshold.siaga} 
          stroke="#eab308" 
          strokeDasharray="5 5" 
          strokeWidth={2}
          label={{ 
            position: 'right', 
            value: 'SIAGA', 
            fontSize: 9, 
            fill: '#eab308',
            fontWeight: 'bold',
            offset: 5
          }} 
        />
        <ReferenceLine 
          y={threshold.waspada} 
          stroke="#f97316" 
          strokeDasharray="5 5" 
          strokeWidth={2}
          label={{ 
            position: 'right', 
            value: 'WASPADA', 
            fontSize: 9, 
            fill: '#f97316',
            fontWeight: 'bold',
            offset: 5
          }} 
        />
        <ReferenceLine 
          y={threshold.awas} 
          stroke="#ef4444" 
          strokeDasharray="5 5" 
          strokeWidth={2}
          label={{ 
            position: 'right', 
            value: 'AWAS', 
            fontSize: 9, 
            fill: '#ef4444',
            fontWeight: 'bold',
            offset: 5
          }} 
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={3}
          fill={`url(#colorValue-${selectedSensorId})`}
          animationDuration={1500}
          dot={false}
          activeDot={{ 
            r: 6, 
            fill: color,
            stroke: '#fff',
            strokeWidth: 3
          }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}