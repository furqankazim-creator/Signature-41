import { useState } from 'react'
import { Wallet } from 'lucide-react'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Button, type ButtonProps } from '@/components/ui/button'
import { Input, Label, Select } from '@/components/ui/input'
import { useDataStore } from '@/store/dataStore'
import { useToast } from '@/components/ui/toast'
import { PAYMENT_METHODS } from '@/lib/constants'
import { formatDateLong, formatPKRFull } from '@/lib/format'
import type { PaymentMethod } from '@/types'

export function RecordPaymentDialog({ buyerId, buttonVariant = 'primary', buttonSize = 'default' }: { buyerId: string; buttonVariant?: ButtonProps['variant']; buttonSize?: ButtonProps['size'] }) {
  const buyer = useDataStore((s) => s.buyers.find((b) => b.id === buyerId))
  const recordPayment = useDataStore((s) => s.recordPayment)
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [method, setMethod] = useState<PaymentMethod>('Bank Transfer')

  const nextInstallment = buyer?.installments.find((i) => i.status !== 'paid')
  const [amount, setAmount] = useState(nextInstallment?.amount ?? 0)

  if (!buyer) return null
  const isComplete = !nextInstallment

  function handleOpenChange(next: boolean) {
    setOpen(next)
    if (next && nextInstallment) setAmount(nextInstallment.amount)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      const payment = await recordPayment({ buyerId, amount, method })
      if (payment) {
        toast({ variant: 'success', title: 'Payment recorded', description: `${payment.receiptNo} for ${formatPKRFull(payment.amount)}.` })
        setOpen(false)
      }
    } catch (err) {
      toast({ variant: 'info', title: 'Could not record payment', description: err instanceof Error ? err.message : 'Please try again.' })
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant={buttonVariant} size={buttonSize} disabled={isComplete}>
          <Wallet className="h-4 w-4" /> {isComplete ? 'Fully paid' : 'Record Payment'}
        </Button>
      </DialogTrigger>
      <DialogContent title="Record a payment" description={`Apply a payment to ${buyer.name}'s next installment.`}>
        {nextInstallment && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="rounded-xl bg-cream-200/60 p-4 text-sm">
              <p className="font-semibold text-navy-900">
                Installment #{nextInstallment.index + 1} &middot; due {formatDateLong(nextInstallment.dueDate)}
              </p>
              <p className="mt-0.5 text-navy-900/50">Scheduled amount: {formatPKRFull(nextInstallment.amount)}</p>
            </div>
            <div>
              <Label htmlFor="amount">Amount received (PKR)</Label>
              <Input id="amount" type="number" min={1} value={amount} onChange={(e) => setAmount(Number(e.target.value))} required />
            </div>
            <div>
              <Label htmlFor="method">Payment method</Label>
              <Select id="method" value={method} onChange={(e) => setMethod(e.target.value as PaymentMethod)}>
                {PAYMENT_METHODS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </Select>
            </div>
            <Button type="submit" className="w-full" size="lg">
              Confirm payment
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
