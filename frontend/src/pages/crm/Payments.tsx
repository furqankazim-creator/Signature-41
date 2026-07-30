import { useMemo, useState } from 'react'
import { Download, Search as SearchIcon } from 'lucide-react'
import Topbar from '@/components/layout/Topbar'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { StatCard } from '@/components/crm/StatCard'
import { useDataStore } from '@/store/dataStore'
import { PAYMENT_STATUS_COLOR } from '@/lib/constants'
import { formatPKR, formatPKRFull, formatRelativeTime } from '@/lib/format'
import { downloadCsv, downloadTextFile } from '@/lib/csv'
import { getPaymentsAggregates } from '@/lib/selectors'
import { useToast } from '@/components/ui/toast'
import { cn } from '@/lib/utils'
import type { PaymentStatus } from '@/types'

const TABS: (PaymentStatus | 'All')[] = ['All', 'Received', 'Pending', 'Overdue']

export default function Payments() {
  const payments = useDataStore((s) => s.payments)
  const buyers = useDataStore((s) => s.buyers)
  const plots = useDataStore((s) => s.plots)
  const { toast } = useToast()

  const [tab, setTab] = useState<PaymentStatus | 'All'>('All')
  const [query, setQuery] = useState('')

  const aggregates = useMemo(() => getPaymentsAggregates(payments), [payments])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return payments.filter((p) => {
      if (tab !== 'All' && p.status !== tab) return false
      if (q) {
        const buyer = buyers.find((b) => b.id === p.buyerId)
        const haystack = `${p.receiptNo} ${p.id} ${buyer?.name ?? ''}`.toLowerCase()
        if (!haystack.includes(q)) return false
      }
      return true
    })
  }, [payments, tab, query, buyers])

  function handleExportLedger() {
    downloadCsv(
      `signature41-ledger-${Date.now()}.csv`,
      payments.map((p) => {
        const buyer = buyers.find((b) => b.id === p.buyerId)
        return {
          receipt: p.receiptNo,
          paymentId: p.id,
          buyer: buyer?.name ?? '',
          plot: p.plotId,
          amount: p.amount,
          method: p.method,
          status: p.status,
          timestamp: p.timestamp,
        }
      })
    )
    toast({ variant: 'info', title: 'Ledger exported', description: `${payments.length} transactions exported to CSV.` })
  }

  function handleDownloadReceipt(paymentId: string) {
    const payment = payments.find((p) => p.id === paymentId)
    if (!payment) return
    const buyer = buyers.find((b) => b.id === payment.buyerId)
    const plot = plots.find((p) => p.id === payment.plotId)
    const receipt = [
      'SIGNATURE 41 ESTATE MANAGEMENT',
      '--------------------------------',
      `Receipt: ${payment.receiptNo}`,
      `Payment ID: ${payment.id}`,
      `Date: ${new Date(payment.timestamp).toLocaleString()}`,
      '',
      `Buyer: ${buyer?.name ?? '—'} (${buyer?.id ?? '—'})`,
      `Plot: ${plot?.id ?? payment.plotId}${plot ? ` · Block ${plot.block} · ${String(plot.plotNo).padStart(3, '0')}` : ''}`,
      '',
      `Amount: ${formatPKRFull(payment.amount)}`,
      `Method: ${payment.method}`,
      `Status: ${payment.status}`,
    ].join('\n')
    downloadTextFile(`${payment.receiptNo}.txt`, receipt)
  }

  return (
    <div>
      <Topbar
        title="Payments"
        subtitle={`${payments.length} recent transactions`}
        primaryAction={
          <Button onClick={handleExportLedger}>
            <Download className="h-4 w-4" /> Export ledger
          </Button>
        }
      />

      <main className="space-y-6 p-6 sm:p-8">
        <div className="grid gap-5 sm:grid-cols-3">
          <StatCard label="Received" value={<span className="text-sage-600">{formatPKR(aggregates.received)}</span>} />
          <StatCard label="Pending" value={<span className="text-gold-700">{formatPKR(aggregates.pending)}</span>} />
          <StatCard label="Overdue" value={<span className="text-rose-500">{formatPKR(aggregates.overdue)}</span>} />
        </div>

        <Card className="p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative flex-1 lg:max-w-xs">
              <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-900/35" />
              <Input placeholder="Receipt no, buyer name, payment ID..." className="pl-10" value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
            <div className="inline-flex flex-wrap items-center gap-1 rounded-full bg-cream-200/70 p-1">
              {TABS.map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
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
                  <th className="py-3 pr-4">Receipt</th>
                  <th className="py-3 pr-4">Buyer &amp; plot</th>
                  <th className="py-3 pr-4">Amount</th>
                  <th className="py-3 pr-4">Method</th>
                  <th className="py-3 pr-4">Status</th>
                  <th className="py-3 pr-4">When</th>
                  <th className="py-3" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => {
                  const buyer = buyers.find((b) => b.id === p.buyerId)
                  const statusColor = PAYMENT_STATUS_COLOR[p.status]
                  return (
                    <tr key={p.id} className="border-b border-navy-900/5 last:border-0">
                      <td className="py-3.5 pr-4">
                        <p className="font-semibold text-navy-900">{p.receiptNo}</p>
                        <p className="text-xs text-navy-900/45">{p.id}</p>
                      </td>
                      <td className="py-3.5 pr-4">
                        <p className="font-medium text-navy-900">{buyer?.name ?? '—'}</p>
                        <p className="text-xs text-navy-900/45">Block {plots.find((pl) => pl.id === p.plotId)?.block ?? '—'}</p>
                      </td>
                      <td className="py-3.5 pr-4 font-semibold text-navy-900">{formatPKRFull(p.amount)}</td>
                      <td className="py-3.5 pr-4 text-navy-900/70">{p.method}</td>
                      <td className="py-3.5 pr-4">
                        <Badge className={cn(statusColor.bg, statusColor.text)}>{p.status}</Badge>
                      </td>
                      <td className="py-3.5 pr-4 text-navy-900/50">{formatRelativeTime(p.timestamp)}</td>
                      <td className="py-3.5">
                        <button
                          onClick={() => handleDownloadReceipt(p.id)}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-navy-900/10 text-navy-900/50 transition hover:bg-cream-200/60 hover:text-navy-900"
                          title="Download receipt"
                        >
                          <Download className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {filtered.length === 0 && <p className="py-12 text-center text-sm text-navy-900/45">No transactions match the current filters.</p>}
          </div>
        </Card>
      </main>
    </div>
  )
}
