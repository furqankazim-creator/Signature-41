import { MapPin, Layers, Maximize2, Tag, DollarSign, Phone, Mail, Building2, Trees, Star } from 'lucide-react'
import { Card, CardLabel } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { usePortalDataStore } from '@/store/portalDataStore'
import { usePortalAuthStore } from '@/store/portalAuthStore'
import { PLOT_STATUS_COLOR, BUYER_STATUS_COLOR } from '@/lib/constants'
import { formatPKRFull, formatDate } from '@/lib/format'
import { cn } from '@/lib/utils'

const AMENITY_ICONS: Record<string, typeof Trees> = { Park: Trees, Road: MapPin, Corner: Star, Mosque: Building2 }

export default function MyPlot() {
  const buyer = usePortalAuthStore((s) => s.buyer)
  const plot = usePortalDataStore((s) => s.plot)
  const agent = usePortalDataStore((s) => s.agent)
  const paymentsData = usePortalDataStore((s) => s.paymentsData)

  const installments = paymentsData?.installments ?? []
  const paid = installments.filter((i) => i.status === 'paid')
  const paidAmount = paid.reduce((s, i) => s + i.amount, 0)
  const totalAmount = paymentsData?.totalAmount ?? 0
  const nextDue = installments.find((i) => i.status === 'due' || i.status === 'overdue')

  return (
    <div>
      {/* Header */}
      <div className="border-b border-navy-900/8 bg-white/60 px-6 py-5 sm:px-8">
        <p className="text-[11px] font-bold uppercase tracking-wider text-gold-600">Welcome back</p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-navy-900">{buyer?.name ?? 'Buyer'}</h1>
        <p className="mt-0.5 text-sm text-navy-900/50">
          {buyer?.cnic} · Registered {buyer?.registeredAt ? formatDate(buyer.registeredAt) : '—'}
        </p>
      </div>

      <main className="space-y-6 p-6 sm:p-8">
        {/* Plot Details + Payment Summary */}
        <div className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
          {/* Plot Card */}
          <Card className="overflow-hidden">
            <div className="bg-navy-950 px-6 py-5 text-cream-50">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold-400">Your Property</p>
                  <p className="mt-1.5 font-display text-2xl font-semibold">
                    Block {plot?.block ?? '—'} · Plot {plot ? String(plot.plotNo).padStart(3, '0') : '—'}
                  </p>
                  <p className="mt-0.5 text-sm text-cream-100/50">{plot?.id ?? '—'}</p>
                </div>
                {plot && (
                  <Badge className={cn(PLOT_STATUS_COLOR[plot.status].bg, PLOT_STATUS_COLOR[plot.status].text)}>
                    {plot.status}
                  </Badge>
                )}
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-navy-900/5">
                    <Layers className="h-4 w-4 text-navy-900/40" />
                  </span>
                  <div>
                    <CardLabel>Type</CardLabel>
                    <p className="mt-0.5 text-sm font-semibold text-navy-900">{plot?.type ?? '—'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-navy-900/5">
                    <Maximize2 className="h-4 w-4 text-navy-900/40" />
                  </span>
                  <div>
                    <CardLabel>Size</CardLabel>
                    <p className="mt-0.5 text-sm font-semibold text-navy-900">{plot?.sizeSqYd ?? '—'} sq yd</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-navy-900/5">
                    <Tag className="h-4 w-4 text-navy-900/40" />
                  </span>
                  <div>
                    <CardLabel>Category</CardLabel>
                    <p className="mt-0.5 text-sm font-semibold text-navy-900">Cat. {plot?.category ?? '—'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-navy-900/5">
                    <DollarSign className="h-4 w-4 text-navy-900/40" />
                  </span>
                  <div>
                    <CardLabel>Price</CardLabel>
                    <p className="mt-0.5 text-sm font-semibold text-navy-900">{plot ? formatPKRFull(plot.price) : '—'}</p>
                  </div>
                </div>
                <div className="col-span-2 flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-navy-900/5">
                    <Trees className="h-4 w-4 text-navy-900/40" />
                  </span>
                  <div>
                    <CardLabel>Amenities</CardLabel>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {(!plot || plot.amenities.length === 0) && (
                        <span className="text-sm text-navy-900/40">None listed</span>
                      )}
                      {plot?.amenities.map((a) => {
                        const Icon = AMENITY_ICONS[a] ?? Star
                        return (
                          <span
                            key={a}
                            className="inline-flex items-center gap-1 rounded-full bg-cream-200 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-navy-900/50"
                          >
                            <Icon className="h-3 w-3" /> {a}
                          </span>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Payment Summary + Agent */}
          <div className="space-y-6">
            {/* Payment Progress */}
            <Card className="p-6">
              <CardLabel>Payment Progress</CardLabel>
              <p className="mt-1.5 font-display text-2xl font-semibold text-navy-900">
                {formatPKRFull(paidAmount)}{' '}
                <span className="text-base font-medium text-navy-900/40">/ {formatPKRFull(totalAmount)}</span>
              </p>
              <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-cream-200">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-gold-500 to-gold-600 transition-all duration-500"
                  style={{ width: `${totalAmount > 0 ? (paidAmount / totalAmount) * 100 : 0}%` }}
                />
              </div>
              <p className="mt-2 text-xs font-medium text-navy-900/50">
                {paid.length} of {installments.length} installments paid
              </p>

              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="rounded-xl border border-navy-900/8 p-3 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-navy-900/40">Paid</p>
                  <p className="mt-1 font-display text-lg font-semibold text-sage-600">
                    {installments.filter((i) => i.status === 'paid').length}
                  </p>
                </div>
                <div className="rounded-xl border border-navy-900/8 p-3 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-navy-900/40">Due</p>
                  <p className="mt-1 font-display text-lg font-semibold text-gold-700">
                    {installments.filter((i) => i.status === 'due').length}
                  </p>
                </div>
                <div className="rounded-xl border border-navy-900/8 p-3 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-navy-900/40">Overdue</p>
                  <p className="mt-1 font-display text-lg font-semibold text-rose-500">
                    {installments.filter((i) => i.status === 'overdue').length}
                  </p>
                </div>
              </div>
            </Card>

            {/* Next Payment Due */}
            {nextDue && (
              <Card className={cn(
                'p-5',
                nextDue.status === 'overdue'
                  ? 'border-rose-500/30 bg-rose-500/5'
                  : 'border-gold-500/30 bg-gold-500/5'
              )}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={cn(
                      'text-[10px] font-bold uppercase tracking-wider',
                      nextDue.status === 'overdue' ? 'text-rose-500' : 'text-gold-700'
                    )}>
                      {nextDue.status === 'overdue' ? '⚠ Overdue' : 'Next Payment'}
                    </p>
                    <p className="mt-1 font-display text-xl font-semibold text-navy-900">{formatPKRFull(nextDue.amount)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-navy-900/50">Due date</p>
                    <p className="mt-0.5 text-sm font-semibold text-navy-900">{formatDate(nextDue.dueDate)}</p>
                  </div>
                </div>
              </Card>
            )}

            {/* Agent Card */}
            {agent && (
              <Card className="p-5">
                <CardLabel>Your Sales Agent</CardLabel>
                <div className="mt-3 flex items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-navy-900/5 text-sm font-bold text-navy-900/60">
                    {agent.initials}
                  </span>
                  <div>
                    <p className="font-semibold text-navy-900">{agent.name}</p>
                    <p className="text-xs text-navy-900/45">{agent.agency}</p>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  {agent.phone && (
                    <a
                      href={`tel:${agent.phone.replace(/-/g, '')}`}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-navy-900/10 px-3 py-1.5 text-xs font-semibold text-navy-900/70 transition hover:bg-navy-900/5"
                    >
                      <Phone className="h-3 w-3" /> Call
                    </a>
                  )}
                  {agent.phone && (
                    <a
                      href={`https://wa.me/92${agent.phone.replace(/^0/, '').replace(/-/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-sage-500/20 bg-sage-500/10 px-3 py-1.5 text-xs font-semibold text-sage-600 transition hover:bg-sage-500/20"
                    >
                      <Mail className="h-3 w-3" /> WhatsApp
                    </a>
                  )}
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Buyer Status Banner */}
        {buyer?.status && (
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <CardLabel>Account Status</CardLabel>
                <p className="mt-1 text-sm text-navy-900/60">
                  {buyer.status === 'Completed'
                    ? 'All payments are complete. Your plot ownership is fully settled.'
                    : buyer.status === 'Overdue'
                      ? 'You have overdue installments. Please contact your agent to arrange payment.'
                      : 'Your account is in good standing. Keep up with your installment schedule.'}
                </p>
              </div>
              <Badge className={cn(BUYER_STATUS_COLOR[buyer.status].bg, BUYER_STATUS_COLOR[buyer.status].text)}>
                {buyer.status}
              </Badge>
            </div>
          </Card>
        )}
      </main>
    </div>
  )
}
