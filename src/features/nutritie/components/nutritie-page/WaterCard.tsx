import { Droplets } from 'lucide-react'
import { WaterBottle } from './WaterBottle'

interface Props {
  waterMl: number
  waterTarget: number
  onAdd: (ml: number) => void
}

export function WaterCard({ waterMl, waterTarget, onAdd }: Props) {
  const pct = Math.min((waterMl / waterTarget) * 100, 100)
  const quickAmounts = [150, 250, 500]

  return (
    <div className="bg-gray-900 rounded-2xl p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Droplets size={13} className="text-blue-400" />
          <span className="text-[11px] font-semibold text-white">Hidratare</span>
        </div>
        <span className="text-[10px] font-bold text-blue-400 tabular-nums">
          {waterMl}<span className="font-semibold">/{waterTarget}ml</span>
        </span>
      </div>
      <WaterBottle pct={pct} />
      <div className="grid grid-cols-3 gap-1">
        {quickAmounts.map((ml) => (
          <button
            key={ml}
            onClick={() => onAdd(ml)}
            className="py-2 rounded-xl bg-gray-800 hover:bg-blue-500/15 active:scale-95 text-blue-400 text-[11px] font-semibold transition-all"
          >
            +{ml}
          </button>
        ))}
      </div>
    </div>
  )
}
