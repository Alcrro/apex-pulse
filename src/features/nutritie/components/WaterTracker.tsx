import { Droplets } from 'lucide-react'

interface WaterTrackerProps {
  waterMl: number
  targetMl: number
  onAdd: (ml: number) => void
}

export function WaterTracker({ waterMl, targetMl, onAdd }: WaterTrackerProps) {
  const pct = Math.min((waterMl / targetMl) * 100, 100)

  return (
    <div className="bg-gray-800 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Droplets size={16} className="text-blue-400" />
          <span className="text-sm font-semibold text-white">Apă</span>
        </div>
        <span className="text-xs text-gray-400">
          {waterMl} / {targetMl} ml
        </span>
      </div>

      <div className="h-2 bg-gray-700 rounded-full overflow-hidden mb-3">
        <div
          className="h-full bg-blue-400 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="flex gap-2">
        {[150, 250, 500].map((ml) => (
          <button
            key={ml}
            onClick={() => onAdd(ml)}
            className="flex-1 py-1.5 rounded-xl bg-gray-700 hover:bg-blue-500/20 text-blue-400 text-xs font-semibold transition-colors"
          >
            +{ml} ml
          </button>
        ))}
      </div>
    </div>
  )
}
