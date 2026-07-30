import { TrendingDown, TrendingUp } from 'lucide-react'
import { Card, CardLabel } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface StatCardProps {
  label: string
  value: React.ReactNode
  trend?: { label: string; direction: 'up' | 'down' }
  valueClassName?: string
  extra?: React.ReactNode
}

export function StatCard({ label, value, trend, valueClassName, extra }: StatCardProps) {
  return (
    <Card className="p-5">
      <CardLabel>{label}</CardLabel>
      <p className={cn('mt-2 font-display text-[1.65rem] font-semibold text-navy-900', valueClassName)}>{value}</p>
      {trend && (
        <p
          className={cn(
            'mt-1.5 flex items-center gap-1 text-xs font-semibold',
            trend.direction === 'up' ? 'text-sage-600' : 'text-rose-500'
          )}
        >
          {trend.direction === 'up' ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
          {trend.label}
        </p>
      )}
      {extra}
    </Card>
  )
}
