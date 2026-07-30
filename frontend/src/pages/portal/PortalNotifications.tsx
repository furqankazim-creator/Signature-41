import { AlertCircle, Bell, CheckCircle2, Clock, PartyPopper } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { usePortalDataStore } from '@/store/portalDataStore'
import { formatRelativeTime } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { PortalNotificationType } from '@/types'

const TYPE_META: Record<PortalNotificationType, { icon: typeof Bell; className: string; bg: string }> = {
  overdue: { icon: AlertCircle, className: 'text-rose-500', bg: 'bg-rose-500/10' },
  upcoming: { icon: Clock, className: 'text-gold-700', bg: 'bg-gold-500/10' },
  paid: { icon: CheckCircle2, className: 'text-sage-600', bg: 'bg-sage-500/10' },
  completed: { icon: PartyPopper, className: 'text-navy-900', bg: 'bg-gold-500/15' },
}

export default function PortalNotifications() {
  const notifications = usePortalDataStore((s) => s.notifications)

  const overdueCount = notifications.filter((n) => n.type === 'overdue').length
  const upcomingCount = notifications.filter((n) => n.type === 'upcoming').length

  return (
    <div>
      {/* Header */}
      <div className="border-b border-navy-900/8 bg-white/60 px-6 py-5 sm:px-8">
        <p className="text-[11px] font-bold uppercase tracking-wider text-gold-600">Updates</p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-navy-900">Notifications</h1>
        <p className="mt-1 text-sm text-navy-900/50">
          {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
          {overdueCount > 0 && <span className="ml-1.5 font-semibold text-rose-500">· {overdueCount} overdue</span>}
          {upcomingCount > 0 && <span className="ml-1.5 font-semibold text-gold-700">· {upcomingCount} upcoming</span>}
        </p>
      </div>

      <main className="p-6 sm:p-8">
        {notifications.length === 0 ? (
          <Card className="p-10 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-navy-900/5">
              <Bell className="h-6 w-6 text-navy-900/30" />
            </span>
            <p className="mt-4 text-sm font-semibold text-navy-900">No notifications</p>
            <p className="mt-1 text-xs text-navy-900/50">You're all caught up! Check back later for updates.</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {notifications.map((notif) => {
              const meta = TYPE_META[notif.type] ?? TYPE_META.upcoming
              const Icon = meta.icon
              return (
                <Card
                  key={notif.id}
                  className={cn(
                    'flex items-start gap-4 p-5 transition-colors',
                    notif.type === 'overdue' && 'border-rose-500/20 bg-rose-500/[0.02]'
                  )}
                >
                  <span className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl', meta.bg)}>
                    <Icon className={cn('h-4.5 w-4.5', meta.className)} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-semibold text-navy-900">{notif.title}</p>
                      <span className="shrink-0 text-[11px] text-navy-900/35">{formatRelativeTime(notif.timestamp)}</span>
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-navy-900/60">{notif.detail}</p>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
