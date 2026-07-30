import { CheckCircle2, Clock, AlertCircle } from 'lucide-react'
import { formatDate, formatPKRFull } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { Installment } from '@/types'

const STATUS_META = {
  paid: { label: 'Paid', icon: CheckCircle2, className: 'text-sage-600 bg-sage-500/10' },
  due: { label: 'Due', icon: Clock, className: 'text-gold-700 bg-gold-500/10' },
  overdue: { label: 'Overdue', icon: AlertCircle, className: 'text-rose-500 bg-rose-500/10' },
}

export function InstallmentTable({ installments }: { installments: Installment[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-navy-900/8 text-left text-[11px] font-bold uppercase tracking-wider text-navy-900/35">
            <th className="py-2.5 pr-4">#</th>
            <th className="py-2.5 pr-4">Due date</th>
            <th className="py-2.5 pr-4">Amount</th>
            <th className="py-2.5 pr-4">Paid date</th>
            <th className="py-2.5">Status</th>
          </tr>
        </thead>
        <tbody>
          {installments.map((inst) => {
            const meta = STATUS_META[inst.status]
            return (
              <tr key={inst.index} className="border-b border-navy-900/5 last:border-0">
                <td className="py-2.5 pr-4 text-navy-900/60">{inst.index + 1}</td>
                <td className="py-2.5 pr-4 font-medium text-navy-900">{formatDate(inst.dueDate)}</td>
                <td className="py-2.5 pr-4 font-medium text-navy-900">{formatPKRFull(inst.amount)}</td>
                <td className="py-2.5 pr-4 text-navy-900/50">{inst.paidDate ? formatDate(inst.paidDate) : '—'}</td>
                <td className="py-2.5">
                  <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide', meta.className)}>
                    <meta.icon className="h-3 w-3" /> {meta.label}
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
