import { NavLink } from 'react-router-dom'
import {
  Home,
  Wallet,
  Bell,
  Headphones,
  LogOut,
  MapPin,
} from 'lucide-react'
import { PORTAL_NAV_ITEMS } from '@/lib/constants'
import { usePortalAuthStore } from '@/store/portalAuthStore'
import { usePortalDataStore } from '@/store/portalDataStore'
import { cn } from '@/lib/utils'

const ICONS = { Home, Wallet, Bell, Headphones }

export default function PortalSidebar() {
  const logout = usePortalAuthStore((s) => s.logout)
  const reset = usePortalDataStore((s) => s.reset)
  const buyer = usePortalAuthStore((s) => s.buyer)
  const plot = usePortalDataStore((s) => s.plot)
  const notifications = usePortalDataStore((s) => s.notifications)

  const overdueCount = notifications.filter((n) => n.type === 'overdue').length

  function handleLogout() {
    reset()
    logout()
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-[272px] flex-col border-r border-cream-50/8 bg-navy-950 text-cream-50">
      {/* Logo */}
      <div className="flex h-[72px] items-center gap-2.5 px-6">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-cream-50/10 font-display text-base italic text-gold-400">
          S
        </span>
        <span className="flex flex-col leading-none">
          <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-cream-100/45">Buyer</span>
          <span className="font-display text-base font-semibold">Portal</span>
        </span>
      </div>

      {/* Buyer Identity Card */}
      <div className="px-4">
        <div className="rounded-xl border border-gold-500/25 bg-gold-500/10 px-4 py-3.5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold-500/20 text-sm font-bold text-gold-400">
              {buyer?.name?.split(' ').map((n) => n[0]).join('').slice(0, 2) ?? '—'}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-cream-50">{buyer?.name ?? 'Buyer'}</p>
              <p className="truncate text-[11px] text-cream-100/45">{buyer?.cnic ?? '—'}</p>
            </div>
          </div>
          {plot && (
            <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-gold-400">
              <MapPin className="h-3 w-3" />
              <span className="font-medium">Block {plot.block} · Plot {String(plot.plotNo).padStart(3, '0')}</span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-6 flex-1 overflow-y-auto px-4">
        <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-[0.18em] text-cream-100/35">My Account</p>
        <ul className="space-y-1">
          {PORTAL_NAV_ITEMS.map((item) => {
            const Icon = ICONS[item.icon as keyof typeof ICONS]
            return (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={'end' in item ? item.end : false}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-cream-100/65 transition-colors hover:bg-cream-50/5 hover:text-cream-50',
                      isActive && 'bg-gold-500 text-navy-950 hover:bg-gold-500 hover:text-navy-950'
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon className="h-[18px] w-[18px]" />
                      {item.label}
                      {item.icon === 'Bell' && overdueCount > 0 && (
                        <span className={cn(
                          'ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-bold',
                          isActive ? 'bg-navy-950/20 text-navy-950' : 'bg-rose-500 text-white'
                        )}>
                          {overdueCount}
                        </span>
                      )}
                      {item.icon !== 'Bell' && isActive && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-navy-950" />}
                    </>
                  )}
                </NavLink>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="border-t border-cream-50/8 p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-cream-100/55 transition-colors hover:bg-cream-50/5 hover:text-cream-50"
        >
          <LogOut className="h-[18px] w-[18px]" />
          Sign out
        </button>
      </div>
    </aside>
  )
}
