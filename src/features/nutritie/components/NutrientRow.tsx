import { DZR } from '../utils/nutrientTable'

interface NutrientRowProps {
  nutrientKey: string
  value: number | undefined
}

export function NutrientRow({ nutrientKey, value }: NutrientRowProps) {
  const meta = DZR[nutrientKey]
  if (!meta) return null

  const hasValue = value !== undefined && value > 0
  const pct = hasValue ? Math.round((value! / meta.dzr) * 100) : 0
  const capped = Math.min(pct, 100)
  const barColor = pct >= 100 ? 'bg-blue-400' : pct >= 50 ? 'bg-orange-400' : 'bg-green-400'
  const pctColor = pct >= 100 ? 'text-blue-400' : pct >= 50 ? 'text-orange-400' : 'text-green-400'

  return (
    <div className="flex items-center gap-3 py-2 border-b border-gray-800/60 last:border-0">
      <span className="text-xs text-gray-300 w-28 shrink-0">{meta.label}</span>
      <span className="text-xs text-white font-semibold w-20 shrink-0 text-right">
        {hasValue ? `${value!.toFixed(1)} ${meta.unit}` : '—'}
      </span>
      <div className="flex-1 flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
          {hasValue && <div className={`h-full rounded-full ${barColor}`} style={{ width: `${capped}%` }} />}
        </div>
        <span className={`text-[10px] w-8 text-right shrink-0 ${hasValue ? pctColor : 'text-gray-600'}`}>
          {hasValue ? `${pct}%` : '—'}
        </span>
      </div>
    </div>
  )
}
