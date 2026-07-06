import { Flame } from 'lucide-react'
import { useCalorieGoalSection } from '../../stores/nutritieSetariStore'
import { GoalSelector } from '../GoalSelector'
import { SectionHeader } from './SectionHeader'
import { SavedBadge } from './SavedBadge'
import type { GoalType } from '../../../../shared/types'

export function CalorieGoalSection() {
  const {
    avgCalories, tdee, activeGoal, pendingGoal, goalSaved,
    manualMode, manualKcal, gramMode, gramP, gramC, gramF, loading,
    setPendingGoal, setManualMode, setManualKcal, saveGoal, saveManual,
  } = useCalorieGoalSection()

  const gP = Math.max(0, parseInt(gramP) || 0)
  const gC = Math.max(0, parseInt(gramC) || 0)
  const gF = Math.max(0, parseInt(gramF) || 0)
  const gramKcal = gP * 4 + gC * 4 + gF * 9
  const gramValid = gramKcal > 0

  return (
    <section className="bg-gray-900 rounded-2xl p-4">
      <SectionHeader icon={<Flame size={16} className="text-orange-500" />} title="Obiectiv caloric" />

      <div className="flex items-center justify-between bg-gray-800/60 rounded-xl px-4 py-3 mb-4">
        <div>
          <p className="text-xs text-gray-500">TDEE estimat</p>
          <p className="text-[11px] text-gray-600 mt-0.5">Media caloriilor din ultimele 14 zile</p>
        </div>
        <div className="text-right">
          <span className="text-xl font-black text-white tabular-nums">
            {avgCalories ? avgCalories.toLocaleString('ro-RO') : '—'}
          </span>
          <span className="text-xs text-gray-500 ml-1">kcal</span>
        </div>
      </div>

      <GoalSelector selected={activeGoal} tdee={tdee} onSelect={(g: GoalType) => setPendingGoal(g)} />

      <div className="mt-4 flex items-center justify-between py-3 border-t border-gray-800">
        <div>
          <p className={`text-sm font-semibold ${gramMode ? 'text-gray-500' : 'text-white'}`}>
            Calorii manuale
          </p>
          <p className="text-xs text-gray-500 mt-0.5">
            {gramMode ? 'Dezactivat — caloriile sunt definite de macros' : 'Suprascrie calculul automat'}
          </p>
        </div>
        <button
          onClick={() => !gramMode && !loading && setManualMode(!manualMode)}
          disabled={gramMode || loading}
          className={`relative w-11 h-6 rounded-full transition-colors ${
            gramMode || loading ? 'bg-gray-700 opacity-40 cursor-not-allowed' : manualMode ? 'bg-orange-500' : 'bg-gray-700'
          }`}
        >
          <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${
            manualMode && !gramMode ? 'translate-x-5' : 'translate-x-0'
          }`} />
        </button>
      </div>

      {gramMode ? (
        <div className="mt-2">
          <div className="flex items-center bg-gray-800/40 border border-gray-700/40 rounded-xl px-4 py-2.5 gap-2">
            <span className="flex-1 text-gray-500 font-bold text-lg tabular-nums">
              {gramValid ? gramKcal.toLocaleString('ro-RO') : '—'}
            </span>
            <span className="text-sm text-gray-600 shrink-0">kcal / zi</span>
            <span className="text-xs text-orange-400 font-semibold shrink-0 border border-orange-500/30 bg-orange-500/10 px-2 py-0.5 rounded-lg">
              din macros
            </span>
          </div>
        </div>
      ) : manualMode ? (
        <div className="mt-2">
          <div className="flex items-center bg-gray-800 rounded-xl px-4 py-2.5 gap-2">
            <input
              type="number"
              min={800}
              max={10000}
              value={manualKcal}
              onChange={(e) => setManualKcal(e.target.value)}
              className="flex-1 bg-transparent text-white font-bold text-lg outline-none tabular-nums w-full"
              placeholder="2200"
            />
            <span className="text-sm text-gray-500 shrink-0">kcal / zi</span>
          </div>
        </div>
      ) : null}

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-800">
        <SavedBadge show={goalSaved} />
        <button
          onClick={manualMode ? saveManual : saveGoal}
          disabled={gramMode || (!manualMode && !activeGoal && !pendingGoal)}
          className="ml-auto px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-95 text-white text-sm font-bold transition-all disabled:opacity-40"
          title={gramMode ? 'Salvează din secțiunea Split macronutrienți' : undefined}
        >
          Salvează obiectivul
        </button>
      </div>
    </section>
  )
}
