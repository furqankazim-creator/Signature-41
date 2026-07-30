import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

export const Dialog = DialogPrimitive.Root
export const DialogTrigger = DialogPrimitive.Trigger

export function DialogContent({
  className,
  children,
  title,
  description,
  size = 'default',
}: {
  className?: string
  children: React.ReactNode
  title: string
  description?: string
  size?: 'default' | 'lg'
}) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-navy-950/50 backdrop-blur-[2px] data-[state=open]:animate-fade-in" />
      <DialogPrimitive.Content
        className={cn(
          'fixed left-1/2 top-1/2 z-50 max-h-[88vh] w-[92vw] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl bg-cream-50 p-6 shadow-2xl outline-none data-[state=open]:animate-slide-up sm:p-8',
          size === 'lg' ? 'max-w-2xl' : 'max-w-md',
          className
        )}
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <DialogPrimitive.Title className="font-display text-xl font-semibold text-navy-900">
              {title}
            </DialogPrimitive.Title>
            {description && (
              <DialogPrimitive.Description className="mt-1 text-sm text-navy-900/60">
                {description}
              </DialogPrimitive.Description>
            )}
          </div>
          <DialogPrimitive.Close className="rounded-full p-1.5 text-navy-900/50 transition hover:bg-navy-900/5 hover:text-navy-900">
            <X className="h-4 w-4" />
          </DialogPrimitive.Close>
        </div>
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
}

export const DialogClose = DialogPrimitive.Close
