import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import Topbar from '@/components/layout/Topbar'
import { Card, CardLabel } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useDataStore } from '@/store/dataStore'
import { BUYER_STATUS_COLOR } from '@/lib/constants'
import { formatDate, formatPKR, formatPKRFull } from '@/lib/format'
import { cn } from '@/lib/utils'

export default function AgentDetail() {
  const { agentId } = useParams<{ agentId: string }>()
  const navigate = useNavigate()
  const agents = useDataStore((s) => s.agents)
  const buyers = useDataStore((s) => s.buyers)
  const plots = useDataStore((s) => s.plots)

  const agent = agents.find((a) => a.id === agentId)
  const managedBuyers = buyers.filter((b) => b.agentId === agentId)
  const rank = [...agents].sort((a, b) => b.mtdRevenue - a.mtdRevenue).findIndex((a) => a.id === agentId) + 1

  if (!agent) {
    return (
      <div>
        <Topbar title="Agent not found" />
        <main className="p-8">
          <Card className="p-10 text-center text-sm text-navy-900/50">
            This agent doesn't exist.{' '}
            <Link to="/crm/agents" className="font-semibold text-gold-600">
              Back to agents
            </Link>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div>
      <Topbar title={agent.name} subtitle={`${agent.id} · ${agent.agency}`} />

      <main className="space-y-6 p-6 sm:p-8">
        <button
          onClick={() => navigate('/crm/agents')}
          className="flex items-center gap-1.5 text-sm font-semibold text-navy-900/50 hover:text-navy-900"
        >
          <ArrowLeft className="h-4 w-4" /> Back to agents
        </button>

        <div className="grid gap-6 xl:grid-cols-[1fr_1.4fr]">
          <Card className="p-6 text-center">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-navy-900/5 font-display text-lg font-bold text-navy-900">
              {agent.initials}
            </span>
            <p className="mt-3 font-display text-lg font-semibold text-navy-900">{agent.name}</p>
            <p className="text-xs text-navy-900/45">{agent.agency}</p>
            <span className="mt-3 inline-block rounded-full bg-gold-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-gold-700">
              Rank #{rank} this month
            </span>

            <div className="mt-6 grid grid-cols-3 gap-3 border-t border-navy-900/8 pt-5">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-navy-900/40">Sales</p>
                <p className="mt-1 font-display text-lg font-semibold text-navy-900">{agent.mtdSales}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-navy-900/40">Revenue</p>
                <p className="mt-1 font-display text-lg font-semibold text-navy-900">{formatPKR(agent.mtdRevenue)}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-navy-900/40">Commission</p>
                <p className="mt-1 font-display text-lg font-semibold text-sage-600">{formatPKR(agent.commission)}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <CardLabel>Managed buyers ({managedBuyers.length})</CardLabel>
            <div className="mt-4 space-y-2">
              {managedBuyers.length === 0 && <p className="py-6 text-center text-sm text-navy-900/45">No buyers assigned yet.</p>}
              {managedBuyers.map((buyer) => {
                const plot = plots.find((p) => p.id === buyer.plotId)
                const statusColor = BUYER_STATUS_COLOR[buyer.status]
                return (
                  <Link
                    key={buyer.id}
                    to={`/crm/buyers/${buyer.id}`}
                    className="flex items-center justify-between gap-4 rounded-xl border border-navy-900/8 p-3.5 transition hover:border-gold-400/40"
                  >
                    <div>
                      <p className="text-sm font-semibold text-navy-900">{buyer.name}</p>
                      <p className="text-xs text-navy-900/45">
                        {plot ? `${plot.id} · Block ${plot.block}` : buyer.plotId} &middot; registered {formatDate(buyer.registeredAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-navy-900">{formatPKRFull(buyer.totalAmount)}</span>
                      <Badge className={cn(statusColor.bg, statusColor.text)}>{buyer.status}</Badge>
                    </div>
                  </Link>
                )
              })}
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
