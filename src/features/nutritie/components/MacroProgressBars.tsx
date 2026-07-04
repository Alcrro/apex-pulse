interface MacroProgressBarsProps {
  proteinG: number
  carbsG: number
  fatG: number
  targetProteinG?: number
  targetCarbsG?: number
  targetFatG?: number
}

interface BarProps {
  label: string
  value: number
  target?: number
  color: string
}

function Bar({ label, value, target, color }: BarProps) {
  const pct = target ? Math.min((value / target) * 100, 100) : 0
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-gray-400 w-20 shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
        {target ? (
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, backgroundColor: color }}
          />
        ) : (
          <div className="h-full rounded-full bg-gray-700 w-full" />
        )}
      </div>
      <span className="text-xs text-white font-semibold w-20 text-right shrink-0">
        {value.toLocaleString('ro-RO', { maximumFractionDigits: 0 })}
        {target ? <span className="text-gray-500">/{target}g</span> : 'g'}
      </span>
    </div>
  )
}

export function MacroProgressBars({ proteinG, carbsG, fatG, targetProteinG, targetCarbsG, targetFatG }: MacroProgressBarsProps) {
  return (
    <div className="bg-gray-800 rounded-2xl p-4 space-y-3">
      <Bar label="Proteine"     value={Math.round(proteinG)} target={targetProteinG} color="#60a5fa" />
      <Bar label="Carbohidrați" value={Math.round(carbsG)}   target={targetCarbsG}   color="#facc15" />
      <Bar label="Grăsimi"      value={Math.round(fatG)}     target={targetFatG}     color="#f87171" />
    </div>
  )
}
