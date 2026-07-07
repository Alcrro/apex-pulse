import { MacroRow } from './MacroRow'

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
