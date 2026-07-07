import { AMINO_LABELS } from '../utils/aminoAcids'

interface AminoRowProps {
  name: string
  value: number
  maxValue: number
}

export function AminoRow({ name, value, maxValue }: AminoRowProps) {
  const pct = maxValue > 0 ? Math.min((value / maxValue) * 100, 100) : 0
  return (
    <div className="flex items-center gap-3 py-1.5">
      <span className="text-xs text-gray-300 w-28 shrink-0">{AMINO_LABELS[name] ?? name}</span>
      <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
        <div className="h-full rounded-full bg-purple-400" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-white font-semibold w-16 text-right shrink-0">
        {value.toFixed(1)} mg
      </span>
    </div>
  )
}
