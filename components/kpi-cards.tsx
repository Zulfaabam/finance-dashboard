'use client'

import {
  TrendingUp,
  ShoppingCart,
  DollarSign,
  AlertCircle,
  Info,
} from 'lucide-react'
import { formatCurrency, formatNumber } from '@/lib/format'

interface KPICardsProps {
  totalRevenue: number
  totalOrders: number
  averageOrderValue: number
  totalLeakage: number
  leakagePercentage: number
}

export function KPICards({
  totalRevenue,
  totalOrders,
  averageOrderValue,
  totalLeakage,
  leakagePercentage,
}: KPICardsProps) {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
      <div className='bg-card border border-border rounded-lg p-6 group relative'>
        <div className='flex items-start justify-between'>
          <div className='flex-1'>
            <div className='flex items-center gap-2 mb-2'>
              <p className='text-muted-foreground text-sm font-medium'>
                Net Revenue
              </p>
              <div className='relative'>
                <Info className='w-4 h-4 text-muted-foreground hover:text-foreground cursor-help transition-colors' />
                <div className='absolute bottom-full left-0 mb-2 hidden group-hover:block bg-foreground text-card rounded px-2 py-1 text-xs whitespace-nowrap z-10'>
                  Total revenue after discounts and fees
                </div>
              </div>
            </div>
            <p className='text-2xl font-bold text-emerald-600 dark:text-emerald-400'>
              {formatCurrency(totalRevenue)}
            </p>
          </div>
          <DollarSign className='w-8 h-8 text-emerald-500 opacity-70' />
        </div>
        <p className='text-xs text-muted-foreground mt-4 flex items-center gap-1'>
          <TrendingUp className='w-3 h-3' />
          Current period
        </p>
      </div>

      <div className='bg-card border border-border rounded-lg p-6 group relative'>
        <div className='flex items-start justify-between'>
          <div className='flex-1'>
            <div className='flex items-center gap-2 mb-2'>
              <p className='text-muted-foreground text-sm font-medium'>
                Total Orders
              </p>
              <div className='relative'>
                <Info className='w-4 h-4 text-muted-foreground hover:text-foreground cursor-help transition-colors' />
                <div className='absolute bottom-full left-0 mb-2 hidden group-hover:block bg-foreground text-card rounded px-2 py-1 text-xs whitespace-nowrap z-10'>
                  Count of all unique transactions
                </div>
              </div>
            </div>
            <p className='text-2xl font-bold text-blue-600 dark:text-blue-400'>
              {formatNumber(totalOrders)}
            </p>
          </div>
          <ShoppingCart className='w-8 h-8 text-blue-500 opacity-70' />
        </div>
        <p className='text-xs text-muted-foreground mt-4'>
          Unique transactions
        </p>
      </div>

      <div className='bg-card border border-border rounded-lg p-6 group relative'>
        <div className='flex items-start justify-between'>
          <div className='flex-1'>
            <div className='flex items-center gap-2 mb-2'>
              <p className='text-muted-foreground text-sm font-medium'>
                Avg Order Value
              </p>
              <div className='relative'>
                <Info className='w-4 h-4 text-muted-foreground hover:text-foreground cursor-help transition-colors' />
                <div className='absolute bottom-full left-0 mb-2 hidden group-hover:block bg-foreground text-card rounded px-2 py-1 text-xs whitespace-nowrap z-10'>
                  Average revenue per transaction
                </div>
              </div>
            </div>
            <p className='text-2xl font-bold text-amber-600 dark:text-amber-400'>
              {formatCurrency(averageOrderValue)}
            </p>
          </div>
          <DollarSign className='w-8 h-8 text-amber-500 opacity-70' />
        </div>
        <p className='text-xs text-muted-foreground mt-4'>Per transaction</p>
      </div>

      <div className='bg-card border border-border rounded-lg p-6 group relative'>
        <div className='flex items-start justify-between'>
          <div className='flex-1'>
            <div className='flex items-center gap-2 mb-2'>
              <p className='text-muted-foreground text-sm font-medium'>
                Revenue Leakage
              </p>
              <div className='relative'>
                <Info className='w-4 h-4 text-muted-foreground hover:text-foreground cursor-help transition-colors' />
                <div className='absolute bottom-full left-0 mb-2 hidden group-hover:block bg-foreground text-card rounded px-2 py-1 text-xs whitespace-nowrap z-10'>
                  total revenue lost to discounts & shipping fees
                </div>
              </div>
            </div>
            <div className='flex items-baseline gap-2'>
              <p className='text-2xl font-bold text-red-600 dark:text-red-400'>
                {formatCurrency(totalLeakage)}
              </p>
              <span className='text-sm font-medium text-muted-foreground'>
                ({leakagePercentage.toFixed(1)}%)
              </span>
            </div>
          </div>
          <AlertCircle className='w-8 h-8 text-red-500 opacity-70' />
        </div>
        <p className='text-xs text-muted-foreground mt-4'>Discounts & Fees</p>
      </div>
    </div>
  )
}
