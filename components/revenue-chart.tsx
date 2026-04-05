'use client';

import { Info } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '@/lib/format';

interface TrendData {
  date: string;
  revenue: number;
}

interface RevenueChartProps {
  data: TrendData[];
  isLoading: boolean;
}

export function RevenueChart({ data, isLoading }: RevenueChartProps) {
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
        <h3 className="text-lg font-semibold text-foreground">Revenue Trend</h3>
        <div className="relative">
          <Info className="w-4 h-4 text-muted-foreground hover:text-foreground cursor-help transition-colors" />
          <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block bg-foreground text-card rounded px-2 py-1 text-xs whitespace-nowrap z-10">
            Daily net revenue over the period
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis 
            dataKey="date" 
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
          <Line 
            type="monotone" 
            dataKey="revenue" 
            stroke="#2563eb" 
            strokeWidth={2}
            dot={false}
            isAnimationActive={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
