import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import CommandPalette from './CommandPalette'
import NotificationBell from './NotificationBell'

interface TopbarProps {
  title: string
  subtitle?: string
  primaryAction?: React.ReactNode
}

export default function Topbar({ title, subtitle, primaryAction }: TopbarProps) {
  const [paletteOpen, setPaletteOpen] = useState(false)

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPaletteOpen(true)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <>
      <header className="sticky top-0 z-20 flex h-[72px] items-center gap-4 border-b border-navy-900/8 bg-cream-100/90 px-6 backdrop-blur sm:px-8">
        <div className="min-w-0 flex-1">
          <h1 className="truncate font-display text-xl font-semibold text-navy-900">{title}</h1>
          {subtitle && <p className="truncate text-xs text-navy-900/50">{subtitle}</p>}
        </div>

        <button
          onClick={() => setPaletteOpen(true)}
          className="hidden items-center gap-2 rounded-full border border-navy-900/10 bg-white px-4 py-2 text-sm text-navy-900/40 transition hover:border-navy-900/20 sm:flex sm:w-64"
        >
          <Search className="h-4 w-4" />
          <span className="flex-1 text-left">Search plots, buyers, receipts...</span>
          <kbd className="rounded-md border border-navy-900/10 bg-cream-100 px-1.5 py-0.5 text-[10px] font-semibold">⌘K</kbd>
        </button>

        <button
          onClick={() => setPaletteOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-navy-900/10 text-navy-900/60 transition hover:bg-cream-200/60 sm:hidden"
        >
          <Search className="h-[18px] w-[18px]" />
        </button>

        <NotificationBell />
        {primaryAction}
      </header>

      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </>
  )
}
