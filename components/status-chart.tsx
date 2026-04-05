'use client'

import { Info } from 'lucide-react'

interface StatusData {
  name: string
  value: number
}

interface StatusChartProps {
  data: StatusData[]
  isLoading: boolean
}

const getStatusColor = (status: string) => {
  const s = (status || '').toLowerCase()
  if (
    s.includes('completed') ||
    s.includes('delivered') ||
    s.includes('success')
  )
    return '#10b981' // emerald-500
  if (s.includes('cancel') || s.includes('fail') || s.includes('return'))
    return '#ef4444' // red-500
  if (s.includes('ship') || s.includes('process')) return '#3b82f6' // blue-500
  if (s.includes('pending') || s.includes('unpaid') || s.includes('wait'))
    return '#f59e0b' // amber-500
  return '#64748b' // slate-500
}

export function StatusChart({ data, isLoading }: StatusChartProps) {
  if (isLoading) {
    return (
      <div className='bg-card border border-border rounded-lg p-4 flex items-center justify-center'>
        <div className='text-muted-foreground'>Loading chart...</div>
      </div>
    )
  }

  return (
    <div className='bg-card border border-border rounded-lg p-4 group relative'>
      <div className='flex items-center gap-2 mb-4'>
        <h3 className='text-lg font-semibold text-foreground'>
          Order Status Distribution
        </h3>
        <div className='relative'>
          <Info className='w-4 h-4 text-muted-foreground hover:text-foreground cursor-help transition-colors' />
          <div className='absolute bottom-full left-0 mb-2 hidden group-hover:block bg-foreground text-card rounded px-2 py-1 text-xs whitespace-nowrap z-10'>
            Count of orders by status
          </div>
        </div>
      </div>
      <div className='space-y-3'>
        {data.map((entry, index) => (
          <div key={entry.name} className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <div
                className='w-3 h-3 rounded-full'
                style={{ backgroundColor: getStatusColor(entry.name) }}
              />
              <span className='text-sm font-medium text-foreground'>
                {entry.name}
              </span>
            </div>
            <span className='text-sm text-muted-foreground font-medium'>
              {entry.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
