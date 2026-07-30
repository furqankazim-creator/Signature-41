import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Map,
  Grid3x3,
  Users,
  Wallet,
  UserCog,
  ChevronDown,
  LogOut,
  Check,
} from 'lucide-react'
import { NAV_ITEMS, ADMIN_INITIALS, ADMIN_NAME, ADMIN_ROLE, PROJECT } from '@/lib/constants'
import { useAuthStore } from '@/store/authStore'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const ICONS = { LayoutDashboard, Map, Grid3x3, Users, Wallet, UserCog }

export default function Sidebar() {
  const logout = useAuthStore((s) => s.logout)

  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-[272px] flex-col border-r border-cream-50/8 bg-navy-950 text-cream-50">
      <div className="flex h-[72px] items-center gap-2.5 px-6">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-cream-50/10 font-display text-base italic text-gold-400">
          S
        </span>
        <span className="flex flex-col leading-none">
          <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-cream-100/45">Estate</span>
          <span className="font-display text-base font-semibold">Signature 41</span>
        </span>
      </div>

      <div className="px-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex w-full items-center justify-between rounded-xl border border-gold-500/25 bg-gold-500/10 px-4 py-3 text-left transition hover:bg-gold-500/15">
              <span>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-gold-400">Active project</span>
                <span className="mt-0.5 block text-sm font-semibold text-cream-50">{PROJECT.name}</span>
                <span className="block text-[11px] text-cream-100/45">{PROJECT.tagline}</span>
              </span>
              <ChevronDown className="h-4 w-4 shrink-0 text-cream-100/50" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[240px]">
            <DropdownMenuItem className="justify-between">
              <span>
                <span className="block font-semibold">{PROJECT.name}</span>
                <span className="block text-xs text-navy-900/50">{PROJECT.tagline}</span>
              </span>
              <Check className="h-4 w-4 text-gold-600" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <nav className="mt-6 flex-1 overflow-y-auto px-4">
        <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-[0.18em] text-cream-100/35">Management</p>
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => {
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
                      {isActive && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-navy-950" />}
                    </>
                  )}
                </NavLink>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="border-t border-cream-50/8 p-4">
        <div className="flex items-center gap-3 rounded-xl px-2 py-2">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-500/20 text-xs font-bold text-gold-400">
            {ADMIN_INITIALS}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold text-cream-50">{ADMIN_NAME}</span>
            <span className="block truncate text-xs text-cream-100/45">{ADMIN_ROLE}</span>
          </span>
          <button
            onClick={logout}
            title="Log out"
            className="rounded-lg p-2 text-cream-100/45 transition hover:bg-cream-50/5 hover:text-cream-50"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}
