import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Download, Search as SearchIcon, SlidersHorizontal, MapPin } from 'lucide-react'
import Topbar from '@/components/layout/Topbar'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input, Select } from '@/components/ui/input'
import { AddPlotDialog } from '@/components/crm/AddPlotDialog'
import { useDataStore } from '@/store/dataStore'
import { BLOCKS, PLOT_STATUS_COLOR } from '@/lib/constants'
import { formatPKRFull, formatNumber } from '@/lib/format'
import { downloadCsv } from '@/lib/csv'
import { useToast } from '@/components/ui/toast'
import { cn } from '@/lib/utils'
import type { Block, PlotStatus } from '@/types'

const STATUS_TABS: (PlotStatus | 'All')[] = ['All', 'Available', 'Reserved', 'Sold', 'On-Hold']
const PAGE_SIZE = 24

export default function Inventory() {
  const navigate = useNavigate()
  const plots = useDataStore((s) => s.plots)
  const { toast } = useToast()

  const [statusFilter, setStatusFilter] = useState<PlotStatus | 'All'>('All')
  const [blockFilter, setBlockFilter] = useState<Block | 'All'>('All')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return plots.filter((p) => {
      if (statusFilter !== 'All' && p.status !== statusFilter) return false
      if (blockFilter !== 'All' && p.block !== blockFilter) return false
      if (q && !(p.id.toLowerCase().includes(q) || `block ${p.block} ${p.plotNo}`.toLowerCase().includes(q))) return false
      return true
    })
  }, [plots, statusFilter, blockFilter, query])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function updateFilter<T>(setter: (v: T) => void, value: T) {
    setter(value)
    setPage(1)
  }

  function handleExport() {
    downloadCsv(
      `signature41-plots-${Date.now()}.csv`,
      filtered.map((p) => ({
        id: p.id,
        block: p.block,
        plotNo: p.plotNo,
        type: p.type,
        sizeSqYd: p.sizeSqYd,
        category: p.category,
        price: p.price,
        status: p.status,
        amenities: p.amenities.join('; '),
      }))
    )
    toast({ variant: 'info', title: 'Export ready', description: `${filtered.length} plots exported to CSV.` })
  }

  return (
    <div>
      <Topbar title="Plot Inventory" subtitle={`${formatNumber(filtered.length)} plots match filters`} primaryAction={<AddPlotDialog />} />

      <main className="space-y-5 p-6 sm:p-8">
        <Card className="flex flex-col gap-4 p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1 lg:max-w-xs">
            <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-900/35" />
            <Input
              placeholder="Search plot no, block, ID..."
              className="pl-10"
              value={query}
              onChange={(e) => updateFilter(setQuery, e.target.value)}
            />
          </div>

          <div className="inline-flex flex-wrap items-center gap-1 rounded-full bg-cream-200/70 p-1">
            {STATUS_TABS.map((s) => (
              <button
                key={s}
                onClick={() => updateFilter(setStatusFilter, s)}
                className={cn(
                  'rounded-full px-4 py-2 text-[11px] font-bold uppercase tracking-wide text-navy-900/50 transition-colors',
                  statusFilter === s && 'bg-navy-900 text-cream-50'
                )}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Select
              className="w-40"
              value={blockFilter}
              onChange={(e) => updateFilter(setBlockFilter, e.target.value as Block | 'All')}
            >
              <option value="All">All Blocks</option>
              {BLOCKS.map((b) => (
                <option key={b} value={b}>
                  Block {b}
                </option>
              ))}
            </Select>
            <Button variant="outline" size="sm" onClick={() => toast({ variant: 'info', title: 'Filter saved', description: 'This view has been added to your saved filters.' })}>
              <SlidersHorizontal className="h-4 w-4" /> Saved filters
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4" /> Export CSV
            </Button>
          </div>
        </Card>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {paged.map((plot) => {
            const color = PLOT_STATUS_COLOR[plot.status]
            return (
              <Card key={plot.id} className="flex flex-col p-5">
                <button onClick={() => navigate(`/crm/inventory/${plot.id}`)} className="flex-1 text-left">
                  <div className="mb-3 flex items-start justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-navy-900/40">{plot.id}</span>
                    <Badge className={cn(color.bg, color.text)}>{plot.status}</Badge>
                  </div>
                  <p className="font-display text-lg font-semibold text-navy-900">
                    Block {plot.block} &middot; {String(plot.plotNo).padStart(3, '0')}
                  </p>
                  <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <p className="font-bold uppercase tracking-wider text-navy-900/35">Type</p>
                      <p className="mt-0.5 font-medium text-navy-900">{plot.type}</p>
                    </div>
                    <div>
                      <p className="font-bold uppercase tracking-wider text-navy-900/35">Size</p>
                      <p className="mt-0.5 font-medium text-navy-900">{plot.sizeSqYd} sq yd</p>
                    </div>
                    <div>
                      <p className="font-bold uppercase tracking-wider text-navy-900/35">Category</p>
                      <p className="mt-0.5 font-medium text-navy-900">Cat. {plot.category}</p>
                    </div>
                    <div>
                      <p className="font-bold uppercase tracking-wider text-navy-900/35">Price</p>
                      <p className="mt-0.5 font-medium text-navy-900">{formatPKRFull(plot.price)}</p>
                    </div>
                  </div>
                  {plot.amenities.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {plot.amenities.map((a) => (
                        <span key={a} className="rounded-full bg-cream-200 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-navy-900/50">
                          {a}
                        </span>
                      ))}
                    </div>
                  )}
                </button>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4 w-full"
                  onClick={() => navigate(`/crm/site-map?block=${plot.block}`)}
                >
                  <MapPin className="h-3.5 w-3.5" /> View on map
                </Button>
              </Card>
            )
          })}
        </div>

        {filtered.length === 0 && (
          <Card className="p-12 text-center text-sm text-navy-900/45">No plots match the current filters.</Card>
        )}

        {pageCount > 1 && (
          <div className="flex items-center justify-center gap-2">
            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
              Previous
            </Button>
            <span className="text-xs font-semibold text-navy-900/50">
              Page {page} of {pageCount}
            </span>
            <Button variant="outline" size="sm" disabled={page === pageCount} onClick={() => setPage((p) => p + 1)}>
              Next
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
