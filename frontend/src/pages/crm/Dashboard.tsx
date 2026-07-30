import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowUpRight, Grid3x3, Map as MapIcon, Plus, UserPlus } from 'lucide-react'
import Topbar from '@/components/layout/Topbar'
import { StatCard } from '@/components/crm/StatCard'
import { Card, CardLabel } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { RevenueChart } from '@/components/crm/RevenueChart'
import { InventoryDonut, INVENTORY_COLORS } from '@/components/crm/InventoryDonut'
import { ActivityFeed } from '@/components/crm/ActivityFeed'
import { TopPerformers } from '@/components/crm/TopPerformers'
import { useDataStore } from '@/store/dataStore'
import {
  getActivityFeed,
  getInventoryBreakdown,
  getOverdueAmount,
  getOverdueBuyerCount,
  getRevenueTrend,
  getTotalRevenueCollected,
} from '@/lib/selectors'
import { formatNumber, daysBetween, formatPKRFull, formatRelativeTime } from '@/lib/format'
import { PAYMENT_STATUS_COLOR } from '@/lib/constants'
import { cn } from '@/lib/utils'
import type { PlotStatus } from '@/types'

export default function Dashboard() {
  const navigate = useNavigate()
  const plots = useDataStore((s) => s.plots)
  const buyers = useDataStore((s) => s.buyers)
  const agents = useDataStore((s) => s.agents)
  const payments = useDataStore((s) => s.payments)

  const breakdown = useMemo(() => getInventoryBreakdown(plots), [plots])
  const totalRevenue = useMemo(() => getTotalRevenueCollected(buyers), [buyers])
  const overdueAmount = useMemo(() => getOverdueAmount(buyers), [buyers])
  const overdueCount = useMemo(() => getOverdueBuyerCount(buyers), [buyers])
  const trend = useMemo(() => getRevenueTrend(buyers), [buyers])

  const maxAgingDays = useMemo(() => {
    const now = new Date()
    let max = 0
    for (const b of buyers) {
      for (const i of b.installments) {
        if (i.status === 'overdue') max = Math.max(max, daysBetween(now, new Date(i.dueDate)))
      }
    }
    return max
  }, [buyers])

  const activity = useMemo(() => getActivityFeed(buyers, payments, plots), [buyers, payments, plots])
  const recentTransactions = useMemo(() => payments.slice(0, 6), [payments])

  const momChange = useMemo(() => {
    if (trend.length < 2) return 0
    const last = trend[trend.length - 1].revenue
    const prev = trend[trend.length - 2].revenue
    if (prev === 0) return 0
    return ((last - prev) / prev) * 100
  }, [trend])

  return (
    <div>
      <Topbar
        title="Portfolio Overview"
        subtitle={`Tracking ${formatNumber(plots.length)} plots across 5 blocks`}
        primaryAction={
          <Button onClick={() => navigate('/crm/buyers?new=1')}>
            <Plus className="h-4 w-4" /> New Booking
          </Button>
        }
      />

      <main className="space-y-6 p-6 sm:p-8">
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total Revenue"
            value={
              <>
                PKR <span>{(totalRevenue / 1_000_000).toFixed(0)}</span>
                <span className="ml-1 text-base font-medium text-navy-900/40">M</span>
              </>
            }
            trend={{ label: `${momChange >= 0 ? '+' : ''}${momChange.toFixed(1)}% vs last month`, direction: momChange >= 0 ? 'up' : 'down' }}
          />
          <StatCard
            label="Plots Sold"
            value={
              <>
                {formatNumber(breakdown.Sold)} <span className="text-base font-medium text-navy-900/40">/ {formatNumber(plots.length)}</span>
              </>
            }
            extra={
              <div className="mt-3">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-cream-200">
                  <div
                    className="h-full rounded-full bg-gold-500"
                    style={{ width: `${(breakdown.Sold / plots.length) * 100}%` }}
                  />
                </div>
                <p className="mt-1.5 text-xs font-semibold text-sage-600">
                  {((breakdown.Sold / plots.length) * 100).toFixed(0)}% of inventory
                </p>
              </div>
            }
          />
          <StatCard
            label="Overdue Amount"
            value={<>PKR <span className="text-rose-500">{(overdueAmount / 1_000_000).toFixed(1)}</span><span className="ml-1 text-base font-medium text-navy-900/40">M</span></>}
            extra={
              <p className="mt-1.5 flex items-center gap-1 text-xs font-semibold text-rose-500">
                {overdueCount} customers &middot; {maxAgingDays > 0 ? `${maxAgingDays}d+ aging` : 'no aging'}
              </p>
            }
          />
          <StatCard
            label="Active Buyers"
            value={formatNumber(buyers.length)}
            trend={{ label: `${agents.length} agents deployed`, direction: 'up' }}
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
          <Card className="p-6">
            <div className="mb-1 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-navy-900">Revenue Performance</h2>
              <div className="flex items-center gap-4 text-xs font-semibold text-navy-900/50">
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-gold-500" /> Revenue</span>
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-navy-900" /> Target</span>
              </div>
            </div>
            <p className="mb-2 text-xs text-navy-900/45">12-month collection trend vs target &middot; PKR millions</p>
            <RevenueChart data={trend} />
          </Card>

          <Card className="p-6">
            <h2 className="mb-6 font-display text-lg font-semibold text-navy-900">Inventory Status</h2>
            <InventoryDonut breakdown={breakdown} total={plots.length} />
            <div className="mt-6 space-y-3">
              {(Object.keys(breakdown) as PlotStatus[]).map((status) => (
                <div key={status} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 font-medium text-navy-900/70">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: INVENTORY_COLORS[status] }} />
                    {status}
                  </span>
                  <span className="font-semibold text-navy-900">
                    {formatNumber(breakdown[status])}{' '}
                    <span className="font-normal text-navy-900/40">{((breakdown[status] / plots.length) * 100).toFixed(1)}%</span>
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
          <Card className="p-6">
            <div className="mb-1 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-navy-900">Recent Transactions</h2>
              <Link to="/crm/payments" className="flex items-center gap-1 text-xs font-semibold text-gold-600 hover:text-gold-700">
                View all <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <p className="mb-4 text-xs text-navy-900/45">Live feed from all payment channels</p>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-navy-900/8 text-left text-[11px] font-bold uppercase tracking-wider text-navy-900/35">
                    <th className="py-2.5 pr-4">Buyer</th>
                    <th className="py-2.5 pr-4">Plot</th>
                    <th className="py-2.5 pr-4">Amount</th>
                    <th className="py-2.5 pr-4">Method</th>
                    <th className="py-2.5 pr-4">Status</th>
                    <th className="py-2.5">When</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map((p) => {
                    const buyer = buyers.find((b) => b.id === p.buyerId)
                    const plot = plots.find((pl) => pl.id === p.plotId)
                    const statusColor = PAYMENT_STATUS_COLOR[p.status]
                    return (
                      <tr key={p.id} className="border-b border-navy-900/5 last:border-0">
                        <td className="py-3 pr-4">
                          <p className="font-semibold text-navy-900">{buyer?.name ?? '—'}</p>
                          <p className="text-xs text-navy-900/40">{buyer?.id}</p>
                        </td>
                        <td className="py-3 pr-4">
                          <p className="text-navy-900/70">{plot ? `Block ${plot.block} · ${String(plot.plotNo).padStart(3, '0')}` : '—'}</p>
                          <p className="text-xs text-navy-900/40">{plot?.type} &middot; {plot?.sizeSqYd} sq yd</p>
                        </td>
                        <td className="py-3 pr-4 font-semibold text-navy-900">{formatPKRFull(p.amount)}</td>
                        <td className="py-3 pr-4 text-navy-900/60">{p.method}</td>
                        <td className="py-3 pr-4">
                          <Badge className={cn(statusColor.bg, statusColor.text)}>{p.status}</Badge>
                        </td>
                        <td className="py-3 text-navy-900/45">{formatRelativeTime(p.timestamp)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              {recentTransactions.length === 0 && <p className="py-8 text-center text-sm text-navy-900/40">No transactions yet.</p>}
            </div>
          </Card>

          <div className="space-y-6">
            <ActivityFeed items={activity} />
            <TopPerformers agents={agents} />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          <button
            onClick={() => navigate('/crm/site-map')}
            className="flex items-center gap-4 rounded-2xl border border-navy-900/8 bg-white p-5 text-left transition hover:-translate-y-0.5 hover:border-gold-400/40 hover:shadow-lg"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy-900">
              <MapIcon className="h-5 w-5 text-gold-400" />
            </span>
            <span className="min-w-0 flex-1">
              <CardLabel>Open Site Map</CardLabel>
              <span className="mt-0.5 block text-sm text-navy-900/50">Visualize plots by status</span>
            </span>
            <ArrowUpRight className="h-4 w-4 shrink-0 text-navy-900/30" />
          </button>

          <button
            onClick={() => navigate('/crm/buyers?new=1')}
            className="flex items-center gap-4 rounded-2xl border border-navy-900/8 bg-white p-5 text-left transition hover:-translate-y-0.5 hover:border-gold-400/40 hover:shadow-lg"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy-900">
              <UserPlus className="h-5 w-5 text-gold-400" />
            </span>
            <span className="min-w-0 flex-1">
              <CardLabel>Register Buyer</CardLabel>
              <span className="mt-0.5 block text-sm text-navy-900/50">Start a new applicant record</span>
            </span>
            <ArrowUpRight className="h-4 w-4 shrink-0 text-navy-900/30" />
          </button>

          <button
            onClick={() => navigate('/crm/inventory')}
            className="flex items-center gap-4 rounded-2xl border border-navy-900/8 bg-white p-5 text-left transition hover:-translate-y-0.5 hover:border-gold-400/40 hover:shadow-lg"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy-900">
              <Grid3x3 className="h-5 w-5 text-gold-400" />
            </span>
            <span className="min-w-0 flex-1">
              <CardLabel>Plot Inventory</CardLabel>
              <span className="mt-0.5 block text-sm text-navy-900/50">Filter, edit, bulk update</span>
            </span>
            <ArrowUpRight className="h-4 w-4 shrink-0 text-navy-900/30" />
          </button>
        </div>
      </main>
    </div>
  )
}
