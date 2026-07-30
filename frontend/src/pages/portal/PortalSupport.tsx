import { Phone, MessageCircle, Mail, MapPin, Clock, Building2 } from 'lucide-react'
import { Card, CardLabel } from '@/components/ui/card'
import { usePortalDataStore } from '@/store/portalDataStore'

export default function PortalSupport() {
  const agent = usePortalDataStore((s) => s.agent)
  const plot = usePortalDataStore((s) => s.plot)

  const whatsappUrl = agent?.phone
    ? `https://wa.me/92${agent.phone.replace(/^0/, '').replace(/-/g, '')}?text=${encodeURIComponent(`Hi ${agent.name}, I'm reaching out about my plot ${plot?.id ?? ''} at Signature 41.`)}`
    : null

  return (
    <div>
      {/* Header */}
      <div className="border-b border-navy-900/8 bg-white/60 px-6 py-5 sm:px-8">
        <p className="text-[11px] font-bold uppercase tracking-wider text-gold-600">Help & Support</p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-navy-900">Contact & Support</h1>
      </div>

      <main className="space-y-6 p-6 sm:p-8">
        <div className="grid gap-6 xl:grid-cols-2">
          {/* Agent Card */}
          <Card className="overflow-hidden">
            <div className="bg-navy-950 px-6 py-5 text-cream-50">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold-400">Your Assigned Agent</p>
              <div className="mt-3 flex items-center gap-4">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gold-500/20 font-display text-lg font-semibold text-gold-400">
                  {agent?.initials ?? '—'}
                </span>
                <div>
                  <p className="font-display text-xl font-semibold">{agent?.name ?? 'Not assigned'}</p>
                  <p className="mt-0.5 text-sm text-cream-100/50">{agent?.agency ?? '—'}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3 p-6">
              {agent?.phone && (
                <a
                  href={`tel:${agent.phone.replace(/-/g, '')}`}
                  className="flex items-center gap-3 rounded-xl border border-navy-900/10 px-4 py-3.5 transition hover:border-navy-900/20 hover:bg-cream-200/50"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sage-500/10">
                    <Phone className="h-4 w-4 text-sage-600" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-navy-900">Call Agent</p>
                    <p className="text-xs text-navy-900/50">{agent.phone}</p>
                  </div>
                </a>
              )}

              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-xl border border-sage-500/20 bg-sage-500/5 px-4 py-3.5 transition hover:bg-sage-500/10"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sage-500/15">
                    <MessageCircle className="h-4 w-4 text-sage-600" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-sage-600">WhatsApp</p>
                    <p className="text-xs text-sage-600/60">Opens chat with pre-filled message</p>
                  </div>
                </a>
              )}
            </div>
          </Card>

          {/* Office Info */}
          <div className="space-y-6">
            <Card className="p-6">
              <CardLabel>Sales Office</CardLabel>
              <div className="mt-4 space-y-4">
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-navy-900/5">
                    <Building2 className="h-4 w-4 text-navy-900/40" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-navy-900">Signature 41 Sales Office</p>
                    <p className="text-xs text-navy-900/50">Surjani Town, Sector 11-C</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-navy-900/5">
                    <Phone className="h-4 w-4 text-navy-900/40" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-navy-900">0333-0335090</p>
                    <p className="text-xs text-navy-900/50">Main office line</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-navy-900/5">
                    <Mail className="h-4 w-4 text-navy-900/40" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-navy-900">signature41official@gmail.com</p>
                    <p className="text-xs text-navy-900/50">General inquiries</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-navy-900/5">
                    <Clock className="h-4 w-4 text-navy-900/40" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-navy-900">Mon – Sat, 9 AM – 6 PM</p>
                    <p className="text-xs text-navy-900/50">Office hours (PKT)</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-navy-900/5">
                    <MapPin className="h-4 w-4 text-navy-900/40" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-navy-900">Visit Us</p>
                    <p className="text-xs text-navy-900/50">Surjani Town, Sector 11-C</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* FAQ */}
            <Card className="p-6">
              <CardLabel>Common Questions</CardLabel>
              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-sm font-semibold text-navy-900">How do I make a payment?</p>
                  <p className="mt-1 text-xs leading-relaxed text-navy-900/50">
                    Contact your assigned agent or visit the sales office. Payments can be made via cash, bank transfer,
                    EasyPaisa, JazzCash, or card.
                  </p>
                </div>
                <div className="border-t border-navy-900/5 pt-4">
                  <p className="text-sm font-semibold text-navy-900">What happens if I miss a payment?</p>
                  <p className="mt-1 text-xs leading-relaxed text-navy-900/50">
                    Your installment will be marked as overdue. Please contact your agent as soon as possible to arrange
                    payment and avoid any late fees.
                  </p>
                </div>
                <div className="border-t border-navy-900/5 pt-4">
                  <p className="text-sm font-semibold text-navy-900">Can I change my payment plan?</p>
                  <p className="mt-1 text-xs leading-relaxed text-navy-900/50">
                    Payment plan modifications may be possible. Please discuss this with your assigned agent or visit the
                    sales office for details.
                  </p>
                </div>
                <div className="border-t border-navy-900/5 pt-4">
                  <p className="text-sm font-semibold text-navy-900">When will possession be given?</p>
                  <p className="mt-1 text-xs leading-relaxed text-navy-900/50">
                    Possession timelines depend on your block and development phase. Your agent can provide the latest
                    update on your specific plot.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
