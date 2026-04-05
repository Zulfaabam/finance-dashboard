'use client'

import { MouseEvent, useState } from 'react'
import {
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  MoreVertical,
  Copy,
} from 'lucide-react'
import { Order } from '@/lib/csv-parser'
import { formatCurrency, formatDate } from '@/lib/format'
import { paginate } from '@/lib/utils'
import { OrderDetailsModal } from './order-details-modal'

const getStatusStyles = (status: string) => {
  if (!status)
    return 'bg-slate-100 text-slate-800 dark:bg-slate-500/20 dark:text-slate-400'

  const s = status.toLowerCase()
  if (
    s.includes('completed') ||
    s.includes('delivered') ||
    s.includes('success')
  ) {
    return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400'
  }
  if (s.includes('cancel') || s.includes('fail') || s.includes('return')) {
    return 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-400'
  }
  if (s.includes('ship') || s.includes('process')) {
    return 'bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-400'
  }
  if (s.includes('pending') || s.includes('unpaid') || s.includes('wait')) {
    return 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-400'
  }
  return 'bg-slate-100 text-slate-800 dark:bg-slate-500/20 dark:text-slate-400'
}

interface OrdersTableProps {
  orders: Order[]
  isLoading: boolean
  sortKey: string
  sortDirection: 'asc' | 'desc'
  onSort: (key: string) => void
}

export function OrdersTable({
  orders,
  isLoading,
  sortKey,
  sortDirection,
  onSort,
}: OrdersTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  const pagination = paginate(orders, currentPage, pageSize)

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order)
    setIsModalOpen(true)
  }

  const handleCopy = (e: MouseEvent<HTMLButtonElement>, text: string) => {
    e.stopPropagation()
    navigator.clipboard.writeText(text)
    setOpenMenuId(null)
  }

  const toggleMenu = (e: MouseEvent<HTMLButtonElement>, order_id: string) => {
    e.stopPropagation()
    setOpenMenuId(openMenuId === order_id ? null : order_id)
  }

  if (isLoading) {
    return (
      <div className='bg-card border border-border rounded-lg p-6 h-96 flex items-center justify-center'>
        <div className='text-muted-foreground'>Loading orders...</div>
      </div>
    )
  }

  const getSortIcon = (key: string) => {
    if (sortKey !== key) return null
    return sortDirection === 'asc' ? (
      <ChevronUp className='w-4 h-4 inline ml-1' />
    ) : (
      <ChevronDown className='w-4 h-4 inline ml-1' />
    )
  }

  return (
    <div className='bg-card border border-border rounded-lg overflow-hidden'>
      <div className='overflow-x-auto'>
        <table className='w-full text-sm'>
          <thead>
            <tr className='border-b border-border bg-secondary/50'>
              <th className='px-6 py-4 text-left font-semibold text-foreground w-12'>
                #
              </th>
              <th
                className='px-6 py-4 text-left font-semibold text-foreground cursor-pointer hover:bg-secondary/70'
                onClick={() => onSort('order_id')}
              >
                Order ID {getSortIcon('order_id')}
              </th>
              <th
                className='px-6 py-4 text-left font-semibold text-foreground cursor-pointer hover:bg-secondary/70'
                onClick={() => onSort('channel')}
              >
                Channel {getSortIcon('channel')}
              </th>
              <th
                className='px-6 py-4 text-left font-semibold text-foreground cursor-pointer hover:bg-secondary/70'
                onClick={() => onSort('buyer_user_id')}
              >
                Buyer ID {getSortIcon('buyer_user_id')}
              </th>
              <th
                className='px-6 py-4 text-left font-semibold text-foreground cursor-pointer hover:bg-secondary/70'
                onClick={() => onSort('create_time')}
              >
                Date {getSortIcon('create_time')}
              </th>
              <th
                className='px-6 py-4 text-left font-semibold text-foreground cursor-pointer hover:bg-secondary/70'
                onClick={() => onSort('net_amount')}
              >
                Net Revenue {getSortIcon('net_amount')}
              </th>
              <th
                className='px-6 py-4 text-left font-semibold text-foreground cursor-pointer hover:bg-secondary/70'
                onClick={() => onSort('order_status')}
              >
                Status {getSortIcon('order_status')}
              </th>
              <th className='px-6 py-4 text-left font-semibold text-foreground w-20'>
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {pagination.total === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className='px-6 py-8 text-center text-muted-foreground'
                >
                  No orders found
                </td>
              </tr>
            ) : (
              pagination.items.map((order, index) => (
                <tr
                  key={order.order_id}
                  className='border-b border-border hover:bg-secondary/30 transition-colors'
                >
                  <td className='px-6 py-4 text-muted-foreground font-medium text-center'>
                    {(pagination.page - 1) * pagination.pageSize + index + 1}
                  </td>
                  <td className='px-6 py-4 text-foreground font-medium'>
                    {order.order_id}
                  </td>
                  <td className='px-6 py-4 text-foreground'>{order.channel}</td>
                  <td className='px-6 py-4 text-muted-foreground text-xs'>
                    {order.buyer_user_id}
                  </td>
                  <td className='px-6 py-4 text-muted-foreground'>
                    {formatDate(order.create_time)}
                  </td>
                  <td className='px-6 py-4 text-foreground font-semibold'>
                    {formatCurrency(order.net_amount)}
                  </td>
                  <td className='px-6 py-4'>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyles(order.order_status)}`}
                    >
                      {order.order_status.replaceAll('_', ' ')}
                    </span>
                  </td>
                  <td className='px-6 py-4 text-center'>
                    <div className='flex items-center justify-center gap-2'>
                      <button
                        onClick={() => handleViewDetails(order)}
                        className='inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium'
                        title='View order details'
                      >
                        <Eye className='w-4 h-4' />
                        View
                      </button>
                      <div className='relative'>
                        <button
                          onClick={(e) => toggleMenu(e, order.order_id)}
                          className='p-1.5 rounded-lg hover:bg-secondary/80 text-muted-foreground transition-colors'
                          title='More actions'
                        >
                          <MoreVertical className='w-4 h-4' />
                        </button>
                        {openMenuId === order.order_id && (
                          <div className='absolute right-0 top-full mt-1 w-48 bg-card border border-border rounded-lg shadow-lg z-50 py-1 overflow-hidden flex flex-col text-left'>
                            <button
                              onClick={(e) => handleCopy(e, order.order_id)}
                              className='w-full px-4 py-2 text-sm text-foreground hover:bg-secondary/50 text-left inline-flex items-center gap-2 transition-colors'
                            >
                              <Copy className='w-3 h-3 text-muted-foreground' />{' '}
                              Copy Order ID
                            </button>
                            <button
                              onClick={(e) =>
                                handleCopy(e, String(order.buyer_user_id))
                              }
                              className='w-full px-4 py-2 text-sm text-foreground hover:bg-secondary/50 text-left inline-flex items-center gap-2 transition-colors'
                            >
                              <Copy className='w-3 h-3 text-muted-foreground' />{' '}
                              Copy Buyer ID
                            </button>
                            <button
                              onClick={(e) =>
                                handleCopy(e, JSON.stringify(order, null, 2))
                              }
                              className='w-full px-4 py-2 text-sm text-foreground hover:bg-secondary/50 text-left inline-flex items-center gap-2 transition-colors'
                            >
                              <Copy className='w-3 h-3 text-muted-foreground' />{' '}
                              Copy All Data
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination.total > 0 && (
        <div className='flex items-center justify-between px-6 py-4 border-t border-border bg-secondary/30'>
          <div className='flex items-center gap-2'>
            <span className='text-sm text-muted-foreground'>Page size:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value))
                setCurrentPage(1)
              }}
              className='px-3 py-1 text-sm bg-input border border-border rounded text-foreground hover:bg-secondary cursor-pointer'
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>

          <div className='text-sm text-muted-foreground'>
            Showing {(pagination.page - 1) * pagination.pageSize + 1} to{' '}
            {Math.min(pagination.page * pagination.pageSize, pagination.total)}{' '}
            of {pagination.total} orders
          </div>

          <div className='flex items-center gap-2'>
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className='p-2 rounded border border-border text-foreground hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
              aria-label='Previous page'
            >
              <ChevronLeft className='w-4 h-4' />
            </button>

            <div className='px-3 py-1 text-sm bg-input rounded'>
              Page {pagination.page} of {pagination.totalPages}
            </div>

            <button
              onClick={() =>
                setCurrentPage(Math.min(pagination.totalPages, currentPage + 1))
              }
              disabled={currentPage === pagination.totalPages}
              className='p-2 rounded border border-border text-foreground hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
              aria-label='Next page'
            >
              <ChevronRight className='w-4 h-4' />
            </button>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      <OrderDetailsModal
        order={selectedOrder}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}
