import { Area, AreaChart, CartesianGrid, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { RevenuePoint } from '@/lib/selectors'

export function RevenueChart({ data }: { data: RevenuePoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c98a3e" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#c98a3e" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="#0f1b3312" />
        <XAxis
          dataKey="month"
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#0f1b3366', fontSize: 12 }}
          dy={8}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#0f1b3366', fontSize: 12 }}
          tickFormatter={(v) => `${Math.round(v / 1_000_000)}`}
          width={40}
        />
        <Tooltip
          formatter={(value, name) => [`PKR ${(Number(value) / 1_000_000).toFixed(1)}M`, String(name)]}
          contentStyle={{
            borderRadius: 12,
            border: '1px solid #0f1b3314',
            fontSize: 12,
            boxShadow: '0 8px 24px rgba(15,27,51,0.12)',
          }}
        />
        <Area
          type="monotone"
          dataKey="revenue"
          name="Revenue"
          stroke="#c98a3e"
          strokeWidth={2.5}
          fill="url(#revenueFill)"
          isAnimationActive={false}
        />
        <Line
          type="monotone"
          dataKey="target"
          name="Target"
          stroke="#0f1b33"
          strokeWidth={1.5}
          strokeDasharray="4 4"
          dot={false}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
