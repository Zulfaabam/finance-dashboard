'use client'

import { useState, useEffect, useMemo } from 'react'
import { BarChart3, ArrowUpRight } from 'lucide-react'
import {
  Order,
  parseCSV,
  calculateKPIs,
  groupByChannel,
  groupByStatus,
  getTrendData,
} from '@/lib/csv-parser'
import { KPICards } from '@/components/kpi-cards'
import { RevenueChart } from '@/components/revenue-chart'
import { ChannelChart } from '@/components/channel-chart'
import { StatusChart } from '@/components/status-chart'
import { OrdersTable } from '@/components/orders-table'
import { DashboardFilters } from '@/components/dashboard-filters'

export default function Dashboard() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedChannel, setSelectedChannel] = useState('')
  const [selectedMonth, setSelectedMonth] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [sortKey, setSortKey] = useState<string>('create_time')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [selectedDateColumn, setSelectedDateColumn] =
    useState<string>('create_time')
  const [selectedDate, setSelectedDate] = useState<string>('')

  // Load CSV data
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/orders.csv')
        const csvText = await response.text()
        const parsedOrders = await parseCSV(csvText)
        setOrders(parsedOrders)
        setIsLoading(false)
      } catch (error) {
        console.error('Error loading CSV:', error)
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  // Filter and sort orders
  const filteredAndSortedOrders = useMemo(() => {
    let filtered = [...orders]

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (order) =>
          order.order_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.buyer_user_id.toString().includes(searchQuery),
      )
    }

    // Apply channel filter
    if (selectedChannel) {
      filtered = filtered.filter((order) => order.channel === selectedChannel)
    }

    // Apply month filter
    if (selectedMonth) {
      filtered = filtered.filter((order) => {
        const orderDate = order.create_time?.split(' ')[0] // Format: YYYY-MM-DD
        return orderDate?.startsWith(selectedMonth)
      })
    }

    // Apply status filter
    if (selectedStatus) {
      filtered = filtered.filter(
        (order) => order.order_status === selectedStatus,
      )
    }

    // Apply date filter
    if (selectedDate && selectedDateColumn) {
      filtered = filtered.filter((order) => {
        const dateValue = (order as any)[selectedDateColumn]
        if (!dateValue) return false
        const orderDate = dateValue.split(' ')[0] // Format: YYYY-MM-DD
        return orderDate === selectedDate
      })
    }

    // Sort
    filtered.sort((a, b) => {
      const aValue = (a as any)[sortKey] || ''
      const bValue = (b as any)[sortKey] || ''

      let comparison = 0
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue
      } else {
        comparison = String(aValue).localeCompare(String(bValue))
      }

      return sortDirection === 'asc' ? comparison : -comparison
    })

    return filtered
  }, [
    orders,
    searchQuery,
    selectedChannel,
    selectedMonth,
    selectedStatus,
    selectedDateColumn,
    selectedDate,
    sortKey,
    sortDirection,
  ])

  // Get unique channels, months, and statuses
  const channels = useMemo(() => {
    return [...new Set(orders.map((o) => o.channel))].sort()
  }, [orders])

  const months = useMemo(() => {
    const monthSet = new Set<string>()
    orders.forEach((order) => {
      const date = order.create_time?.split(' ')[0] // Format: YYYY-MM-DD
      if (date) {
        monthSet.add(date.slice(0, 7)) // Extract YYYY-MM
      }
    })
    return Array.from(monthSet).sort().reverse() // Sort descending (newest first)
  }, [orders])

  const statuses = useMemo(() => {
    return [...new Set(orders.map((o) => o.order_status))].sort()
  }, [orders])

  // Calculate KPIs
  const kpis = useMemo(() => {
    return calculateKPIs(filteredAndSortedOrders)
  }, [filteredAndSortedOrders])

  // Get chart data
  const channelData = useMemo(
    () => groupByChannel(filteredAndSortedOrders),
    [filteredAndSortedOrders],
  )
  const statusData = useMemo(
    () => groupByStatus(filteredAndSortedOrders),
    [filteredAndSortedOrders],
  )
  const trendData = useMemo(
    () => getTrendData(filteredAndSortedOrders).slice(-30),
    [filteredAndSortedOrders],
  )

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDirection('desc')
    }
  }

  const handleClearAllFilters = () => {
    setSearchQuery('')
    setSelectedChannel('')
    setSelectedMonth('')
    setSelectedStatus('')
    setSelectedDate('')
  }

  const appliedFilters = []
  if (searchQuery) appliedFilters.push(`Search: "${searchQuery}"`)
  if (selectedChannel) appliedFilters.push(`Channel: ${selectedChannel}`)
  if (selectedMonth) appliedFilters.push(`Month: ${selectedMonth}`)
  if (selectedStatus)
    appliedFilters.push(`Status: ${selectedStatus.replaceAll('_', ' ')}`)
  if (selectedDate) {
    const colLabel =
      {
        create_time: 'Created Date',
        pay_time: 'Payment Date',
        ship_by_date: 'Ship By Date',
        synced_at: 'Synced Date',
      }[selectedDateColumn] || selectedDateColumn
    appliedFilters.push(`${colLabel}: ${selectedDate}`)
  }

  return (
    <main className='min-h-screen bg-background'>
      {/* Header */}
      <header className='border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40'>
        <div className='max-w-7xl mx-auto px-6 py-6'>
          <div className='flex items-center gap-3 mb-2'>
            <div className='w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center'>
              <BarChart3 className='w-6 h-6 text-primary' />
            </div>
            <h1 className='text-3xl font-bold text-foreground'>
              Finance Dashboard
            </h1>
          </div>
          <p className='text-muted-foreground text-sm'>
            Monitor your e-commerce order performance and revenue metrics
          </p>
        </div>
      </header>

      {/* Content */}
      <div className='max-w-7xl mx-auto px-6 py-8 space-y-8'>
        {/* KPI Cards */}
        <div>
          <div className='mb-4 flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <ArrowUpRight className='w-5 h-5 text-primary' />
              <h2 className='text-xl font-semibold text-foreground'>
                Key Performance Indicators
              </h2>
            </div>
            {appliedFilters.length > 0 ? (
              <div className='flex items-center gap-3'>
                <span className='text-sm text-muted-foreground bg-secondary/50 px-3 py-1 rounded-full hidden md:inline-block'>
                  Filters applied: {appliedFilters.join(', ')}
                </span>
                <button
                  onClick={handleClearAllFilters}
                  className='text-sm font-medium text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors'
                >
                  Clear all
                </button>
              </div>
            ) : null}
          </div>
          <KPICards
            totalRevenue={kpis.totalRevenue}
            totalOrders={kpis.totalOrders}
            averageOrderValue={kpis.averageOrderValue}
            totalLeakage={kpis.totalLeakage}
            leakagePercentage={kpis.leakagePercentage}
          />
        </div>

        {/* Charts Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          <RevenueChart data={trendData} isLoading={isLoading} />
          <ChannelChart data={channelData} isLoading={isLoading} />
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          <StatusChart data={statusData} isLoading={isLoading} />
          <div className='bg-card border border-border rounded-lg p-4 flex items-center justify-center'>
            <div className='text-center'>
              <p className='text-foreground font-semibold mb-2'>
                Summary Stats
              </p>
              <div className='flex flex-wrap justify-center gap-4 text-sm text-muted-foreground'>
                <p>
                  Total Records:{' '}
                  <span className='font-medium text-foreground'>
                    {orders.length.toLocaleString()}
                  </span>
                </p>
                <p>
                  Filtered:{' '}
                  <span className='font-medium text-foreground'>
                    {filteredAndSortedOrders.length.toLocaleString()}
                  </span>
                </p>
                <p>
                  Channels:{' '}
                  <span className='font-medium text-foreground'>
                    {channels.length}
                  </span>
                </p>
                <p>
                  Statuses:{' '}
                  <span className='font-medium text-foreground'>
                    {statuses.length}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className='pt-4'>
          <h2 className='text-xl font-semibold text-foreground mb-4'>
            Order Management
          </h2>
          <DashboardFilters
            channels={channels}
            selectedChannel={selectedChannel}
            onChannelChange={setSelectedChannel}
            months={months}
            selectedMonth={selectedMonth}
            onMonthChange={setSelectedMonth}
            statuses={statuses}
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onClearSearch={() => setSearchQuery('')}
            onClearAll={handleClearAllFilters}
            hasActiveFilters={appliedFilters.length > 0}
            selectedDateColumn={selectedDateColumn}
            onDateColumnChange={setSelectedDateColumn}
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
          />
        </div>

        {/* Orders Table */}
        <OrdersTable
          orders={filteredAndSortedOrders}
          isLoading={isLoading}
          sortKey={sortKey}
          sortDirection={sortDirection}
          onSort={handleSort}
        />
      </div>
    </main>
  )
}
