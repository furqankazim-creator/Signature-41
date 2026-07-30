import { useNavigate, useParams, Link } from 'react-router-dom'
import { ArrowLeft, MapPin, QrCode, Trash2, UserPlus } from 'lucide-react'
import Topbar from '@/components/layout/Topbar'
import { Card, CardLabel } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/input'
import { InstallmentTable } from '@/components/crm/InstallmentTable'
import { RecordPaymentDialog } from '@/components/crm/RecordPaymentDialog'
import { useDataStore } from '@/store/dataStore'
import { useToast } from '@/components/ui/toast'
import { PLOT_STATUS_COLOR, PLOT_STATUSES, BUYER_STATUS_COLOR } from '@/lib/constants'
import { formatPKRFull, formatDate } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { PlotStatus } from '@/types'

export default function PlotDetail() {
  const { plotId } = useParams<{ plotId: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const plot = useDataStore((s) => s.plots.find((p) => p.id === plotId))
  const buyer = useDataStore((s) => s.buyers.find((b) => b.plotId === plotId))
  const updatePlotStatus = useDataStore((s) => s.updatePlotStatus)
  const deletePlot = useDataStore((s) => s.deletePlot)

  if (!plot) {
    return (
      <div>
        <Topbar title="Plot not found" />
        <main className="p-8">
          <Card className="p-10 text-center text-sm text-navy-900/50">
            This plot doesn't exist.{' '}
            <Link to="/crm/inventory" className="font-semibold text-gold-600">
              Back to inventory
            </Link>
          </Card>
        </main>
      </div>
    )
  }

  const color = PLOT_STATUS_COLOR[plot.status]

  async function handleStatusChange(status: PlotStatus) {
    if (!plot) return
    try {
      await updatePlotStatus(plot.id, status)
      toast({ variant: 'success', title: 'Status updated', description: `${plot.id} is now marked ${status}.` })
    } catch (err) {
      toast({ variant: 'info', title: 'Could not update status', description: err instanceof Error ? err.message : 'Please try again.' })
    }
  }

  async function handleDelete() {
    if (!plot) return
    if (!confirm(`Delete ${plot.id}? This cannot be undone.`)) return
    try {
      await deletePlot(plot.id)
      toast({ variant: 'info', title: 'Plot deleted', description: `${plot.id} was removed from inventory.` })
      navigate('/crm/inventory')
    } catch (err) {
      toast({ variant: 'info', title: 'Could not delete plot', description: err instanceof Error ? err.message : 'Please try again.' })
    }
  }

  return (
    <div>
      <Topbar title={plot.id} subtitle={`Block ${plot.block} · ${String(plot.plotNo).padStart(3, '0')}`} />

      <main className="space-y-6 p-6 sm:p-8">
        <button
          onClick={() => navigate('/crm/inventory')}
          className="flex items-center gap-1.5 text-sm font-semibold text-navy-900/50 hover:text-navy-900"
        >
          <ArrowLeft className="h-4 w-4" /> Back to inventory
        </button>

        <div className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
          <Card className="p-6">
            <div className="mb-5 flex items-start justify-between">
              <div>
                <p className="font-display text-2xl font-semibold text-navy-900">
                  Block {plot.block} &middot; Plot {String(plot.plotNo).padStart(3, '0')}
                </p>
                <p className="mt-1 text-sm text-navy-900/50">{plot.id}</p>
              </div>
              <Badge className={cn(color.bg, color.text)}>{plot.status}</Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div>
                <CardLabel>Type</CardLabel>
                <p className="mt-1 text-sm font-semibold text-navy-900">{plot.type}</p>
              </div>
              <div>
                <CardLabel>Size</CardLabel>
                <p className="mt-1 text-sm font-semibold text-navy-900">{plot.sizeSqYd} sq yd</p>
              </div>
              <div>
                <CardLabel>Category</CardLabel>
                <p className="mt-1 text-sm font-semibold text-navy-900">Cat. {plot.category}</p>
              </div>
              <div>
                <CardLabel>Price</CardLabel>
                <p className="mt-1 text-sm font-semibold text-navy-900">{formatPKRFull(plot.price)}</p>
              </div>
              <div className="col-span-2">
                <CardLabel>Amenities</CardLabel>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {plot.amenities.length === 0 && <span className="text-sm text-navy-900/40">None listed</span>}
                  {plot.amenities.map((a) => (
                    <span key={a} className="rounded-full bg-cream-200 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-navy-900/50">
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-navy-900/8 pt-5">
              <div className="flex-1">
                <CardLabel>Update status</CardLabel>
                <Select className="mt-1.5" value={plot.status} onChange={(e) => handleStatusChange(e.target.value as PlotStatus)}>
                  {PLOT_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </Select>
              </div>
              <Button variant="outline" onClick={() => navigate(`/crm/site-map?block=${plot.block}`)}>
                <MapPin className="h-4 w-4" /> View on map
              </Button>
              {!plot.buyerId && (
                <Button variant="destructive" onClick={handleDelete}>
                  <Trash2 className="h-4 w-4" /> Delete
                </Button>
              )}
            </div>
          </Card>

          <Card className="p-6 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-navy-900">
              <QrCode className="h-6 w-6 text-gold-400" />
            </span>
            <p className="mt-4 text-sm font-semibold text-navy-900">Ownership QR</p>
            <p className="mt-1 text-xs leading-relaxed text-navy-900/50">
              Scan on-site to verify {plot.id} ownership and current payment status.
            </p>
          </Card>
        </div>

        <Card className="p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-navy-900">Ownership</h2>
            {!buyer && (
              <Button size="sm" onClick={() => navigate(`/crm/buyers?new=1&plotId=${plot.id}`)}>
                <UserPlus className="h-4 w-4" /> Register buyer
              </Button>
            )}
          </div>

          {!buyer && <p className="py-6 text-center text-sm text-navy-900/45">No buyer is linked to this plot yet.</p>}

          {buyer && (
            <>
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-cream-200/50 p-4">
                <div>
                  <Link to={`/crm/buyers/${buyer.id}`} className="font-semibold text-navy-900 hover:text-gold-600">
                    {buyer.name}
                  </Link>
                  <p className="text-xs text-navy-900/50">
                    {buyer.id} &middot; registered {formatDate(buyer.registeredAt)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={cn(BUYER_STATUS_COLOR[buyer.status].bg, BUYER_STATUS_COLOR[buyer.status].text)}>
                    {buyer.status}
                  </Badge>
                  <RecordPaymentDialog buyerId={buyer.id} buttonSize="sm" />
                </div>
              </div>
              <InstallmentTable installments={buyer.installments} />
            </>
          )}
        </Card>
      </main>
    </div>
  )
}
