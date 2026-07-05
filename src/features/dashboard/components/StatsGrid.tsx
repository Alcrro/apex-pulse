interface StatsGridProps {
  weeklyCount: number
  totalCount: number
  plansCount: number
}

function StatCard({ value, label }: { value: number; label: string }) {
  return (
    <div className="bg-gray-900 rounded-xl p-4 text-center">
      <div
        className="font-black text-forge-gold leading-none tabular-nums"
        style={{ fontSize: '2.5rem', letterSpacing: '-0.03em' }}
      >
        {value}
      </div>
      <div
        className="text-forge-muted font-semibold tracking-widest uppercase mt-2"
        style={{ fontSize: '0.58rem' }}
      >
        {label}
      </div>
    </div>
  )
}

export function StatsGrid({ weeklyCount, totalCount, plansCount }: StatsGridProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      <StatCard value={weeklyCount} label="Sesiuni săpt." />
      <StatCard value={totalCount} label="Total" />
      <StatCard value={plansCount} label="Planuri" />
    </div>
  )
}
