import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Mail, MapPin, Phone, User } from 'lucide-react'
import Topbar from '@/components/layout/Topbar'
import { Card, CardLabel } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { InstallmentTable } from '@/components/crm/InstallmentTable'
import { RecordPaymentDialog } from '@/components/crm/RecordPaymentDialog'
import { useDataStore } from '@/store/dataStore'
import { BUYER_STATUS_COLOR } from '@/lib/constants'
import { formatDate, formatPKRFull } from '@/lib/format'
import { cn } from '@/lib/utils'

export default function BuyerDetail() {
  const { buyerId } = useParams<{ buyerId: string }>()
  const navigate = useNavigate()
  const buyer = useDataStore((s) => s.buyers.find((b) => b.id === buyerId))
  const plot = useDataStore((s) => s.plots.find((p) => p.id === buyer?.plotId))
  const agent = useDataStore((s) => s.agents.find((a) => a.id === buyer?.agentId))

  if (!buyer) {
    return (
      <div>
        <Topbar title="Buyer not found" />
        <main className="p-8">
          <Card className="p-10 text-center text-sm text-navy-900/50">
            This buyer doesn't exist.{' '}
            <Link to="/crm/buyers" className="font-semibold text-gold-600">
              Back to buyers
            </Link>
          </Card>
        </main>
      </div>
    )
  }

  const paid = buyer.installments.filter((i) => i.status === 'paid')
  const paidAmount = paid.reduce((s, i) => s + i.amount, 0)
  const statusColor = BUYER_STATUS_COLOR[buyer.status]

  return (
    <div>
      <Topbar title={buyer.name} subtitle={`${buyer.id} · ${buyer.cnic}`} primaryAction={<RecordPaymentDialog buyerId={buyer.id} />} />

      <main className="space-y-6 p-6 sm:p-8">
        <button
          onClick={() => navigate('/crm/buyers')}
          className="flex items-center gap-1.5 text-sm font-semibold text-navy-900/50 hover:text-navy-900"
        >
          <ArrowLeft className="h-4 w-4" /> Back to buyers
        </button>

        <div className="grid gap-6 xl:grid-cols-[1fr_1.2fr]">
          <Card className="p-6">
            <div className="mb-5 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-navy-900/5 text-navy-900">
                  <User className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-display text-lg font-semibold text-navy-900">{buyer.name}</p>
                  <p className="text-xs text-navy-900/45">Registered {formatDate(buyer.registeredAt)}</p>
                </div>
              </div>
              <Badge className={cn(statusColor.bg, statusColor.text)}>{buyer.status}</Badge>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2.5 text-navy-900/70">
                <Phone className="h-4 w-4 text-navy-900/35" /> {buyer.phone}
              </div>
              <div className="flex items-center gap-2.5 text-navy-900/70">
                <Mail className="h-4 w-4 text-navy-900/35" /> {buyer.email}
              </div>
              {plot && (
                <div className="flex items-center gap-2.5 text-navy-900/70">
                  <MapPin className="h-4 w-4 text-navy-900/35" />
                  <Link to={`/crm/inventory/${plot.id}`} className="font-medium text-navy-900 hover:text-gold-600">
                    {plot.id} &middot; Block {plot.block} &middot; {String(plot.plotNo).padStart(3, '0')}
                  </Link>
                </div>
              )}
            </div>

            <div className="mt-6 border-t border-navy-900/8 pt-5">
              <CardLabel>Assigned agent</CardLabel>
              <p className="mt-1.5 text-sm font-semibold text-navy-900">{agent?.name ?? '—'}</p>
              <p className="text-xs text-navy-900/45">{agent?.agency}</p>
            </div>
          </Card>

          <Card className="p-6">
            <CardLabel>Payment progress</CardLabel>
            <p className="mt-1.5 font-display text-2xl font-semibold text-navy-900">
              {formatPKRFull(paidAmount)} <span className="text-base font-medium text-navy-900/40">/ {formatPKRFull(buyer.totalAmount)}</span>
            </p>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-cream-200">
              <div className="h-full rounded-full bg-gold-500" style={{ width: `${(paidAmount / buyer.totalAmount) * 100}%` }} />
            </div>
            <p className="mt-2 text-xs font-medium text-navy-900/50">
              {paid.length} of {buyer.installments.length} installments paid
            </p>

            <div className="mt-5 grid grid-cols-3 gap-3">
              <div className="rounded-xl border border-navy-900/8 p-3.5 text-center">
                <p className="text-[10px] font-bold uppercase tracking-wider text-navy-900/40">Paid</p>
                <p className="mt-1 font-display text-lg font-semibold text-sage-600">
                  {buyer.installments.filter((i) => i.status === 'paid').length}
                </p>
              </div>
              <div className="rounded-xl border border-navy-900/8 p-3.5 text-center">
                <p className="text-[10px] font-bold uppercase tracking-wider text-navy-900/40">Due</p>
                <p className="mt-1 font-display text-lg font-semibold text-gold-700">
                  {buyer.installments.filter((i) => i.status === 'due').length}
                </p>
              </div>
              <div className="rounded-xl border border-navy-900/8 p-3.5 text-center">
                <p className="text-[10px] font-bold uppercase tracking-wider text-navy-900/40">Overdue</p>
                <p className="mt-1 font-display text-lg font-semibold text-rose-500">
                  {buyer.installments.filter((i) => i.status === 'overdue').length}
                </p>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <h2 className="mb-5 font-display text-lg font-semibold text-navy-900">Installment timeline</h2>
          <InstallmentTable installments={buyer.installments} />
        </Card>
      </main>
    </div>
  )
}
