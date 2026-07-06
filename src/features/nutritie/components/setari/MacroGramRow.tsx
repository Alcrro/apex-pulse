export function MacroGramRow({
  label, color, value, pct, kcal, onChange,
}: {
  label: string
  color: string
  value: string
  pct: number
  kcal: number
  onChange: (v: string) => void
}) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-800 last:border-0">
      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
      <span className="text-sm text-white flex-1">{label}</span>
      <div className="flex items-center bg-gray-800 rounded-lg px-3 py-1.5">
        <input
          type="number"
          min={0}
          max={2000}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-16 bg-transparent text-white text-sm font-bold text-right outline-none tabular-nums"
          placeholder="0"
          inputMode="numeric"
        />
        <span className="text-xs text-gray-500 ml-1">g</span>
      </div>
      <div className="text-right w-20">
        <span className="text-xs text-gray-500 tabular-nums">{pct}%</span>
        <span className="text-xs text-gray-600 ml-1">·</span>
        <span className="text-xs tabular-nums ml-1" style={{ color }}>{kcal} kcal</span>
      </div>
    </div>
  )
}
