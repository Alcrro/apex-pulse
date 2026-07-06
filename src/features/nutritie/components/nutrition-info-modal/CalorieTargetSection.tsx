import { Flame } from 'lucide-react'
import { ModalSection } from './ModalSection'

interface Props {
  hasGoal: boolean
  avgCalories: number | null
  targetKcal: number
  offset: number
  goalLabel: string | null
}

export function CalorieTargetSection({ hasGoal, avgCalories, targetKcal, offset, goalLabel }: Props) {
  return (
    <ModalSection icon={<Flame size={15} className="text-orange-500" />} title="Targetul tău caloric">
      <div className="bg-gray-800/60 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">TDEE estimat</p>
            <p className="text-[11px] text-gray-600 mt-0.5">Media caloriilor din ultimele 14 zile</p>
          </div>
          <span className="text-lg font-black text-white tabular-nums">
            {avgCalories ? avgCalories.toLocaleString('ro-RO') : '—'}
            <span className="text-xs text-gray-500 font-normal ml-1">kcal</span>
          </span>
        </div>

        {hasGoal && goalLabel && (
          <>
            <div className="h-px bg-gray-700/50" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Obiectiv</p>
                <p className="text-[11px] text-gray-600 mt-0.5">{goalLabel}</p>
              </div>
              <span className={`text-sm font-bold ${offset < 0 ? 'text-blue-400' : offset > 0 ? 'text-green-400' : 'text-gray-400'}`}>
                {offset === 0 ? '±0' : offset > 0 ? `+${offset}` : offset} kcal
              </span>
            </div>
            <div className="h-px bg-gray-700/50" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Target zilnic</p>
                <p className="text-[11px] text-gray-600 font-mono mt-0.5">
                  {avgCalories ?? '?'} {offset >= 0 ? '+' : '−'} {Math.abs(offset)} kcal
                </p>
              </div>
              <span className="text-xl font-black text-orange-500 tabular-nums">
                {targetKcal.toLocaleString('ro-RO')}
                <span className="text-xs text-gray-500 font-normal ml-1">kcal</span>
              </span>
            </div>
          </>
        )}

        {!hasGoal && (
          <p className="text-xs text-gray-500 italic">Setează un obiectiv pentru a vedea calculul complet.</p>
        )}
      </div>

      {!hasGoal && avgCalories === null && (
        <p className="text-[11px] text-gray-600 mt-2 px-1">
          TDEE-ul se calculează automat după ce loghezi alimente timp de câteva zile.
        </p>
      )}
    </ModalSection>
  )
}
