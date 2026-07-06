interface Props {
  label: string
  value: number
  target?: number
  color: string
}

export function MacroBar({ label, value, target, color }: Props) {
  const pct = target ? Math.min((value / target) * 100, 100) : 0
  const over = target ? value > target : false
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-semibold" style={{ color }}>{label}</span>
        <span className="text-sm font-bold tabular-nums" style={{ color }}>
          {Math.round(value)}
          <span className="font-bold text-white"> / {target ?? '—'}g</span>
        </span>
      </div>
      <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: over ? '#ef4444' : color }}
        />
      </div>
    </div>
  )
}
