import { useNavigate } from 'react-router-dom'
import { AlertTriangle, CheckCircle2, Home } from 'lucide-react'
import { Card, CardLabel } from '@/components/ui/card'
import { formatRelativeTime } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { ActivityItem } from '@/lib/selectors'

const KIND_META = {
  payment: { icon: CheckCircle2, className: 'bg-sage-500/10 text-sage-600' },
  overdue: { icon: AlertTriangle, className: 'bg-rose-500/10 text-rose-500' },
  booking: { icon: Home, className: 'bg-gold-500/10 text-gold-700' },
}

export function ActivityFeed({ items }: { items: ActivityItem[] }) {
  const navigate = useNavigate()

  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <CardLabel>Activity feed</CardLabel>
        <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-sage-600">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-sage-500" /> Live
        </span>
      </div>
      {items.length === 0 && <p className="py-6 text-center text-sm text-navy-900/40">No activity yet.</p>}
      <div className="space-y-4">
        {items.map((item) => {
          const meta = KIND_META[item.kind]
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className="flex w-full items-start gap-3 text-left"
            >
              <span className={cn('mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full', meta.className)}>
                <meta.icon className="h-3.5 w-3.5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13px] font-semibold text-navy-900">{item.title}</span>
                <span className="block truncate text-xs text-navy-900/50">{item.detail}</span>
                <span className="mt-0.5 block text-[11px] text-navy-900/35">{formatRelativeTime(item.timestamp)}</span>
              </span>
            </button>
          )
        })}
      </div>
    </Card>
  )
}
