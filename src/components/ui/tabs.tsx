import * as TabsPrimitive from '@radix-ui/react-tabs'
import { cn } from '@/lib/utils'

export const Tabs = TabsPrimitive.Root

export function TabsList({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      className={cn('inline-flex items-center gap-1 rounded-full bg-cream-200/70 p-1', className)}
      {...props}
    />
  )
}

export function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        'rounded-full px-4 py-2 text-[11px] font-bold uppercase tracking-wide text-navy-900/50 transition-colors data-[state=active]:bg-navy-900 data-[state=active]:text-cream-50',
        className
      )}
      {...props}
    />
  )
}

export const TabsContent = TabsPrimitive.Content
