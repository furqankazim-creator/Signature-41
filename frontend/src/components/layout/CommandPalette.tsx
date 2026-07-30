import { useMemo, useState } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { useNavigate } from 'react-router-dom'
import { Search, MapPinned, User, Receipt } from 'lucide-react'
import { useDataStore } from '@/store/dataStore'
import { formatPKR } from '@/lib/format'

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const plots = useDataStore((s) => s.plots)
  const buyers = useDataStore((s) => s.buyers)
  const payments = useDataStore((s) => s.payments)

  const q = query.trim().toLowerCase()

  const matchedPlots = useMemo(
    () => (q ? plots.filter((p) => p.id.toLowerCase().includes(q) || `${p.block} ${p.plotNo}`.toLowerCase().includes(q)).slice(0, 5) : []),
    [plots, q]
  )
  const matchedBuyers = useMemo(
    () => (q ? buyers.filter((b) => b.name.toLowerCase().includes(q) || b.id.toLowerCase().includes(q) || b.cnic.includes(q)).slice(0, 5) : []),
    [buyers, q]
  )
  const matchedPayments = useMemo(
    () => (q ? payments.filter((p) => p.receiptNo.toLowerCase().includes(q) || p.id.toLowerCase().includes(q)).slice(0, 5) : []),
    [payments, q]
  )

  function go(path: string) {
    onOpenChange(false)
    setQuery('')
    navigate(path)
  }

  const hasResults = matchedPlots.length + matchedBuyers.length + matchedPayments.length > 0

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-navy-950/50 backdrop-blur-[2px] data-[state=open]:animate-fade-in" />
        <DialogPrimitive.Content
          className="fixed left-1/2 top-24 z-50 w-[92vw] max-w-xl -translate-x-1/2 overflow-hidden rounded-2xl bg-white shadow-2xl outline-none data-[state=open]:animate-slide-up"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <DialogPrimitive.Title className="sr-only">Search</DialogPrimitive.Title>
          <div className="flex items-center gap-3 border-b border-navy-900/8 px-5 py-4">
            <Search className="h-4 w-4 text-navy-900/40" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search plots, buyers, receipts..."
              className="flex-1 bg-transparent text-sm text-navy-900 outline-none placeholder:text-navy-900/35"
            />
            <kbd className="rounded-md border border-navy-900/10 bg-cream-100 px-1.5 py-0.5 text-[10px] font-semibold text-navy-900/40">
              ESC
            </kbd>
          </div>

          <div className="max-h-[60vh] overflow-y-auto p-2">
            {!q && <p className="px-3 py-8 text-center text-sm text-navy-900/40">Start typing to search the CRM.</p>}
            {q && !hasResults && <p className="px-3 py-8 text-center text-sm text-navy-900/40">No results for "{query}".</p>}

            {matchedPlots.length > 0 && (
              <div className="mb-1">
                <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-navy-900/35">Plots</p>
                {matchedPlots.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => go(`/crm/inventory/${p.id}`)}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm hover:bg-cream-100"
                  >
                    <MapPinned className="h-4 w-4 text-navy-900/40" />
                    <span className="font-medium text-navy-900">{p.id}</span>
                    <span className="text-navy-900/45">Block {p.block} &middot; {p.status}</span>
                  </button>
                ))}
              </div>
            )}

            {matchedBuyers.length > 0 && (
              <div className="mb-1">
                <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-navy-900/35">Buyers</p>
                {matchedBuyers.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => go(`/crm/buyers/${b.id}`)}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm hover:bg-cream-100"
                  >
                    <User className="h-4 w-4 text-navy-900/40" />
                    <span className="font-medium text-navy-900">{b.name}</span>
                    <span className="text-navy-900/45">{b.id} &middot; {b.status}</span>
                  </button>
                ))}
              </div>
            )}

            {matchedPayments.length > 0 && (
              <div>
                <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-navy-900/35">Receipts</p>
                {matchedPayments.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => go('/crm/payments')}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm hover:bg-cream-100"
                  >
                    <Receipt className="h-4 w-4 text-navy-900/40" />
                    <span className="font-medium text-navy-900">{p.receiptNo}</span>
                    <span className="text-navy-900/45">{formatPKR(p.amount)} &middot; {p.status}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
