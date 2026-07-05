import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Droplets, Settings, Bell, ChevronRight as ArrowRight, AlertTriangle, Info, Plus } from 'lucide-react'
import { useNutritionLog } from '../hooks/useNutritionLog'
import { useNutritionTarget } from '../hooks/useNutritionTarget'
import { MealCard } from '../components/MealCard'
import { WeekStrip, getMondayOf } from '../components/WeekStrip'
import { getMealLabel, MAX_MEALS, DEFAULT_MEALS, formatDate, addDays, computeMacroTargets } from '../utils/nutritionHelpers'
import type { GoalType, NutritionPhase } from '../../../shared/types'

// ── types ──────────────────────────────────────────────────────────────────

interface NutritionNotification {
  id: string
  kind: 'warning' | 'info'
  title: string
  description: string
}

function buildNotifications(
  phase: NutritionPhase,
  avgCalories: number | null,
): NutritionNotification[] {
  const list: NutritionNotification[] = []

  if (phase === 'discovery') {
    list.push({
      id: 'no-goal',
      kind: 'warning',
      title: 'Obiectiv caloric nesetat',
      description: 'Setează un obiectiv pentru a urmări caloriile și macronutrienții.',
    })
  }

  if (avgCalories === null) {
    list.push({
      id: 'no-tdee',
      kind: 'info',
      title: 'TDEE neestimat',
      description: 'Loghează alimente câteva zile pentru a-ți estima metabolismul de bază.',
    })
  }

  return list
}

// ── MacroBar ───────────────────────────────────────────────────────────────

function MacroBar({
  label, value, target, color,
}: {
  label: string; value: number; target?: number; color: string
}) {
  const pct = target ? Math.min((value / target) * 100, 100) : 0
  const over = target ? value > target : false
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-semibold" style={{ color }}>{label}</span>
        <span className="text-sm font-bold tabular-nums" style={{ color }}>
          {Math.round(value)}
          <span className="font-bold text-white"> / {target ?? '—'}g</span>
        </span>
      </div>
      <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: over ? '#ef4444' : color }}
        />
      </div>
    </div>
  )
}

// ── WaterBottle ────────────────────────────────────────────────────────────

function WaterBottle({ pct }: { pct: number }) {
  return (
    <div className="relative flex-1 w-full flex items-center justify-center py-1">
      <div className="relative" style={{ width: 52, height: 88 }}>
        <div className="absolute inset-0 rounded-b-3xl rounded-t-2xl border border-blue-500/25 bg-gray-800 overflow-hidden">
          <div
            className="absolute bottom-0 left-0 right-0 transition-all duration-700 ease-out"
            style={{ height: `${pct}%` }}
          >
            <div
              className="absolute -top-2 left-0 h-4"
              style={{
                width: '200%',
                background: 'rgba(59,130,246,0.55)',
                borderRadius: '40% 60% 60% 40% / 30%',
                animation: 'waveMove 1.8s linear infinite',
              }}
            />
            <div className="absolute inset-0 top-2 bg-blue-500/40" />
          </div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-[11px] font-black text-white drop-shadow">{Math.round(pct)}%</span>
        </div>
      </div>
    </div>
  )
}

// ── page ───────────────────────────────────────────────────────────────────

export function NutritiePage() {
  const navigate = useNavigate()
  const [date, setDate] = useState(formatDate(new Date()))
  const today = formatDate(new Date())
  const [mealCount, setMealCount] = useState(DEFAULT_MEALS)
  const [notifOpen, setNotifOpen] = useState(false)

  const { log, loading, addFoodEntry, updateFoodEntry, removeFoodEntry, addWater } = useNutritionLog(date)

  // Reset meal count when navigating to a different day
  useEffect(() => { setMealCount(DEFAULT_MEALS) }, [date])

  // Expand to show all meals that already have entries on this day
  useEffect(() => {
    if (!log?.entries?.length) return
    const maxFromLog = log.entries.reduce((max, e) => {
      const n = parseInt(e.mealType.replace('masa_', ''))
      return isNaN(n) ? max : Math.max(max, n)
    }, 0)
    if (maxFromLog > 0) setMealCount((c) => Math.max(c, maxFromLog))
  }, [log])
  const { goals, phase, macroTargets, avgCalories, setGoalType } = useNutritionTarget()

  const totalCalories = log?.totalCalories ?? 0
  const totalProtein  = log?.totalProteinG ?? 0
  const totalCarbs    = log?.totalCarbsG ?? 0
  const totalFat      = log?.totalFatG ?? 0
  const waterMl       = log?.waterMl ?? 0
  const waterTarget   = log?.waterTargetMl ?? 2000
  const waterPct      = Math.min((waterMl / waterTarget) * 100, 100)

  const hasActiveGoal = phase === 'active' && goals?.targetCalories

  const effectiveMacroTargets = macroTargets ?? computeMacroTargets(
    hasActiveGoal ? goals!.targetCalories! : 2000,
    { protein: 25, carbs: 45, fat: 30 },
  )

  const monthLabel = new Date(date).toLocaleDateString('ro-RO', { month: 'long', year: 'numeric' })
  const sameWeekAsToday = getMondayOf(date) === getMondayOf(today)

  const notifications = buildNotifications(phase, avgCalories)
  const notifCount = notifications.length

  return (
    <div className="space-y-3 pb-6">

      {/* ── month / week navigation ─────────────────────────── */}
      <div className="flex items-center justify-between px-1">
        <span className="text-white font-bold text-base capitalize">{monthLabel}</span>
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => setDate(addDays(date, -7))}
            className="p-1.5 rounded-xl hover:bg-gray-800 text-gray-500 hover:text-white transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => setDate(addDays(date, 7))}
            disabled={sameWeekAsToday}
            className="p-1.5 rounded-xl hover:bg-gray-800 text-gray-500 hover:text-white transition-colors disabled:opacity-25 disabled:pointer-events-none"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* ── week strip ──────────────────────────────────────── */}
      <WeekStrip selectedDate={date} today={today} onSelect={setDate} />

      {/* ── macros + water: 2-card layout ───────────────────── */}
      {loading ? (
        <div className="grid grid-cols-2 gap-3">
          <div className="h-52 bg-gray-900 rounded-2xl animate-pulse" />
          <div className="h-52 bg-gray-900 rounded-2xl animate-pulse" />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">

          {/* LEFT: calories + macro bars */}
          <div className="bg-gray-900 rounded-2xl p-4 flex flex-col gap-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <p className="text-[11px] text-gray-500">Calorii azi</p>
                <div className="flex items-center gap-0.5 -mr-1">
                  <button
                    onClick={() => setNotifOpen(v => !v)}
                    className={`relative p-1.5 rounded-lg transition-colors ${
                      notifOpen ? 'bg-orange-500/15 text-orange-400' : 'text-gray-500 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    <Bell size={14} />
                    {notifCount > 0 && (
                      <span className="absolute top-0.5 right-0.5 w-3 h-3 rounded-full bg-orange-500 flex items-center justify-center">
                        <span className="text-[7px] font-black text-white leading-none">{notifCount}</span>
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => navigate('/nutritie/setari')}
                    className="p-1.5 rounded-lg text-orange-500 hover:bg-orange-500/10 transition-colors"
                  >
                    <Settings size={14} />
                  </button>
                </div>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-white tabular-nums leading-none">
                  {totalCalories.toLocaleString('ro-RO')}
                </span>
                <span className="text-xs text-gray-500">kcal</span>
              </div>
              {hasActiveGoal ? (
                <p className="text-[10px] text-orange-400 mt-1 tabular-nums">
                  / {goals!.targetCalories!.toLocaleString('ro-RO')} kcal
                </p>
              ) : (
                <p className="text-[10px] text-gray-600 mt-1">sem obiectiv</p>
              )}
            </div>
            <div className="flex-1 flex flex-col justify-end gap-2.5">
              <MacroBar label="Proteine"     value={Math.round(totalProtein)} target={effectiveMacroTargets.proteinG} color="#60a5fa" />
              <MacroBar label="Carbo"        value={Math.round(totalCarbs)}   target={effectiveMacroTargets.carbsG}   color="#facc15" />
              <MacroBar label="Grăsimi"      value={Math.round(totalFat)}     target={effectiveMacroTargets.fatG}     color="#f97316" />
            </div>
          </div>

          {/* RIGHT: water bottle */}
          <div className="bg-gray-900 rounded-2xl p-4 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Droplets size={13} className="text-blue-400" />
                <span className="text-[11px] font-semibold text-white">Hidratare</span>
              </div>
              <span className="text-[10px] font-bold text-blue-400 tabular-nums">
                {waterMl}
                <span className="text-gray-600 font-normal">/{waterTarget}ml</span>
              </span>
            </div>
            <WaterBottle pct={waterPct} />
            <div className="grid grid-cols-3 gap-1">
              {[150, 250, 500].map((ml) => (
                <button
                  key={ml}
                  onClick={() => addWater(ml)}
                  className="py-2 rounded-xl bg-gray-800 hover:bg-blue-500/15 active:scale-95 text-blue-400 text-[11px] font-semibold transition-all"
                >
                  +{ml}
                </button>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ── notifications panel ─────────────────────────────── */}
      {notifOpen && (
        <div className="bg-gray-900 rounded-2xl overflow-hidden">
          {notifCount > 0 ? (
            <>
              <p className="text-[10px] text-gray-600 font-semibold uppercase tracking-wider px-4 pt-3 pb-1">
                Recomandări
              </p>
              {notifications.map((n, i) => (
                <button
                  key={n.id}
                  onClick={() => { navigate('/nutritie/setari'); setNotifOpen(false) }}
                  className={`w-full flex items-start gap-3 px-4 py-3 hover:bg-gray-800/60 active:bg-gray-800 transition-colors text-left ${
                    i < notifications.length - 1 ? 'border-b border-gray-800/60' : ''
                  }`}
                >
                  <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    n.kind === 'warning' ? 'bg-orange-500/15' : 'bg-blue-500/15'
                  }`}>
                    {n.kind === 'warning'
                      ? <AlertTriangle size={13} className="text-orange-400" />
                      : <Info size={13} className="text-blue-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-semibold ${n.kind === 'warning' ? 'text-orange-400' : 'text-blue-400'}`}>
                      {n.title}
                    </p>
                    <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">{n.description}</p>
                  </div>
                  <ArrowRight size={14} className="text-gray-600 shrink-0 mt-1" />
                </button>
              ))}
              <div className="px-4 pb-3 pt-2">
                <button
                  onClick={() => { navigate('/nutritie/setari'); setNotifOpen(false) }}
                  className="w-full py-2.5 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 text-xs font-bold transition-colors"
                >
                  Deschide setările nutriție
                </button>
              </div>
            </>
          ) : (
            <div className="px-4 py-4 flex items-center gap-2">
              <span className="text-xs text-gray-500">Totul e la zi — nicio recomandare.</span>
            </div>
          )}
        </div>
      )}

      {/* ── meals ───────────────────────────────────────────── */}
      {Array.from({ length: mealCount }, (_, i) => `masa_${i + 1}`).map((type) => (
        <MealCard
          key={type}
          mealType={type}
          entries={(log?.entries ?? []).filter((e) => e.mealType === type)}
          onAdd={addFoodEntry}
          onUpdate={updateFoodEntry}
          onRemove={removeFoodEntry}
        />
      ))}

      {mealCount < MAX_MEALS && (
        <button
          onClick={() => setMealCount((c) => Math.min(c + 1, MAX_MEALS))}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-dashed border-gray-700 hover:border-orange-500/40 hover:bg-orange-500/5 text-gray-500 hover:text-orange-500 text-sm font-semibold transition-colors"
        >
          <Plus size={16} />
          Adaugă masă ({mealCount}/{MAX_MEALS})
        </button>
      )}
    </div>
  )
}
