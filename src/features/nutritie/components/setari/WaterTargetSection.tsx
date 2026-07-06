import { Droplets } from 'lucide-react'
import { useWaterTargetSection } from '../../stores/nutritieSetariStore'
import { SectionHeader } from './SectionHeader'
import { SavedBadge } from './SavedBadge'

const WATER_OPTIONS = [1500, 2000, 2500, 3000]

export function WaterTargetSection() {
  const { waterTarget, waterSaved, setWaterTarget, saveWater } = useWaterTargetSection()

  return (
    <section className="bg-gray-900 rounded-2xl p-4">
      <SectionHeader icon={<Droplets size={16} className="text-blue-400" />} title="Target hidratare zilnic" />

      <div className="grid grid-cols-4 gap-2 mb-4">
        {WATER_OPTIONS.map((ml) => (
          <button
            key={ml}
            onClick={() => setWaterTarget(ml)}
            className={`py-3 rounded-xl text-sm font-bold transition-all active:scale-95 ${
              waterTarget === ml
                ? 'bg-blue-500/20 border border-blue-500/60 text-blue-400'
                : 'bg-gray-800 border border-transparent text-gray-400 hover:border-gray-600'
            }`}
          >
            {ml < 1000 ? `${ml}` : `${ml / 1000}L`}
            <span className="block text-[10px] font-normal mt-0.5 opacity-70">ml</span>
          </button>
        ))}
      </div>

      <div className="bg-gray-800/40 rounded-xl px-4 py-3 flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-gray-500">Target selectat</p>
          <p className="text-xs text-gray-600 mt-0.5">≈ {Math.round(waterTarget / 250)} pahare de apă / zi</p>
        </div>
        <span className="text-2xl font-black text-blue-400 tabular-nums">
          {(waterTarget / 1000).toFixed(1)}
          <span className="text-sm text-gray-500 font-normal ml-1">L</span>
        </span>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-gray-800">
        <SavedBadge show={waterSaved} />
        <button
          onClick={saveWater}
          className="ml-auto px-5 py-2.5 rounded-xl bg-blue-500/80 hover:bg-blue-500 active:scale-95 text-white text-sm font-bold transition-all"
        >
          Salvează targetul
        </button>
      </div>
    </section>
  )
}
