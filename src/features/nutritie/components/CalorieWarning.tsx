import { useState } from 'react'
import { X, AlertTriangle } from 'lucide-react'

interface CalorieWarningProps {
  consumed: number
  target: number
  onDismiss?: () => void
}

export function CalorieWarning({ consumed, target, onDismiss }: CalorieWarningProps) {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed || target <= 0) return null

  const pct = consumed / target
  const isUnder = pct < 0.7
  const isOver = pct > 1.2

  if (!isUnder && !isOver) return null

  const diff = Math.abs(consumed - target)

  function handleDismiss() {
    setDismissed(true)
    onDismiss?.()
  }

  return (
    <div className={`rounded-2xl p-4 flex items-start gap-3 ${isOver ? 'bg-orange-500/10 border border-orange-500/20' : 'bg-yellow-500/10 border border-yellow-500/20'}`}>
      <AlertTriangle size={18} className={`shrink-0 mt-0.5 ${isOver ? 'text-orange-400' : 'text-yellow-400'}`} />
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold ${isOver ? 'text-orange-400' : 'text-yellow-400'}`}>
          {isOver ? 'Ai depășit targetul caloric' : 'Ai mâncat prea puțin azi'}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {isOver
            ? `+${diff.toLocaleString('ro-RO')} kcal față de target (${Math.round(pct * 100)}%)`
            : `Ai consumat doar ${Math.round(pct * 100)}% din target — mai ai ${diff.toLocaleString('ro-RO')} kcal`
          }
        </p>
      </div>
      <button
        onClick={handleDismiss}
        className="text-gray-500 hover:text-white transition-colors shrink-0"
      >
        <X size={16} />
      </button>
    </div>
  )
}
