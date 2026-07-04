import { useState } from 'react'
import { X, TrendingUp, Flame, Dumbbell, Wheat, Droplet, ChevronRight, CheckCircle2 } from 'lucide-react'
import type { NutritionGoals, GoalType, NutritionPhase } from '../../../shared/types'
import { GoalSelector } from './GoalSelector'
import { GOAL_LABELS, GOAL_OFFSETS, GOAL_MACRO_SPLIT } from '../utils/nutritionHelpers'

interface NutritionInfoModalProps {
  goals: NutritionGoals | null
  macroTargets: { proteinG: number; carbsG: number; fatG: number } | null
  avgCalories: number | null
  phase: NutritionPhase
  onSetGoal: (g: GoalType) => void
  onClose: () => void
}

// ── small sub-components ───────────────────────────────────────────────────

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <span className="text-sm font-bold text-white">{title}</span>
      </div>
      {children}
    </div>
  )
}

function FormulaRow({
  color,
  dot,
  label,
  pct,
  kcal,
  divisor,
  grams,
}: {
  color: string
  dot: string
  label: string
  pct: number
  kcal: number
  divisor: number
  grams: number
}) {
  return (
    <div className="bg-gray-800/60 rounded-xl p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
          <span className="text-sm font-semibold text-white">{label}</span>
          <span className="text-xs text-gray-500 bg-gray-800 px-1.5 py-0.5 rounded-full">{pct}%</span>
        </div>
        <span className="text-sm font-black" style={{ color }}>{grams}g</span>
      </div>
      <p className="text-[11px] text-gray-500 font-mono">
        {kcal} kcal × {pct}% ÷ {divisor} kcal/g = <span className="text-gray-300 font-semibold">{grams}g</span>
      </p>
    </div>
  )
}

// ── main component ─────────────────────────────────────────────────────────

export function NutritionInfoModal({
  goals,
  macroTargets,
  avgCalories,
  phase,
  onSetGoal,
  onClose,
}: NutritionInfoModalProps) {
  const [changeGoalOpen, setChangeGoalOpen] = useState(false)
  const [pendingGoal, setPendingGoal] = useState<GoalType | null>(null)

  const hasGoal = phase === 'active' && goals?.goalType && goals.targetCalories
  const tdee = avgCalories ?? goals?.tdeeEstimated ?? 2000
  const targetKcal = goals?.targetCalories ?? tdee
  const split = goals?.goalType ? GOAL_MACRO_SPLIT[goals.goalType] : { protein: 25, carbs: 45, fat: 30 }
  const offset = goals?.goalType ? GOAL_OFFSETS[goals.goalType] : 0

  function handleConfirm() {
    if (pendingGoal) {
      onSetGoal(pendingGoal)
      setChangeGoalOpen(false)
      setPendingGoal(null)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-gray-900 rounded-t-3xl border-t border-gray-800 shadow-2xl max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-gray-700" />
        </div>

        {/* header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-800">
          <h2 className="text-base font-bold text-white">Cum sunt calculate valorile</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-gray-800 text-gray-500 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* scrollable body */}
        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-6">

          {/* ── 1. Target caloric ─────────────────────────────── */}
          <Section icon={<Flame size={15} className="text-orange-500" />} title="Targetul tău caloric">
            <div className="bg-gray-800/60 rounded-xl p-4 space-y-3">

              {/* TDEE row */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">TDEE estimat</p>
                  <p className="text-[11px] text-gray-600 mt-0.5">
                    Media caloriilor din ultimele 14 zile
                  </p>
                </div>
                <span className="text-lg font-black text-white tabular-nums">
                  {avgCalories ? avgCalories.toLocaleString('ro-RO') : '—'}
                  <span className="text-xs text-gray-500 font-normal ml-1">kcal</span>
                </span>
              </div>

              {hasGoal && (
                <>
                  <div className="h-px bg-gray-700/50" />

                  {/* offset row */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Obiectiv</p>
                      <p className="text-[11px] text-gray-600 mt-0.5">{GOAL_LABELS[goals!.goalType!]}</p>
                    </div>
                    <span className={`text-sm font-bold ${offset < 0 ? 'text-blue-400' : offset > 0 ? 'text-green-400' : 'text-gray-400'}`}>
                      {offset === 0 ? '±0' : offset > 0 ? `+${offset}` : offset} kcal
                    </span>
                  </div>

                  <div className="h-px bg-gray-700/50" />

                  {/* formula */}
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
                <p className="text-xs text-gray-500 italic">
                  Setează un obiectiv pentru a vedea calculul complet.
                </p>
              )}
            </div>

            {!hasGoal && avgCalories === null && (
              <p className="text-[11px] text-gray-600 mt-2 px-1">
                TDEE-ul se calculează automat după ce loghezi alimente timp de câteva zile.
              </p>
            )}
          </Section>

          {/* ── 2. Split macronutrienti ───────────────────────── */}
          <Section icon={<TrendingUp size={15} className="text-purple-400" />} title="Split macronutrienți">
            <div className="space-y-2">
              <FormulaRow
                color="#60a5fa"
                dot="blue"
                label="Proteine"
                pct={split.protein}
                kcal={targetKcal}
                divisor={4}
                grams={macroTargets?.proteinG ?? Math.round((targetKcal * split.protein) / 100 / 4)}
              />
              <FormulaRow
                color="#facc15"
                dot="yellow"
                label="Carbohidrați"
                pct={split.carbs}
                kcal={targetKcal}
                divisor={4}
                grams={macroTargets?.carbsG ?? Math.round((targetKcal * split.carbs) / 100 / 4)}
              />
              <FormulaRow
                color="#f97316"
                dot="orange"
                label="Grăsimi"
                pct={split.fat}
                kcal={targetKcal}
                divisor={9}
                grams={macroTargets?.fatG ?? Math.round((targetKcal * split.fat) / 100 / 9)}
              />
            </div>

            <p className="text-[11px] text-gray-600 mt-2.5 px-1">
              Procentele se ajustează automat în funcție de obiectiv. Grăsimile au 9 kcal/g, proteinele și carbohidrații câte 4 kcal/g.
            </p>
          </Section>

          {/* ── 3. Ce face fiecare macro ──────────────────────── */}
          <Section icon={<Dumbbell size={15} className="text-gray-400" />} title="Rolul fiecărui macronutrient">
            <div className="space-y-2">
              <div className="flex gap-3 bg-gray-800/40 rounded-xl p-3">
                <div className="w-2 shrink-0 rounded-full mt-1" style={{ backgroundColor: '#60a5fa', alignSelf: 'flex-start', height: '8px', marginTop: '4px' }} />
                <div>
                  <p className="text-xs font-semibold text-blue-400">Proteine</p>
                  <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
                    Construiesc și refac masa musculară. Esențiale după antrenament. Surse: pui, ouă, brânză, ton, leguminoase.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 bg-gray-800/40 rounded-xl p-3">
                <div className="w-2 shrink-0 rounded-full" style={{ backgroundColor: '#facc15', alignSelf: 'flex-start', height: '8px', marginTop: '4px' }} />
                <div>
                  <p className="text-xs font-semibold text-yellow-400">Carbohidrați</p>
                  <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
                    Sursa principală de energie — alimentează antrenamentele. Surse: orez, cartofi, fructe, ovăz.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 bg-gray-800/40 rounded-xl p-3">
                <div className="w-2 shrink-0 rounded-full" style={{ backgroundColor: '#f97316', alignSelf: 'flex-start', height: '8px', marginTop: '4px' }} />
                <div>
                  <p className="text-xs font-semibold text-orange-400">Grăsimi</p>
                  <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
                    Reglează hormonii și absorb vitaminele liposolubile (A, D, E, K). Surse: avocado, nuci, ulei de măsline, pește gras.
                  </p>
                </div>
              </div>
            </div>
          </Section>

          {/* ── 4. Schimbă obiectivul ─────────────────────────── */}
          <Section icon={<CheckCircle2 size={15} className="text-orange-500" />} title="Obiectivul tău">
            {!changeGoalOpen ? (
              <button
                onClick={() => setChangeGoalOpen(true)}
                className="w-full flex items-center justify-between p-4 bg-gray-800/60 hover:bg-gray-800 rounded-xl transition-colors group"
              >
                <div className="text-left">
                  <p className="text-sm font-semibold text-white">
                    {hasGoal ? GOAL_LABELS[goals!.goalType!] : 'Fără obiectiv'}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {hasGoal
                      ? `${targetKcal.toLocaleString('ro-RO')} kcal/zi`
                      : 'Apasă pentru a seta un obiectiv'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-orange-500 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                    Schimbă
                  </span>
                  <ChevronRight size={16} className="text-gray-600" />
                </div>
              </button>
            ) : (
              <div className="space-y-3">
                <GoalSelector
                  selected={pendingGoal ?? (goals?.goalType ?? null)}
                  tdee={tdee}
                  onSelect={setPendingGoal}
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => { setChangeGoalOpen(false); setPendingGoal(null) }}
                    className="flex-1 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-400 text-sm font-semibold transition-colors"
                  >
                    Anulează
                  </button>
                  <button
                    onClick={handleConfirm}
                    disabled={!pendingGoal}
                    className="flex-1 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold transition-colors disabled:opacity-40"
                  >
                    Salvează
                  </button>
                </div>
              </div>
            )}
          </Section>

          {/* bottom padding */}
          <div className="h-4" />
        </div>
      </div>
    </div>
  )
}
