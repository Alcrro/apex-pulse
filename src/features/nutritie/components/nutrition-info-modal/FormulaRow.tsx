interface Props {
  color: string
  label: string
  pct: number
  kcal: number
  divisor: number
  grams: number
}

export function FormulaRow({ color, label, pct, kcal, divisor, grams }: Props) {
  return (
    <div className="bg-gray-800/60 rounded-xl p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
          <span className="text-sm font-semibold text-white">{label}</span>
          <span className="text-xs text-gray-500 bg-gray-800 px-1.5 py-0.5 rounded-full">{pct}%</span>
        </div>
        <span className="text-sm font-black" style={{ color }}>{grams}g</span>
      </div>
      <p className="text-[11px] text-gray-500 font-mono">
        {kcal} kcal × {pct}% ÷ {divisor} kcal/g = <span className="text-gray-300 font-semibold">{grams}g</span>
      </p>
    </div>
  )
}
