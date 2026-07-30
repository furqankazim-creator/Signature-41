import { Link, useNavigate } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { Card, CardLabel } from '@/components/ui/card'
import { formatPKR } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { Agent } from '@/types'

const RANK_STYLE = ['bg-gold-500 text-navy-950', 'bg-navy-900 text-cream-50', 'bg-navy-900/70 text-cream-50', 'bg-cream-200 text-navy-900/60']

export function TopPerformers({ agents }: { agents: Agent[] }) {
  const navigate = useNavigate()
  const ranked = [...agents].sort((a, b) => b.mtdRevenue - a.mtdRevenue).slice(0, 4)

  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <CardLabel>Top performers</CardLabel>
        <span className="text-[10px] font-bold uppercase tracking-wider text-navy-900/35">MTD</span>
      </div>
      <div className="space-y-1">
        {ranked.map((agent, i) => (
          <button
            key={agent.id}
            onClick={() => navigate(`/crm/agents/${agent.id}`)}
            className="flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-left transition hover:bg-cream-100"
          >
            <span className={cn('flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold', RANK_STYLE[i])}>
              #{i + 1}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold text-navy-900">{agent.name}</span>
              <span className="block truncate text-xs text-navy-900/45">{agent.agency}</span>
            </span>
            <span className="text-right">
              <span className="block text-sm font-semibold text-navy-900">{formatPKR(agent.mtdRevenue)}</span>
              <span className="block text-[11px] text-navy-900/40">{agent.mtdSales} sales</span>
            </span>
          </button>
        ))}
      </div>
      <Link
        to="/crm/agents"
        className="mt-4 flex items-center justify-center gap-1.5 rounded-xl border border-navy-900/8 py-2.5 text-xs font-semibold text-navy-900 transition hover:bg-cream-100"
      >
        Full leaderboard <ArrowUpRight className="h-3.5 w-3.5" />
      </Link>
    </Card>
  )
}
