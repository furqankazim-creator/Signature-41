import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { QrCode } from 'lucide-react'
import Topbar from '@/components/layout/Topbar'
import { Card, CardLabel } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { useDataStore } from '@/store/dataStore'
import { BLOCKS, PLOT_STATUS_COLOR, PROJECT } from '@/lib/constants'
import type { Block, PlotStatus } from '@/types'

const LEGEND: { status: PlotStatus; label: string }[] = [
  { status: 'Available', label: 'Available' },
  { status: 'Reserved', label: 'Reserved' },
  { status: 'Sold', label: 'Sold' },
  { status: 'On-Hold', label: 'On Hold' },
]

export default function SiteMap() {
  const navigate = useNavigate()
  const plots = useDataStore((s) => s.plots)
  const [searchParams] = useSearchParams()
  const initialBlock = (searchParams.get('block') as Block | null) ?? 'A'
  const [activeBlock, setActiveBlock] = useState<Block>(BLOCKS.includes(initialBlock) ? initialBlock : 'A')

  const blockPlots = useMemo(
    () => plots.filter((p) => p.block === activeBlock).sort((a, b) => a.plotNo - b.plotNo),
    [plots, activeBlock]
  )

  const blockStats = useMemo(
    () =>
      BLOCKS.map((block) => {
        const inBlock = plots.filter((p) => p.block === block)
        const sold = inBlock.filter((p) => p.status === 'Sold').length
        return { block, sold, total: inBlock.length }
      }),
    [plots]
  )

  return (
    <div>
      <Topbar title="Interactive Site Plan" subtitle={`${PROJECT.name} · Phase I`} />

      <main className="grid gap-6 p-6 sm:p-8 xl:grid-cols-[1fr_320px]">
        <Card className="p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-lg font-semibold text-navy-900">
                Block <span className="text-gold-600">{activeBlock}</span>
              </h2>
              <p className="text-xs text-navy-900/50">Click a plot to open its full ownership detail page.</p>
            </div>
            <div className="inline-flex flex-wrap items-center gap-1 rounded-full bg-cream-200/70 p-1">
              {BLOCKS.map((block) => (
                <button
                  key={block}
                  onClick={() => setActiveBlock(block)}
                  className={cn(
                    'rounded-full px-4 py-2 text-[11px] font-bold uppercase tracking-wide text-navy-900/50 transition-colors',
                    activeBlock === block && 'bg-navy-900 text-cream-50'
                  )}
                >
                  Block {block}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-[repeat(20,minmax(0,1fr))] gap-1.5">
            {blockPlots.map((plot) => {
              const color = PLOT_STATUS_COLOR[plot.status]
              return (
                <button
                  key={plot.id}
                  title={`${plot.id} · ${plot.status}`}
                  onClick={() => navigate(`/crm/inventory/${plot.id}`)}
                  className={cn(
                    'flex aspect-square items-center justify-center rounded-md text-[8px] font-bold transition hover:scale-110 hover:shadow-md',
                    color.bg,
                    color.text
                  )}
                >
                  {String(plot.plotNo).padStart(3, '0')}
                </button>
              )
            })}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-5 border-t border-navy-900/8 pt-5">
            {LEGEND.map((l) => (
              <span key={l.status} className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-navy-900/50">
                <span className={cn('h-2.5 w-2.5 rounded-full', PLOT_STATUS_COLOR[l.status].dot)} />
                {l.label}
              </span>
            ))}
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-6">
            <CardLabel>Block occupancy</CardLabel>
            <div className="mt-4 space-y-4">
              {blockStats.map(({ block, sold, total }) => {
                const pct = Math.round((sold / total) * 100)
                return (
                  <button
                    key={block}
                    onClick={() => setActiveBlock(block)}
                    className={cn(
                      'w-full rounded-xl border p-3.5 text-left transition',
                      activeBlock === block ? 'border-gold-500/40 bg-gold-500/5' : 'border-navy-900/8 hover:border-navy-900/15'
                    )}
                  >
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="font-semibold text-navy-900">Block {block}</span>
                      <span className="text-navy-900/50">
                        {sold}/{total} &middot; {pct}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-cream-200">
                      <div className="h-full rounded-full bg-gold-500" style={{ width: `${pct}%` }} />
                    </div>
                  </button>
                )
              })}
            </div>
          </Card>

          <Card className="p-6 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-navy-900">
              <QrCode className="h-6 w-6 text-gold-400" />
            </span>
            <p className="mt-4 text-sm font-semibold text-navy-900">Ownership verification</p>
            <p className="mt-1 text-xs leading-relaxed text-navy-900/50">
              Select a plot to open its full detail page with buyer, installment, and QR verification info.
            </p>
          </Card>
        </div>
      </main>
    </div>
  )
}
