import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'
import type { PlotStatus } from '@/types'
import { formatNumber } from '@/lib/format'

const COLORS: Record<PlotStatus, string> = {
  Sold: '#c98a3e',
  Reserved: '#d9a05b',
  Available: '#4f9d6e',
  'On-Hold': '#94a3b8',
}

export function InventoryDonut({ breakdown, total }: { breakdown: Record<PlotStatus, number>; total: number }) {
  const data = (Object.keys(breakdown) as PlotStatus[]).map((status) => ({ name: status, value: breakdown[status] }))

  return (
    <div className="relative mx-auto h-64 w-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={78}
            outerRadius={110}
            paddingAngle={2}
            stroke="none"
            isAnimationActive={false}
          >
            {data.map((d) => (
              <Cell key={d.name} fill={COLORS[d.name]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-3xl font-semibold text-navy-900">{formatNumber(total)}</span>
        <span className="text-[10px] font-bold uppercase tracking-wider text-navy-900/40">Total plots</span>
      </div>
    </div>
  )
}

export { COLORS as INVENTORY_COLORS }
