import { Link } from 'react-router-dom'
import { Card, CardLabel } from '@/components/ui/card'
import type { Agent } from '@/types'

interface Stage {
  key: 'leadsNew' | 'leadsContacted' | 'leadsBooked' | 'closed'
  label: string
}

const STAGES: Stage[] = [
  { key: 'leadsNew', label: 'New' },
  { key: 'leadsContacted', label: 'Contacted' },
  { key: 'leadsBooked', label: 'Booked' },
  { key: 'closed', label: 'Closed' },
]

function valueFor(agent: Agent, key: Stage['key']): number {
  return key === 'closed' ? agent.mtdSales : agent[key]
}

export function LeadPipeline({ agents }: { agents: Agent[] }) {
  return (
    <Card className="p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg font-semibold text-navy-900">Lead Pipeline</h2>
          <p className="text-xs text-navy-900/50">Where each agent's prospects stand this month</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {STAGES.map((stage) => {
          const rows = [...agents].sort((a, b) => valueFor(b, stage.key) - valueFor(a, stage.key))
          const total = agents.reduce((s, a) => s + valueFor(a, stage.key), 0)
          return (
            <div key={stage.key} className="rounded-2xl border border-navy-900/8 p-4">
              <div className="mb-3 flex items-center justify-between">
                <CardLabel>{stage.label}</CardLabel>
                <span className="rounded-full bg-cream-200 px-2 py-0.5 text-[11px] font-bold text-navy-900/60">{total}</span>
              </div>
              <div className="space-y-2">
                {rows.slice(0, 3).map((agent) => (
                  <Link
                    key={agent.id}
                    to={`/crm/agents/${agent.id}`}
                    className="flex items-center justify-between gap-2 rounded-xl border border-navy-900/6 bg-cream-50 px-3 py-2.5 transition hover:border-gold-400/40"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-[13px] font-semibold text-navy-900">{agent.name}</span>
                      <span className="block truncate text-[11px] text-navy-900/45">{agent.agency}</span>
                    </span>
                    <span className="shrink-0 text-sm font-bold text-gold-600">{valueFor(agent, stage.key)}</span>
                  </Link>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
