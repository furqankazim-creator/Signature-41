import { useState } from 'react'
import { MessageSquare } from 'lucide-react'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label, Textarea } from '@/components/ui/input'
import { useToast } from '@/components/ui/toast'

export function BulkMessageDialog({ recipientCount }: { recipientCount: number }) {
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    toast({ variant: 'success', title: 'Message queued', description: `Sent to ${recipientCount} buyer${recipientCount === 1 ? '' : 's'}.` })
    setMessage('')
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <MessageSquare className="h-4 w-4" /> Bulk message
        </Button>
      </DialogTrigger>
      <DialogContent title="Bulk message" description={`This message will be sent to ${recipientCount} buyer${recipientCount === 1 ? '' : 's'} currently in view.`}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              rows={5}
              placeholder="Reminder: your next installment is due soon..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>
          <Button type="submit" size="lg" className="w-full">
            Send message
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
