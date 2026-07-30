import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input, Label, Select } from '@/components/ui/input'
import { useDataStore } from '@/store/dataStore'
import { useToast } from '@/components/ui/toast'
import { INSTALLMENT_PLANS } from '@/lib/constants'
import { formatPKRFull } from '@/lib/format'

interface RegisterBuyerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialPlotId?: string
}

export function RegisterBuyerDialog({ open, onOpenChange, initialPlotId }: RegisterBuyerDialogProps) {
  const navigate = useNavigate()
  const plots = useDataStore((s) => s.plots)
  const agents = useDataStore((s) => s.agents)
  const registerBuyer = useDataStore((s) => s.registerBuyer)
  const { toast } = useToast()

  const availablePlots = useMemo(() => plots.filter((p) => p.status === 'Available' || p.id === initialPlotId), [plots, initialPlotId])

  const [plotId, setPlotId] = useState(initialPlotId ?? availablePlots[0]?.id ?? '')
  const [name, setName] = useState('')
  const [cnic, setCnic] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [agentId, setAgentId] = useState(agents[0]?.id ?? '')
  const [installmentsTotal, setInstallmentsTotal] = useState(24)
  const [markAsSold, setMarkAsSold] = useState(true)

  useEffect(() => {
    if (open) {
      setPlotId(initialPlotId ?? availablePlots[0]?.id ?? '')
      setName('')
      setCnic('')
      setPhone('')
      setEmail('')
      setAgentId(agents[0]?.id ?? '')
      setInstallmentsTotal(24)
      setMarkAsSold(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialPlotId])

  const selectedPlot = plots.find((p) => p.id === plotId)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedPlot) return
    try {
      const buyer = await registerBuyer({ plotId, name, cnic, phone, email, agentId, installmentsTotal, markAsSold })
      toast({ variant: 'success', title: 'Buyer registered', description: `${buyer.name} was linked to ${plotId}.` })
      onOpenChange(false)
      navigate(`/crm/buyers/${buyer.id}`)
    } catch (err) {
      toast({ variant: 'info', title: 'Could not register buyer', description: err instanceof Error ? err.message : 'Please try again.' })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent title="Register a buyer" description="Link a new buyer to an available plot and generate their installment schedule." size="lg">
        {availablePlots.length === 0 ? (
          <p className="py-6 text-center text-sm text-navy-900/50">No available plots to assign right now.</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="plot">Plot</Label>
                <Select id="plot" value={plotId} onChange={(e) => setPlotId(e.target.value)} disabled={!!initialPlotId}>
                  {availablePlots.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.id} &middot; Block {p.block} &middot; {formatPKRFull(p.price)}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <Label htmlFor="agent">Agent</Label>
                <Select id="agent" value={agentId} onChange={(e) => setAgentId(e.target.value)}>
                  {agents.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} &middot; {a.agency}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="cnic">CNIC</Label>
                <Input id="cnic" placeholder="35201-1234567-1" value={cnic} onChange={(e) => setCnic(e.target.value)} required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" placeholder="0300-1234567" value={phone} onChange={(e) => setPhone(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="plan">Installment plan</Label>
                <Select id="plan" value={installmentsTotal} onChange={(e) => setInstallmentsTotal(Number(e.target.value))}>
                  {INSTALLMENT_PLANS.map((n) => (
                    <option key={n} value={n}>
                      {n} months
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <Label htmlFor="markAsSold">Plot status</Label>
                <Select id="markAsSold" value={markAsSold ? 'sold' : 'reserved'} onChange={(e) => setMarkAsSold(e.target.value === 'sold')}>
                  <option value="sold">Mark as Sold</option>
                  <option value="reserved">Mark as Reserved</option>
                </Select>
              </div>
            </div>

            {selectedPlot && (
              <p className="rounded-xl bg-cream-200/60 px-4 py-3 text-xs text-navy-900/60">
                Total value {formatPKRFull(selectedPlot.price)} across {installmentsTotal} monthly installments of{' '}
                {formatPKRFull(Math.round(selectedPlot.price / installmentsTotal))} each.
              </p>
            )}

            <Button type="submit" size="lg" className="w-full">
              Register buyer
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
