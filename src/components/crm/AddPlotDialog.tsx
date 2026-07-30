import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input, Label, Select } from '@/components/ui/input'
import { useDataStore } from '@/store/dataStore'
import { useToast } from '@/components/ui/toast'
import { BLOCKS, PLOT_TYPES, PLOT_CATEGORIES, PLOT_STATUSES, AMENITIES } from '@/lib/constants'
import type { Amenity, Block, PlotCategory, PlotStatus, PlotType } from '@/types'

export function AddPlotDialog() {
  const addPlot = useDataStore((s) => s.addPlot)
  const { toast } = useToast()
  const [open, setOpen] = useState(false)

  const [block, setBlock] = useState<Block>('A')
  const [type, setType] = useState<PlotType>('Residential')
  const [category, setCategory] = useState<PlotCategory>('B')
  const [status, setStatus] = useState<PlotStatus>('Available')
  const [sizeSqYd, setSizeSqYd] = useState(200)
  const [price, setPrice] = useState(2_000_000)
  const [amenities, setAmenities] = useState<Amenity[]>([])

  function toggleAmenity(a: Amenity) {
    setAmenities((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      const plot = await addPlot({ block, type, category, status, sizeSqYd, price, amenities })
      toast({ variant: 'success', title: 'Plot added', description: `${plot.id} was created in Block ${block}.` })
      setOpen(false)
      setAmenities([])
    } catch (err) {
      toast({ variant: 'info', title: 'Could not add plot', description: err instanceof Error ? err.message : 'Please try again.' })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4" /> Add Plot
        </Button>
      </DialogTrigger>
      <DialogContent title="Add a new plot" description="Create a plot record in the inventory.">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="block">Block</Label>
              <Select id="block" value={block} onChange={(e) => setBlock(e.target.value as Block)}>
                {BLOCKS.map((b) => (
                  <option key={b} value={b}>
                    Block {b}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="type">Type</Label>
              <Select id="type" value={type} onChange={(e) => setType(e.target.value as PlotType)}>
                {PLOT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="size">Size (sq yd)</Label>
              <Input id="size" type="number" min={40} value={sizeSqYd} onChange={(e) => setSizeSqYd(Number(e.target.value))} required />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select id="category" value={category} onChange={(e) => setCategory(e.target.value as PlotCategory)}>
                {PLOT_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    Cat. {c}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price (PKR)</Label>
              <Input id="price" type="number" min={0} step={10000} value={price} onChange={(e) => setPrice(Number(e.target.value))} required />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select id="status" value={status} onChange={(e) => setStatus(e.target.value as PlotStatus)}>
                {PLOT_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div>
            <Label>Amenities</Label>
            <div className="flex flex-wrap gap-2">
              {AMENITIES.map((a) => (
                <button
                  type="button"
                  key={a}
                  onClick={() => toggleAmenity(a)}
                  className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
                    amenities.includes(a)
                      ? 'border-gold-500 bg-gold-500/10 text-gold-700'
                      : 'border-navy-900/12 text-navy-900/50 hover:border-navy-900/25'
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full" size="lg">
            Create plot
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
