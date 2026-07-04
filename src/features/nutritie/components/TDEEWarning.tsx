import { AlertTriangle } from 'lucide-react'
import { useNutritionTarget } from '../hooks/useNutritionTarget'

export function TDEEWarning() {
  const { goals } = useNutritionTarget()

  if (!(goals as any)?.tdeeWarning) return null

  return (
    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-4 flex items-start gap-3">
      <AlertTriangle size={18} className="text-yellow-400 shrink-0 mt-0.5" />
      <p className="text-xs text-yellow-300 leading-relaxed">
        Calculul TDEE poate fi imprecis din cauza variațiilor mari de greutate.
        Încearcă să loghezi greutatea zilnic pentru o estimare mai precisă.
      </p>
    </div>
  )
}
