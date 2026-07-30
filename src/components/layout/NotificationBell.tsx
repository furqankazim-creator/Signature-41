import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { useDataStore } from '@/store/dataStore'
import { formatPKR, formatRelativeTime } from '@/lib/format'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Notice {
  id: string
  kind: 'overdue' | 'payment'
  title: string
  detail: string
  timestamp: string
  path: string
}

export default function NotificationBell() {
  const navigate = useNavigate()
  const buyers = useDataStore((s) => s.buyers)
  const payments = useDataStore((s) => s.payments)
  const readIds = useDataStore((s) => s.readNotificationIds)
  const markRead = useDataStore((s) => s.markNotificationRead)
  const markAllRead = useDataStore((s) => s.markAllNotificationsRead)

  const notices: Notice[] = useMemo(() => {
    const overdue: Notice[] = buyers
      .filter((b) => b.status === 'Overdue')
      .slice(0, 5)
      .map((b) => ({
        id: `overdue-${b.id}`,
        kind: 'overdue',
        title: `Payment overdue — ${b.name}`,
        detail: `${b.id} needs follow-up on an unpaid installment`,
        timestamp: b.registeredAt,
        path: `/crm/buyers/${b.id}`,
      }))
    const recent: Notice[] = payments
      .filter((p) => p.status === 'Received')
      .slice(0, 4)
      .map((p) => ({
        id: `payment-${p.id}`,
        kind: 'payment',
        title: `Payment received — ${formatPKR(p.amount)}`,
        detail: `Receipt ${p.receiptNo}`,
        timestamp: p.timestamp,
        path: '/crm/payments',
      }))
    return [...overdue, ...recent].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }, [buyers, payments])

  const unreadCount = notices.filter((n) => !readIds.includes(n.id)).length

  return (
    <DropdownMenu onOpenChange={(open) => open && markAllRead(notices.map((n) => n.id))}>
      <DropdownMenuTrigger asChild>
        <button className="relative flex h-10 w-10 items-center justify-center rounded-full border border-navy-900/10 text-navy-900/60 transition hover:bg-cream-200/60 hover:text-navy-900">
          <Bell className="h-[18px] w-[18px]" />
          {unreadCount > 0 && (
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-cream-50" />
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[340px]">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notices.length === 0 && <p className="px-3 py-6 text-center text-sm text-navy-900/40">You're all caught up.</p>}
        <div className="max-h-80 overflow-y-auto">
          {notices.map((n) => (
            <DropdownMenuItem
              key={n.id}
              onSelect={() => {
                markRead(n.id)
                navigate(n.path)
              }}
              className="items-start gap-3"
            >
              <span
                className={cn(
                  'mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full',
                  n.kind === 'overdue' ? 'bg-rose-500/10 text-rose-500' : 'bg-sage-500/10 text-sage-600'
                )}
              >
                {n.kind === 'overdue' ? <AlertTriangle className="h-3.5 w-3.5" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13px] font-semibold text-navy-900">{n.title}</span>
                <span className="block truncate text-xs text-navy-900/50">{n.detail}</span>
                <span className="mt-0.5 block text-[11px] text-navy-900/35">{formatRelativeTime(n.timestamp)}</span>
              </span>
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
