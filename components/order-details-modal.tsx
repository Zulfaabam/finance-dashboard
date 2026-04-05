'use client'

import { X, Copy } from 'lucide-react'
import { Order } from '@/lib/csv-parser'
import { formatCurrency, formatDate } from '@/lib/format'
import { toast } from 'sonner'

interface OrderDetailsModalProps {
  order: Order | null
  isOpen: boolean
  onClose: () => void
}

export function OrderDetailsModal({
  order,
  isOpen,
  onClose,
}: OrderDetailsModalProps) {
  if (!isOpen || !order) return null

  const handleCopyAll = () => {
    const text = Object.entries(order)
      .map(([key, value]) => `${key.replaceAll('_', ' ')}: ${value}`)
      .join(',\n')
    navigator.clipboard.writeText(text)
    toast.success('All order details copied to clipboard')
  }

  const details = [
    { label: 'Order ID', value: order.order_id, copyable: true },
    { label: 'Channel', value: order.channel },
    { label: 'Buyer User ID', value: order.buyer_user_id, copyable: true },
    { label: 'Order Status', value: order.order_status.replaceAll('_', ' ') },
    { label: 'Created At', value: formatDate(order.create_time) },
    { label: 'Payment Time', value: formatDate(order.pay_time) },
    { label: 'Ship By Date', value: formatDate(order.ship_by_date) },
    { label: 'Synced At', value: formatDate(order.synced_at) },
    { label: 'Gross Amount', value: formatCurrency(order.gross_amount) },
    { label: 'Net Amount', value: formatCurrency(order.net_amount) },
    { label: 'Discount Amount', value: formatCurrency(order.discount_amount) },
    {
      label: 'Shipping Fee Amount',
      value: formatCurrency(order.shipping_fee_amount),
    },
    { label: 'Buyer Count', value: order.buyer_count?.toString() || '0' },
    { label: 'Item Count', value: order.item_count?.toString() || '0' },
  ]

  return (
    <>
      {/* Overlay */}
      <div className='fixed inset-0 bg-black/50 z-40' onClick={onClose} />

      {/* Modal */}
      <div className='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[90vh] bg-card border border-border rounded-lg shadow-lg z-50 overflow-y-auto'>
        {/* Header */}
        <div className='sticky top-0 flex items-center justify-between p-6 border-b border-border bg-card'>
          <div className='flex items-center gap-2'>
            <h2 className='text-2xl font-bold text-foreground'>
              Order Details
            </h2>
            <button
              onClick={handleCopyAll}
              className='inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-lg transition-colors'
              title='Copy all data'
            >
              <Copy className='w-4 h-4' />
              Copy All
            </button>
          </div>
          <button
            onClick={onClose}
            className='p-2 rounded-lg hover:bg-secondary transition-colors text-foreground'
            aria-label='Close modal'
          >
            <X className='w-6 h-6' />
          </button>
        </div>

        {/* Content */}
        <div className='p-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {details.map((detail) => (
              <div key={detail.label} className='flex flex-col'>
                <span className='text-sm font-medium text-muted-foreground mb-1'>
                  {detail.label}
                </span>
                <div className='flex items-center gap-2'>
                  <span className='text-base text-foreground font-semibold'>
                    {detail.value}
                  </span>
                  {detail.copyable && (
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(String(detail.value))
                        toast.success(`Copied ${detail.label} to clipboard`)
                      }}
                      className='p-1 text-muted-foreground hover:text-foreground hover:bg-secondary rounded transition-colors'
                      title={`Copy ${detail.label}`}
                    >
                      <Copy className='w-3.5 h-3.5' />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className='sticky bottom-0 flex justify-end gap-3 p-6 border-t border-border bg-card'>
          <button
            onClick={onClose}
            className='px-6 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors'
          >
            Close
          </button>
        </div>
      </div>
    </>
  )
}
