import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Search as SearchIcon, UserPlus } from 'lucide-react'
import Topbar from '@/components/layout/Topbar'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { StatCard } from '@/components/crm/StatCard'
import { RegisterBuyerDialog } from '@/components/crm/RegisterBuyerDialog'
import { BulkMessageDialog } from '@/components/crm/BulkMessageDialog'
import { useDataStore } from '@/store/dataStore'
import { BUYER_STATUS_COLOR } from '@/lib/constants'
import { formatPKRFull, formatDate, formatNumber } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { BuyerStatus } from '@/types'

const TABS: (BuyerStatus | 'All')[] = ['All', 'Current', 'Overdue', 'Completed']
const PAGE_SIZE = 20

export default function Buyers() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const buyers = useDataStore((s) => s.buyers)
  const plots = useDataStore((s) => s.plots)
  const agents = useDataStore((s) => s.agents)

  const [tab, setTab] = useState<BuyerStatus | 'All'>('All')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)

  const [dialogOpen, setDialogOpen] = useState(searchParams.get('new') === '1')
  const initialPlotId = searchParams.get('plotId') ?? undefined

  function closeDialog(open: boolean) {
    setDialogOpen(open)
    if (!open && searchParams.get('new')) {
      searchParams.delete('new')
      searchParams.delete('plotId')
      setSearchParams(searchParams, { replace: true })
    }
  }

  const counts = useMemo(
    () => ({
      All: buyers.length,
      Current: buyers.filter((b) => b.status === 'Current').length,
      Overdue: buyers.filter((b) => b.status === 'Overdue').length,
      Completed: buyers.filter((b) => b.status === 'Completed').length,
    }),
    [buyers]
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return buyers.filter((b) => {
      if (tab !== 'All' && b.status !== tab) return false
      if (q && !(b.name.toLowerCase().includes(q) || b.cnic.includes(q) || b.id.toLowerCase().includes(q))) return false
      return true
    })
  }, [buyers, tab, query])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function updateTab(next: BuyerStatus | 'All') {
    setTab(next)
    setPage(1)
  }

  function updateQuery(next: string) {
    setQuery(next)
    setPage(1)
  }

  return (
    <div>
      <Topbar
        title="Buyers & CRM"
        subtitle={`${formatNumber(buyers.length)} customer profiles`}
        primaryAction={
          <div className="flex items-center gap-3">
            <BulkMessageDialog recipientCount={filtered.length} />
            <Button onClick={() => setDialogOpen(true)}>
              <UserPlus className="h-4 w-4" /> Register buyer
            </Button>
          </div>
        }
      />

      <main className="space-y-6 p-6 sm:p-8">
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="All buyers" value={formatNumber(counts.All)} />
          <StatCard label="Current" value={<span className="text-sage-600">{formatNumber(counts.Current)}</span>} />
          <StatCard label="Overdue" value={<span className="text-rose-500">{formatNumber(counts.Overdue)}</span>} />
          <StatCard label="Completed" value={formatNumber(counts.Completed)} />
        </div>

        <Card className="p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative flex-1 lg:max-w-xs">
              <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-900/35" />
              <Input placeholder="Name, CNIC, buyer ID..." className="pl-10" value={query} onChange={(e) => updateQuery(e.target.value)} />
            </div>
            <div className="inline-flex flex-wrap items-center gap-1 rounded-full bg-cream-200/70 p-1">
              {TABS.map((t) => (
                <button
                  key={t}
                  onClick={() => updateTab(t)}
                  className={cn(
                    'rounded-full px-4 py-2 text-[11px] font-bold uppercase tracking-wide text-navy-900/50 transition-colors',
                    tab === t && 'bg-navy-900 text-cream-50'
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-navy-900/8 text-left text-[11px] font-bold uppercase tracking-wider text-navy-900/35">
                  <th className="py-3 pr-4">Buyer</th>
                  <th className="py-3 pr-4">Plot</th>
                  <th className="py-3 pr-4">Progress</th>
                  <th className="py-3 pr-4">Next due</th>
                  <th className="py-3 pr-4">Agent</th>
                  <th className="py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((buyer) => {
                  const plot = plots.find((p) => p.id === buyer.plotId)
                  const agent = agents.find((a) => a.id === buyer.agentId)
                  const paid = buyer.installments.filter((i) => i.status === 'paid')
                  const paidAmount = paid.reduce((s, i) => s + i.amount, 0)
                  const nextDue = buyer.installments.find((i) => i.status !== 'paid')
                  const statusColor = BUYER_STATUS_COLOR[buyer.status]
                  return (
                    <tr
                      key={buyer.id}
                      onClick={() => navigate(`/crm/buyers/${buyer.id}`)}
                      className="cursor-pointer border-b border-navy-900/5 transition hover:bg-cream-100/60 last:border-0"
                    >
                      <td className="py-3.5 pr-4">
                        <p className="font-semibold text-navy-900">{buyer.name}</p>
                        <p className="text-xs text-navy-900/45">
                          {buyer.id} &middot; {buyer.cnic}
                        </p>
                      </td>
                      <td className="py-3.5 pr-4">
                        <p className="font-medium text-navy-900">{plot ? `Block ${plot.block} · ${String(plot.plotNo).padStart(3, '0')}` : '—'}</p>
                        <p className="text-xs text-navy-900/45">{plot?.type} &middot; {plot?.sizeSqYd} sq yd</p>
                      </td>
                      <td className="py-3.5 pr-4 min-w-[160px]">
                        <p className="font-semibold text-navy-900">
                          {formatPKRFull(paidAmount)} <span className="font-normal text-navy-900/40">/ {formatPKRFull(buyer.totalAmount)}</span>
                        </p>
                        <div className="mt-1.5 h-1.5 w-full max-w-[140px] overflow-hidden rounded-full bg-cream-200">
                          <div className="h-full rounded-full bg-gold-500" style={{ width: `${(paidAmount / buyer.totalAmount) * 100}%` }} />
                        </div>
                        <p className="mt-1 text-[11px] text-navy-900/40">
                          {paid.length}/{buyer.installments.length} installments
                        </p>
                      </td>
                      <td className="py-3.5 pr-4 text-navy-900/70">{nextDue ? formatDate(nextDue.dueDate) : '—'}</td>
                      <td className="py-3.5 pr-4">
                        <p className="font-medium text-navy-900">{agent?.name ?? '—'}</p>
                        <p className="text-xs text-navy-900/45">{agent?.agency}</p>
                      </td>
                      <td className="py-3.5">
                        <Badge className={cn(statusColor.bg, statusColor.text)}>{buyer.status}</Badge>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {filtered.length === 0 && <p className="py-12 text-center text-sm text-navy-900/45">No buyers match the current filters.</p>}
          </div>

          {pageCount > 1 && (
            <div className="mt-4 flex items-center justify-center gap-2 border-t border-navy-900/8 pt-4">
              <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
                Previous
              </Button>
              <span className="text-xs font-semibold text-navy-900/50">
                Page {page} of {pageCount}
              </span>
              <Button variant="outline" size="sm" disabled={page === pageCount} onClick={() => setPage((p) => p + 1)}>
                Next
              </Button>
            </div>
          )}
        </Card>
      </main>

      <RegisterBuyerDialog open={dialogOpen} onOpenChange={closeDialog} initialPlotId={initialPlotId} />
    </div>
  )
}
