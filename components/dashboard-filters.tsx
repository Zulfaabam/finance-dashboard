'use client'

import { Search, X } from 'lucide-react'

interface DashboardFiltersProps {
  channels: string[]
  selectedChannel: string
  onChannelChange: (channel: string) => void
  months: string[]
  selectedMonth: string
  onMonthChange: (month: string) => void
  statuses: string[]
  selectedStatus: string
  onStatusChange: (status: string) => void
  searchQuery: string
  onSearchChange: (query: string) => void
  onClearSearch: () => void
  onClearAll: () => void
  hasActiveFilters: boolean
  selectedDateColumn: string
  onDateColumnChange: (column: string) => void
  selectedDate: string
  onDateChange: (date: string) => void
}

const DATE_COLUMNS = [
  { label: 'Created Date', value: 'create_time' },
  { label: 'Payment Date', value: 'pay_time' },
  { label: 'Ship By Date', value: 'ship_by_date' },
  { label: 'Synced Date', value: 'synced_at' },
]

export function DashboardFilters({
  channels,
  selectedChannel,
  onChannelChange,
  months,
  selectedMonth,
  onMonthChange,
  statuses,
  selectedStatus,
  onStatusChange,
  searchQuery,
  onSearchChange,
  onClearSearch,
  onClearAll,
  hasActiveFilters,
  selectedDateColumn,
  onDateColumnChange,
  selectedDate,
  onDateChange,
}: DashboardFiltersProps) {
  return (
    <div className='space-y-4'>
      {/* First Row: Search */}
      <div className='flex-1 relative'>
        <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none' />
        <input
          type='text'
          placeholder='Search by Order ID or Buyer ID...'
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className='w-full pl-10 pr-10 py-2 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all'
        />
        {searchQuery && (
          <button
            onClick={onClearSearch}
            className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors'
          >
            <X className='w-5 h-5' />
          </button>
        )}
      </div>

      {/* Second Row: Dropdowns & Date */}
      <div className='flex flex-col md:flex-row flex-wrap gap-3 items-stretch md:items-center'>
        <select
          value={selectedChannel}
          onChange={(e) => onChannelChange(e.target.value)}
          className='px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all hover:border-primary/50'
        >
          <option value=''>All Channels</option>
          {channels.map((channel) => (
            <option key={channel} value={channel}>
              {channel}
            </option>
          ))}
        </select>

        <select
          value={selectedMonth}
          onChange={(e) => onMonthChange(e.target.value)}
          className='px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all hover:border-primary/50'
        >
          <option value=''>All Months</option>
          {months.map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          className='px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all hover:border-primary/50'
        >
          <option value=''>All Statuses</option>
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status.replaceAll('_', ' ')}
            </option>
          ))}
        </select>

        <div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto'>
          <select
            value={selectedDateColumn}
            onChange={(e) => onDateColumnChange(e.target.value)}
            className='px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all hover:border-primary/50'
          >
            {DATE_COLUMNS.map((col) => (
              <option key={col.value} value={col.value}>
                {col.label}
              </option>
            ))}
          </select>
          <input
            type='date'
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
            className='px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all hover:border-primary/50'
          />
        </div>

        {hasActiveFilters && (
          <button
            onClick={onClearAll}
            className='px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-lg text-sm font-medium transition-colors md:ml-auto whitespace-nowrap'
          >
            Clear All Filters
          </button>
        )}
      </div>
    </div>
  )
}
