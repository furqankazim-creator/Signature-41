import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import Topbar from '@/components/layout/Topbar'
import { Card } from '@/components/ui/card'
import { StatCard } from '@/components/crm/StatCard'
import { LeadPipeline } from '@/components/crm/LeadPipeline'
import { useDataStore } from '@/store/dataStore'
import { formatNumber, formatPKR } from '@/lib/format'
import { cn } from '@/lib/utils'

const RANK_STYLE = [
  'bg-gold-500 text-navy-950',
  'bg-navy-900 text-cream-50',
  'bg-navy-900/70 text-cream-50',
]

export default function Agents() {
  const navigate = useNavigate()
  const agents = useDataStore((s) => s.agents)

  const ranked = useMemo(() => [...agents].sort((a, b) => b.mtdRevenue - a.mtdRevenue), [agents])
  const totals = useMemo(
    () => ({
      sales: agents.reduce((s, a) => s + a.mtdSales, 0),
      revenue: agents.reduce((s, a) => s + a.mtdRevenue, 0),
      commission: agents.reduce((s, a) => s + a.commission, 0),
    }),
    [agents]
  )
  const monthLabel = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase()
  const topRevenue = ranked[0]?.mtdRevenue ?? 1

  return (
    <div>
      <Topbar title="Estate Agents" subtitle={`${agents.length} active agents · MTD leaderboard`} />

      <main className="space-y-6 p-6 sm:p-8">
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Active agents" value={formatNumber(agents.length)} />
          <StatCard label="MTD sales" value={formatNumber(totals.sales)} />
          <StatCard label="MTD revenue" value={formatPKR(totals.revenue)} />
          <StatCard label="Commission payouts" value={formatPKR(totals.commission)} />
        </div>

        <Card className="p-6">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-lg font-semibold text-navy-900">Monthly Leaderboard</h2>
              <p className="text-xs text-navy-900/50">Ranked by revenue collected in the current month</p>
            </div>
            <span className="rounded-full bg-cream-200 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-navy-900/50">
              {monthLabel}
            </span>
          </div>

          <div className="space-y-3">
            {ranked.map((agent, i) => (
              <button
                key={agent.id}
                onClick={() => navigate(`/crm/agents/${agent.id}`)}
                className={cn(
                  'flex w-full flex-col gap-4 rounded-2xl border p-4 text-left transition sm:flex-row sm:items-center',
                  i === 0 ? 'border-gold-500/30 bg-gold-500/5' : 'border-navy-900/8 hover:border-navy-900/15'
                )}
              >
                <span
                  className={cn(
                    'flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-display text-sm font-bold',
                    RANK_STYLE[i] ?? 'bg-cream-200 text-navy-900/60'
                  )}
                >
                  #{i + 1}
                </span>

                <span className="flex flex-1 items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-navy-900/5 text-sm font-bold text-navy-900">
                    {agent.initials}
                  </span>
                  <span>
                    <span className="block font-semibold text-navy-900">{agent.name}</span>
                    <span className="block text-xs text-navy-900/45">
                      {agent.agency} &middot; {agent.id}
                    </span>
                  </span>
                </span>

                <span className="flex flex-1 items-center gap-6 sm:justify-end">
                  <span className="text-right">
                    <span className="block font-display text-lg font-semibold text-navy-900">{agent.mtdSales}</span>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-navy-900/35">this month</span>
                  </span>
                  <span className="w-32 text-right">
                    <span className="block font-display text-lg font-semibold text-navy-900">{formatPKR(agent.mtdRevenue)}</span>
                    <span className="mt-1 block h-1.5 w-full overflow-hidden rounded-full bg-cream-200">
                      <span className="block h-full rounded-full bg-gold-500" style={{ width: `${(agent.mtdRevenue / topRevenue) * 100}%` }} />
                    </span>
                  </span>
                  <span className="w-24 text-right">
                    <span className="block font-display text-base font-semibold text-sage-600">{formatPKR(agent.commission)}</span>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-navy-900/35">commission</span>
                  </span>
                </span>
              </button>
            ))}
          </div>
        </Card>

        <LeadPipeline agents={agents} />
      </main>
    </div>
  )
}
