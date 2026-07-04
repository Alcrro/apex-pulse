const R = 10
const CIRC = 2 * Math.PI * R

interface MacroRowProps {
  label: string
  value: number
  target?: number
  color: string
}

function MacroRow({ label, value, target, color }: MacroRowProps) {
  const pct = target ? Math.min(value / target, 1) : 0
  const offset = CIRC * (1 - pct)

  return (
    <div className="flex items-center gap-2.5">
      <div className="relative w-6 h-6 shrink-0">
        <svg width={24} height={24} viewBox="0 0 24 24">
          <circle cx={12} cy={12} r={R} fill="none" stroke="#0f1117" strokeWidth={3.5} />
          <circle
            cx={12} cy={12} r={R}
            fill="none"
            stroke={color}
            strokeWidth={3.5}
            strokeLinecap="round"
            strokeDasharray={CIRC}
            strokeDashoffset={offset}
            transform="rotate(-90 12 12)"
            style={{ transition: 'stroke-dashoffset 0.6s ease' }}
          />
        </svg>
      </div>
      <div className="flex flex-col">
        <span className="text-[10px] text-gray-500 leading-none">{label}</span>
        <span className="text-xs font-bold text-white leading-tight">
          {Math.round(value)}
          {target && <span className="text-gray-500 font-normal">/{target}g</span>}
          {!target && 'g'}
        </span>
      </div>
    </div>
  )
}

interface MacroCirclesProps {
  proteinG: number
  carbsG: number
  fatG: number
  targetProteinG?: number
  targetCarbsG?: number
  targetFatG?: number
}

export function MacroCircles({ proteinG, carbsG, fatG, targetProteinG, targetCarbsG, targetFatG }: MacroCirclesProps) {
  return (
    <div className="flex flex-col justify-center gap-3 flex-1">
      <MacroRow label="Proteine"  value={proteinG} target={targetProteinG} color="#60a5fa" />
      <MacroRow label="Carbohidr" value={carbsG}   target={targetCarbsG}   color="#facc15" />
      <MacroRow label="Grăsimi"   value={fatG}     target={targetFatG}     color="#f87171" />
    </div>
  )
}
