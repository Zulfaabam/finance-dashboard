'use client';

import { Info } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '@/lib/format';

interface ChannelData {
  name: string;
  value: number;
}

interface ChannelChartProps {
  data: ChannelData[];
  isLoading: boolean;
}

export function ChannelChart({ data, isLoading }: ChannelChartProps) {
  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 h-80 flex items-center justify-center">
        <div className="text-muted-foreground">Loading chart...</div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 group relative">
      <div className="flex items-center gap-2 mb-6">
        <h3 className="text-lg font-semibold text-foreground">Revenue by Channel</h3>
        <div className="relative">
          <Info className="w-4 h-4 text-muted-foreground hover:text-foreground cursor-help transition-colors" />
          <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block bg-foreground text-card rounded px-2 py-1 text-xs whitespace-nowrap z-10">
            Net revenue breakdown by sales channel
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis 
            dataKey="name" 
            stroke="#64748b"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#64748b"
            style={{ fontSize: '12px' }}
            tickFormatter={(value) => `Rp${(value / 1000000).toFixed(0)}M`}
          />
          <Tooltip 
            formatter={(value: number) => formatCurrency(value)}
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px'
            }}
            labelStyle={{ color: '#1e293b' }}
          />
          <Bar 
            dataKey="value" 
            fill="#2563eb" 
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
