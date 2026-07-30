import { Download, Receipt } from 'lucide-react'
import { Card, CardLabel } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { InstallmentTable } from '@/components/crm/InstallmentTable'
import { usePortalDataStore } from '@/store/portalDataStore'
import { BUYER_STATUS_COLOR, PAYMENT_STATUS_COLOR } from '@/lib/constants'
import { formatPKRFull, formatDate, formatRelativeTime } from '@/lib/format'
import { cn } from '@/lib/utils'

export default function PortalPayments() {
  const paymentsData = usePortalDataStore((s) => s.paymentsData)
  const buyer = usePortalDataStore((s) => s.buyer)

  const installments = paymentsData?.installments ?? []
  const payments = paymentsData?.payments ?? []
  const totalAmount = paymentsData?.totalAmount ?? 0
  const paid = installments.filter((i) => i.status === 'paid')
  const paidAmount = paid.reduce((s, i) => s + i.amount, 0)
  const nextDue = installments.find((i) => i.status === 'due' || i.status === 'overdue')
  const progressPercent = totalAmount > 0 ? (paidAmount / totalAmount) * 100 : 0

  return (
    <div>
      {/* Header */}
      <div className="border-b border-navy-900/8 bg-white/60 px-6 py-5 sm:px-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-gold-600">Financials</p>
            <h1 className="mt-1 font-display text-2xl font-semibold text-navy-900">Payment Progress</h1>
          </div>
          {buyer?.status && (
            <Badge className={cn(BUYER_STATUS_COLOR[buyer.status].bg, BUYER_STATUS_COLOR[buyer.status].text, 'text-xs px-3 py-1.5')}>
              {buyer.status}
            </Badge>
          )}
        </div>
      </div>

      <main className="space-y-6 p-6 sm:p-8">
        {/* Overview Cards */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Card className="p-5">
            <CardLabel>Total Amount</CardLabel>
            <p className="mt-1.5 font-display text-xl font-semibold text-navy-900">{formatPKRFull(totalAmount)}</p>
          </Card>
          <Card className="p-5">
            <CardLabel>Paid So Far</CardLabel>
            <p className="mt-1.5 font-display text-xl font-semibold text-sage-600">{formatPKRFull(paidAmount)}</p>
          </Card>
          <Card className="p-5">
            <CardLabel>Remaining</CardLabel>
            <p className="mt-1.5 font-display text-xl font-semibold text-gold-700">{formatPKRFull(totalAmount - paidAmount)}</p>
          </Card>
          <Card className="p-5">
            <CardLabel>Progress</CardLabel>
            <p className="mt-1.5 font-display text-xl font-semibold text-navy-900">{progressPercent.toFixed(1)}%</p>
          </Card>
        </div>

        {/* Progress Bar */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <CardLabel>Overall Progress</CardLabel>
            <span className="text-xs font-medium text-navy-900/50">
              {paid.length} of {installments.length} installments paid
            </span>
          </div>
          <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-cream-200">
            <div
              className="h-full rounded-full bg-gradient-to-r from-gold-500 to-sage-500 transition-all duration-700"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-navy-900/8 p-3.5 text-center">
              <p className="text-[10px] font-bold uppercase tracking-wider text-navy-900/40">Paid</p>
              <p className="mt-1 font-display text-2xl font-semibold text-sage-600">
                {installments.filter((i) => i.status === 'paid').length}
              </p>
            </div>
            <div className="rounded-xl border border-navy-900/8 p-3.5 text-center">
              <p className="text-[10px] font-bold uppercase tracking-wider text-navy-900/40">Due</p>
              <p className="mt-1 font-display text-2xl font-semibold text-gold-700">
                {installments.filter((i) => i.status === 'due').length}
              </p>
            </div>
            <div className="rounded-xl border border-navy-900/8 p-3.5 text-center">
              <p className="text-[10px] font-bold uppercase tracking-wider text-navy-900/40">Overdue</p>
              <p className="mt-1 font-display text-2xl font-semibold text-rose-500">
                {installments.filter((i) => i.status === 'overdue').length}
              </p>
            </div>
          </div>
        </Card>

        {/* Next Payment Due */}
        {nextDue && (
          <Card className={cn(
            'p-6',
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
                  {nextDue.status === 'overdue' ? '⚠ Payment Overdue' : '📅 Next Payment Due'}
                </p>
                <p className="mt-1.5 font-display text-2xl font-semibold text-navy-900">{formatPKRFull(nextDue.amount)}</p>
                <p className="mt-0.5 text-sm text-navy-900/50">
                  Installment #{nextDue.index + 1} · Due {formatDate(nextDue.dueDate)}
                </p>
              </div>
              {nextDue.status === 'overdue' && (
                <div className="rounded-xl bg-rose-500/10 px-4 py-2.5 text-center">
                  <p className="text-xs font-medium text-rose-500">Contact your agent to arrange payment</p>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Installment Timeline */}
        <Card className="p-6">
          <h2 className="mb-5 font-display text-lg font-semibold text-navy-900">Installment Timeline</h2>
          <InstallmentTable installments={installments} />
        </Card>

        {/* Receipt History */}
        {payments.length > 0 && (
          <Card className="p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-navy-900">Receipt History</h2>
              <span className="flex items-center gap-1.5 text-xs font-medium text-navy-900/40">
                <Receipt className="h-3.5 w-3.5" /> {payments.length} receipt{payments.length !== 1 ? 's' : ''}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-navy-900/8 text-left text-[11px] font-bold uppercase tracking-wider text-navy-900/35">
                    <th className="py-2.5 pr-4">Receipt #</th>
                    <th className="py-2.5 pr-4">Amount</th>
                    <th className="py-2.5 pr-4">Method</th>
                    <th className="py-2.5 pr-4">Date</th>
                    <th className="py-2.5">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => {
                    const statusColor = PAYMENT_STATUS_COLOR[payment.status]
                    return (
                      <tr key={payment.id} className="border-b border-navy-900/5 last:border-0">
                        <td className="py-3 pr-4">
                          <span className="font-mono text-xs font-semibold text-navy-900">{payment.receiptNo}</span>
                        </td>
                        <td className="py-3 pr-4 font-medium text-navy-900">{formatPKRFull(payment.amount)}</td>
                        <td className="py-3 pr-4 text-navy-900/60">{payment.method}</td>
                        <td className="py-3 pr-4">
                          <span className="text-navy-900/70">{formatDate(payment.timestamp)}</span>
                          <span className="ml-1.5 text-[11px] text-navy-900/35">{formatRelativeTime(payment.timestamp)}</span>
                        </td>
                        <td className="py-3">
                          <Badge className={cn(statusColor.bg, statusColor.text, 'text-[10px]')}>{payment.status}</Badge>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </main>
    </div>
  )
}
