import type { Buyer, Payment, Plot, PlotStatus } from '@/types'

export interface ActivityItem {
  id: string
  kind: 'payment' | 'overdue' | 'booking'
  title: string
  detail: string
  timestamp: string
  path: string
}

export function getActivityFeed(buyers: Buyer[], payments: Payment[], plots: Plot[], limit = 6): ActivityItem[] {
  const paymentEvents: ActivityItem[] = payments
    .filter((p) => p.status === 'Received')
    .slice(0, 8)
    .map((p) => {
      const buyer = buyers.find((b) => b.id === p.buyerId)
      return {
        id: `payment-${p.id}`,
        kind: 'payment',
        title: 'Payment received',
        detail: `${buyer?.name ?? 'Buyer'} — ${new Intl.NumberFormat('en-PK').format(p.amount)} PKR`,
        timestamp: p.timestamp,
        path: '/crm/payments',
      }
    })

  const overdueEvents: ActivityItem[] = buyers
    .filter((b) => b.status === 'Overdue')
    .slice(0, 6)
    .map((b) => {
      const overdueInstallment = b.installments.find((i) => i.status === 'overdue')
      const days = overdueInstallment ? Math.floor((Date.now() - new Date(overdueInstallment.dueDate).getTime()) / 86_400_000) : 0
      return {
        id: `overdue-${b.id}`,
        kind: 'overdue',
        title: 'Overdue alert',
        detail: `${b.name} · ${days}d late`,
        timestamp: overdueInstallment?.dueDate ?? b.registeredAt,
        path: `/crm/buyers/${b.id}`,
      }
    })

  const bookingEvents: ActivityItem[] = [...buyers]
    .sort((a, b) => new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime())
    .slice(0, 6)
    .map((b) => {
      const plot = plots.find((p) => p.id === b.plotId)
      return {
        id: `booking-${b.id}`,
        kind: 'booking',
        title: 'New booking',
        detail: plot ? `Block ${plot.block}, Plot ${String(plot.plotNo).padStart(3, '0')} reserved by ${b.name}` : b.name,
        timestamp: b.registeredAt,
        path: `/crm/buyers/${b.id}`,
      }
    })

  return [...paymentEvents, ...overdueEvents, ...bookingEvents]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit)
}

export function getTotalRevenueCollected(buyers: Buyer[]): number {
  return buyers.reduce(
    (sum, b) => sum + b.installments.filter((i) => i.status === 'paid').reduce((s, i) => s + i.amount, 0),
    0
  )
}

export function getOverdueAmount(buyers: Buyer[]): number {
  return buyers.reduce(
    (sum, b) => sum + b.installments.filter((i) => i.status === 'overdue').reduce((s, i) => s + i.amount, 0),
    0
  )
}

export function getOverdueBuyerCount(buyers: Buyer[]): number {
  return buyers.filter((b) => b.status === 'Overdue').length
}

export function getInventoryBreakdown(plots: Plot[]): Record<PlotStatus, number> {
  const breakdown: Record<PlotStatus, number> = { Available: 0, Reserved: 0, Sold: 0, 'On-Hold': 0 }
  for (const p of plots) breakdown[p.status]++
  return breakdown
}

export function getPaymentsAggregates(payments: Payment[]) {
  return payments.reduce(
    (acc, p) => {
      if (p.status === 'Received') acc.received += p.amount
      if (p.status === 'Pending') acc.pending += p.amount
      if (p.status === 'Overdue') acc.overdue += p.amount
      return acc
    },
    { received: 0, pending: 0, overdue: 0 }
  )
}

export interface RevenuePoint {
  month: string
  revenue: number
  target: number
}

export function getRevenueTrend(buyers: Buyer[]): RevenuePoint[] {
  const now = new Date()
  const months: { key: string; label: string; date: Date }[] = []
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    months.push({ key: `${d.getFullYear()}-${d.getMonth()}`, label: d.toLocaleDateString('en-US', { month: 'short' }), date: d })
  }

  const totals = new Map<string, number>(months.map((m) => [m.key, 0]))
  for (const b of buyers) {
    for (const inst of b.installments) {
      if (inst.status !== 'paid' || !inst.paidDate) continue
      const d = new Date(inst.paidDate)
      const key = `${d.getFullYear()}-${d.getMonth()}`
      if (totals.has(key)) totals.set(key, (totals.get(key) ?? 0) + inst.amount)
    }
  }

  const points: RevenuePoint[] = []
  months.forEach((m, i) => {
    const revenue = totals.get(m.key) ?? 0
    const windowStart = Math.max(0, i - 2)
    const windowVals = months.slice(windowStart, i + 1).map((w) => totals.get(w.key) ?? 0)
    const target = windowVals.reduce((s, v) => s + v, 0) / windowVals.length
    points.push({ month: m.label, revenue, target: Math.round(target) })
  })
  return points
}
