import { cn } from '@/lib/utils'

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('rounded-2xl border border-navy-900/8 bg-white shadow-[0_1px_2px_rgba(15,27,51,0.04)]', className)}
      {...props}
    />
  )
}

export function CardLabel({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn('text-[11px] font-bold uppercase tracking-wider text-navy-900/40', className)} {...props} />
}
