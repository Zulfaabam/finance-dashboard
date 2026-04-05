export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('id-ID').format(Math.round(value))
}

export function formatDate(dateString: string): string {
  if (!dateString || dateString === 'null') return '-'
  try {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date)
  } catch {
    return dateString || '-'
  }
}

export function getStatusColor(status: string): string {
  const statusLower = status.toLowerCase()
  if (statusLower.includes('completed') || statusLower.includes('success')) {
    return 'text-green-400'
  }
  if (statusLower.includes('pending') || statusLower.includes('processing')) {
    return 'text-yellow-400'
  }
  if (
    statusLower.includes('cancelled') ||
    statusLower.includes('failed') ||
    statusLower.includes('return')
  ) {
    return 'text-red-400'
  }
  return 'text-slate-400'
}

export function getStatusBg(status: string): string {
  const statusLower = status.toLowerCase()
  if (statusLower.includes('completed') || statusLower.includes('success')) {
    return 'bg-green-900/20'
  }
  if (statusLower.includes('pending') || statusLower.includes('processing')) {
    return 'bg-yellow-900/20'
  }
  if (
    statusLower.includes('cancelled') ||
    statusLower.includes('failed') ||
    statusLower.includes('return')
  ) {
    return 'bg-red-900/20'
  }
  return 'bg-slate-900/20'
}
