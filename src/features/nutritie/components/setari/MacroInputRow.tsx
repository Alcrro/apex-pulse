export function MacroInputRow({
  label, color, value, grams, onChange,
}: {
  label: string
  color: string
  value: number
  grams: number
  onChange: (v: number) => void
}) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-800 last:border-0">
      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
      <span className="text-sm text-white flex-1">{label}</span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(Math.max(5, value - 5))}
          className="w-7 h-7 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold text-base flex items-center justify-center transition-colors active:scale-95"
        >−</button>
        <span className="w-10 text-center text-sm font-bold text-white tabular-nums">{value}%</span>
        <button
          onClick={() => onChange(Math.min(90, value + 5))}
          className="w-7 h-7 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold text-base flex items-center justify-center transition-colors active:scale-95"
        >+</button>
      </div>
      <span className="text-sm font-bold w-14 text-right tabular-nums" style={{ color }}>{grams}g</span>
    </div>
  )
}
