import { useState, useMemo, useRef } from 'react'
import {
  ClipboardList, ChevronDown, ChevronUp, ChevronLeft, ChevronRight,
  Check, Search, Plus, Minus, Loader2, CheckCircle2, AlertCircle, X,
} from 'lucide-react'
import { useExercises } from '../../exercises/hooks/useExercises'
import { MuscleGroupIcon } from './MuscleGroupIcon'
import { useAuth } from '../../../shared/context/AuthContext'
import { supabase } from '../../../shared/lib/supabase'
import { EXERCISE_IMAGES } from '../../../shared/lib/exercise_images'
import type { Exercise } from '../../../shared/types'

interface ExerciseSelection {
  exerciseId: string
  name: string
  sets: number
  reps: number
}

interface DayConfig {
  name: string
  muscleGroups: string[]
  exercises: ExerciseSelection[]
}

const GOLD = '#D4B96A'
const MUSCLE_GROUP_OPTIONS = ['Piept', 'Spate', 'Picioare', 'Umeri', 'Biceps', 'Triceps', 'Abdomen', 'Full Body', 'Cardio']
const EQUIPMENT_OPTIONS = ['Bara', 'Gantere', 'Masina', 'Cablu', 'Greutate corporala', 'Alt echipament']
const STEP_TITLES = ['Program', 'Zile', 'Exerciții', 'Confirmare']

function makeDays(n: number): DayConfig[] {
  return Array.from({ length: n }, (_, i) => ({ name: `Ziua ${i + 1}`, muscleGroups: [], exercises: [] }))
}

function nameFromGroups(groups: string[], fallback: string): string {
  return groups.length > 0 ? groups.join(' + ') : fallback
}

function useCreateManualProgram() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function create(programName: string, days: DayConfig[]): Promise<boolean> {
    if (!user) return false
    setLoading(true)
    setError(null)
    try {
      await supabase.from('programs').update({ is_active: false }).eq('user_id', user.id)
      await supabase.from('workout_plans').update({ is_active: false }).eq('user_id', user.id)

      const { data: prog, error: progErr } = await supabase
        .from('programs')
        .insert({ user_id: user.id, name: programName, is_active: true })
        .select()
        .single()
      if (progErr || !prog) throw new Error('Nu s-a putut crea programul.')

      for (let i = 0; i < days.length; i++) {
        const day = days[i]
        const { data: plan, error: planErr } = await supabase
          .from('workout_plans')
          .insert({ user_id: user.id, name: day.name, program_id: prog.id, program_order: i, is_active: false })
          .select()
          .single()
        if (planErr || !plan) throw new Error(`Nu s-a putut crea ziua ${i + 1}.`)

        if (day.exercises.length > 0) {
          await supabase.from('workout_exercises').insert(
            day.exercises.map((ex, idx) => ({
              workout_plan_id: plan.id,
              exercise_id: ex.exerciseId,
              sets: ex.sets,
              reps: ex.reps,
              rest_seconds: 90,
              order_index: idx,
            }))
          )
        }
      }
      return true
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Eroare la creare.')
      return false
    } finally {
      setLoading(false)
    }
  }

  return { create, loading, error }
}

export function ManualConfigurator({ onCreated }: { onCreated: () => void }) {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(1)
  const [programName, setProgramName] = useState('')
  const [numDays, setNumDays] = useState(3)
  const [days, setDays] = useState<DayConfig[]>(makeDays(3))
  const [currentDayIdx, setCurrentDayIdx] = useState(0)
  const [dayOffsets, setDayOffsets] = useState<number[]>(Array(3).fill(0))
  const touchStartX = useRef(0)
  const [search, setSearch] = useState('')
  const [equipmentFilter, setEquipmentFilter] = useState<string[]>([])
  const [done, setDone] = useState(false)

  const { exercises } = useExercises()
  const { create, loading, error } = useCreateManualProgram()

  function handleNumDays(n: number) {
    setNumDays(n)
    setDays(prev => {
      if (n > prev.length)
        return [...prev, ...Array.from({ length: n - prev.length }, (_, i) => ({ name: `Ziua ${prev.length + i + 1}`, muscleGroups: [], exercises: [] }))]
      return prev.slice(0, n)
    })
    setDayOffsets(prev => {
      if (n > prev.length) return [...prev, ...Array(n - prev.length).fill(0)]
      return prev.slice(0, n)
    })
  }

  function toggleMuscleGroup(dayIdx: number, group: string) {
    setDays(prev => prev.map((d, i) => {
      if (i !== dayIdx) return d
      const has = d.muscleGroups.includes(group)
      const next = has ? d.muscleGroups.filter(g => g !== group) : [...d.muscleGroups, group]
      return { ...d, muscleGroups: next, name: nameFromGroups(next, `Ziua ${dayIdx + 1}`) }
    }))
  }

  function toggleExercise(ex: Exercise) {
    setDays(prev => prev.map((d, i) => {
      if (i !== currentDayIdx) return d
      const exists = d.exercises.find(e => e.exerciseId === ex.id)
      if (exists) return { ...d, exercises: d.exercises.filter(e => e.exerciseId !== ex.id) }
      return { ...d, exercises: [...d.exercises, { exerciseId: ex.id, name: ex.name, sets: 3, reps: 10 }] }
    }))
  }

  function removeFromDay(dayIdx: number, exerciseId: string) {
    setDays(prev => prev.map((d, i) =>
      i === dayIdx ? { ...d, exercises: d.exercises.filter(e => e.exerciseId !== exerciseId) } : d
    ))
  }

  function updateParam(dayIdx: number, exId: string, field: 'sets' | 'reps', delta: number) {
    setDays(prev => prev.map((d, i) => {
      if (i !== dayIdx) return d
      return {
        ...d,
        exercises: d.exercises.map(e => {
          if (e.exerciseId !== exId) return e
          const max = field === 'sets' ? 10 : 50
          return { ...e, [field]: Math.max(1, Math.min(max, e[field] + delta)) }
        }),
      }
    }))
  }

  const currentDay = days[currentDayIdx]
  const selectedIds = new Set(currentDay?.exercises.map(e => e.exerciseId) ?? [])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    const dayGroups = currentDay?.muscleGroups ?? []
    let list = exercises
    if (q) {
      list = list.filter(ex => ex.name.toLowerCase().includes(q) || ex.muscle_group.toLowerCase().includes(q))
    } else if (dayGroups.length > 0) {
      list = list.filter(ex => dayGroups.includes(ex.muscle_group))
    }
    if (equipmentFilter.length > 0) {
      list = list.filter(ex => ex.equipment && equipmentFilter.includes(ex.equipment))
    }
    return list
  }, [exercises, search, currentDay, equipmentFilter])

  const grouped = useMemo(() => {
    const map = new Map<string, Exercise[]>()
    for (const ex of filtered) {
      if (!map.has(ex.muscle_group)) map.set(ex.muscle_group, [])
      map.get(ex.muscle_group)!.push(ex)
    }
    return map
  }, [filtered])

  async function handleCreate() {
    const name = programName.trim() || 'Programul meu'
    const ok = await create(name, days)
    if (ok) {
      setDone(true)
      onCreated()
      setTimeout(() => {
        setDone(false)
        setOpen(false)
        setStep(1)
        setProgramName('')
        setNumDays(3)
        setDays(makeDays(3))
        setCurrentDayIdx(0)
      }, 2000)
    }
  }

  const canProceed =
    step === 1 ? numDays >= 2 :
    step === 2 ? days.every(d => d.muscleGroups.length > 0) :
    true

  return (
    <div className="bg-gray-900 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-4 py-4 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <ClipboardList size={15} style={{ color: GOLD }} />
          <span className="text-sm font-semibold text-white">Configurare manuală</span>
        </div>
        {open ? <ChevronUp size={15} className="text-gray-500" /> : <ChevronDown size={15} className="text-gray-500" />}
      </button>

      {open && (
        <div className="border-t border-gray-800/60">
          {/* Step indicator */}
          <div className="flex items-center justify-center gap-1 px-4 py-3">
            {STEP_TITLES.map((title, i) => (
              <div key={i} className="flex items-center gap-1">
                <div
                  className="w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center transition-colors"
                  style={i + 1 <= step ? { backgroundColor: GOLD, color: '#111827' } : undefined}
                  {...(i + 1 > step ? { className: 'w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center bg-gray-800 text-gray-500' } : {})}
                >
                  {i + 1 < step ? <Check size={10} /> : i + 1}
                </div>
                <span className={`text-[10px] font-medium ${i + 1 === step ? 'text-white' : 'text-gray-600'}`}>{title}</span>
                {i < STEP_TITLES.length - 1 && <div className="w-3 h-px bg-gray-800 mx-0.5" />}
              </div>
            ))}
          </div>

          <div className="px-4 pb-2 space-y-3">

            {/* ── Step 1: Program name + days ── */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <p className="text-[11px] text-gray-500 uppercase tracking-widest font-semibold mb-2">Nume program</p>
                  <input
                    type="text"
                    value={programName}
                    onChange={e => setProgramName(e.target.value)}
                    placeholder="ex: PPL, Bro Split, Push Pull Legs..."
                    className="w-full px-3 py-2.5 rounded-xl text-sm bg-gray-800 border border-gray-700 text-white outline-none transition-colors placeholder:text-gray-600 focus:border-gray-500"
                  />
                </div>
                <div>
                  <p className="text-[11px] text-gray-500 uppercase tracking-widest font-semibold mb-3">Zile de antrenament / săptămână</p>
                  <div className="flex gap-2">
                    {[2, 3, 4, 5, 6].map(n => (
                      <button
                        key={n}
                        onClick={() => handleNumDays(n)}
                        className="flex-1 py-3 rounded-xl text-sm font-bold border transition-all"
                        style={numDays === n
                          ? { backgroundColor: GOLD + '1A', borderColor: GOLD + '99', color: GOLD }
                          : undefined}
                        {...(numDays !== n ? { className: 'flex-1 py-3 rounded-xl text-sm font-bold border transition-all bg-transparent border-gray-700 text-gray-500 hover:text-gray-300' } : {})}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── Step 2: Days stacked, muscle groups paged with arrows ── */}
            {step === 2 && (
              <div className="space-y-2.5">
                {days.map((day, dayIdx) => {
                  const offset = dayOffsets[dayIdx] ?? 0
                  const visible = MUSCLE_GROUP_OPTIONS.slice(offset, offset + 3)
                  const canLeft = offset > 0
                  const canRight = offset + 3 < MUSCLE_GROUP_OPTIONS.length
                  return (
                    <div key={dayIdx} className="bg-gray-800/40 rounded-xl p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Ziua {dayIdx + 1}</p>
                        {day.muscleGroups.length > 0 && (
                          <p className="text-[11px] font-semibold" style={{ color: GOLD }}>{day.name}</p>
                        )}
                      </div>
                      <div
                        className="flex items-center gap-2"
                        onTouchStart={e => { touchStartX.current = e.touches[0].clientX }}
                        onTouchEnd={e => {
                          const delta = touchStartX.current - e.changedTouches[0].clientX
                          if (Math.abs(delta) < 30) return
                          setDayOffsets(prev => prev.map((o, i) => {
                            if (i !== dayIdx) return o
                            if (delta > 0) return Math.min(MUSCLE_GROUP_OPTIONS.length - 3, o + 3)
                            return Math.max(0, o - 3)
                          }))
                        }}
                      >
                        <button
                          onClick={() => setDayOffsets(prev => prev.map((o, i) => i === dayIdx ? Math.max(0, o - 3) : o))}
                          disabled={!canLeft}
                          className="w-7 h-7 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 disabled:opacity-20 hover:bg-gray-700 transition-colors shrink-0"
                        >
                          <ChevronLeft size={14} />
                        </button>
                        <div className="flex-1 grid grid-cols-3 gap-2">
                          {visible.map(g => {
                            const selected = day.muscleGroups.includes(g)
                            return (
                              <button
                                key={g}
                                onClick={() => toggleMuscleGroup(dayIdx, g)}
                                className="flex flex-col items-center gap-1 py-2 rounded-xl border transition-all"
                                style={selected
                                  ? { backgroundColor: GOLD + '1A', borderColor: GOLD, boxShadow: `0 0 0 1px ${GOLD}66` }
                                  : undefined}
                                {...(!selected ? { className: 'flex flex-col items-center gap-1 py-2 rounded-xl border transition-all bg-gray-800 border-gray-700 hover:border-gray-500' } : {})}
                              >
                                <MuscleGroupIcon group={g} size={40} />
                                <span
                                  className="text-[10px] font-bold leading-none"
                                  style={selected ? { color: GOLD } : undefined}
                                  {...(!selected ? { className: 'text-[10px] font-bold leading-none text-gray-200' } : {})}
                                >{g}</span>
                              </button>
                            )
                          })}
                        </div>
                        <button
                          onClick={() => setDayOffsets(prev => prev.map((o, i) => i === dayIdx ? Math.min(MUSCLE_GROUP_OPTIONS.length - 3, o + 3) : o))}
                          disabled={!canRight}
                          className="w-7 h-7 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 disabled:opacity-20 hover:bg-gray-700 transition-colors shrink-0"
                        >
                          <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* ── Step 3: Exercises ── */}
            {step === 3 && currentDay && (
              <div className="space-y-3">
                {/* Day tabs */}
                <div className="flex gap-1 overflow-x-auto pb-1 -mx-1 px-1">
                  {days.map((d, i) => (
                    <button
                      key={i}
                      onClick={() => { setCurrentDayIdx(i); setSearch('') }}
                      className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                      style={i === currentDayIdx ? { backgroundColor: GOLD, color: '#111827' } : undefined}
                      {...(i !== currentDayIdx ? { className: 'shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all bg-gray-800 text-gray-400 hover:text-gray-200' } : {})}
                    >
                      {d.name}{d.exercises.length > 0 && <span className="ml-1 opacity-70">({d.exercises.length})</span>}
                    </button>
                  ))}
                </div>

                {/* Selected exercises */}
                {currentDay.exercises.length > 0 && (
                  <div className="space-y-1">
                    {currentDay.exercises.map(ex => (
                      <div
                        key={ex.exerciseId}
                        className="flex items-center gap-2 rounded-xl px-3 py-1.5"
                        style={{ backgroundColor: GOLD + '1A', border: `1px solid ${GOLD}33` }}
                      >
                        <button onClick={() => removeFromDay(currentDayIdx, ex.exerciseId)} className="shrink-0" style={{ color: GOLD }}>
                          <X size={12} />
                        </button>
                        <span className="flex-1 text-xs text-white truncate">{ex.name}</span>
                        <div className="flex items-center gap-1 shrink-0">
                          <button onClick={() => updateParam(currentDayIdx, ex.exerciseId, 'sets', -1)} className="w-5 h-5 rounded bg-gray-700 text-gray-300 flex items-center justify-center"><Minus size={9} /></button>
                          <span className="text-[11px] text-gray-300 w-7 text-center">{ex.sets}s</span>
                          <button onClick={() => updateParam(currentDayIdx, ex.exerciseId, 'sets', 1)} className="w-5 h-5 rounded bg-gray-700 text-gray-300 flex items-center justify-center"><Plus size={9} /></button>
                          <span className="text-gray-600 mx-0.5 text-xs">×</span>
                          <button onClick={() => updateParam(currentDayIdx, ex.exerciseId, 'reps', -1)} className="w-5 h-5 rounded bg-gray-700 text-gray-300 flex items-center justify-center"><Minus size={9} /></button>
                          <span className="text-[11px] text-gray-300 w-7 text-center">{ex.reps}r</span>
                          <button onClick={() => updateParam(currentDayIdx, ex.exerciseId, 'reps', 1)} className="w-5 h-5 rounded bg-gray-700 text-gray-300 flex items-center justify-center"><Plus size={9} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Search */}
                <div className="relative">
                  <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Caută exerciții..."
                    className="w-full pl-8 pr-3 py-2 rounded-xl text-sm bg-gray-800 border border-gray-700 text-white outline-none focus:border-gray-500 transition-colors placeholder:text-gray-600"
                  />
                </div>

                {/* Equipment filter */}
                <div className="flex flex-wrap gap-1.5">
                  {EQUIPMENT_OPTIONS.map(eq => {
                    const active = equipmentFilter.includes(eq)
                    return (
                      <button
                        key={eq}
                        onClick={() => setEquipmentFilter(prev =>
                          active ? prev.filter(e => e !== eq) : [...prev, eq]
                        )}
                        className="text-[10px] px-2.5 py-1 rounded-full border font-medium transition-all"
                        style={active
                          ? { backgroundColor: GOLD + '1A', borderColor: GOLD + '99', color: GOLD }
                          : undefined}
                        {...(!active ? { className: 'text-[10px] px-2.5 py-1 rounded-full border font-medium transition-all bg-gray-800 border-gray-700 text-gray-500 hover:text-gray-300' } : {})}
                      >
                        {eq}
                      </button>
                    )
                  })}
                </div>

                {/* Exercise list */}
                <div className="max-h-72 overflow-y-auto space-y-2 pr-0.5">
                  {Array.from(grouped.entries()).map(([group, exList]) => (
                    <div key={group}>
                      <p className="text-[10px] text-gray-600 font-semibold uppercase tracking-wider px-1 mb-1 sticky top-0 bg-gray-900/80">{group}</p>
                      <div className="space-y-0.5">
                        {exList.map(ex => {
                          const selected = selectedIds.has(ex.id)
                          const img = EXERCISE_IMAGES[ex.name]
                          return (
                            <button
                              key={ex.id}
                              onClick={() => toggleExercise(ex)}
                              className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-left transition-all"
                              style={selected ? { backgroundColor: GOLD + '1A', color: GOLD } : undefined}
                              {...(!selected ? { className: 'w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-left transition-all hover:bg-gray-800 text-gray-300' } : {})}
                            >
                              <div
                                className="w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors"
                                style={selected ? { backgroundColor: GOLD, borderColor: GOLD } : undefined}
                                {...(!selected ? { className: 'w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors border-gray-600' } : {})}
                              >
                                {selected && <Check size={9} className="text-gray-900" />}
                              </div>
                              {img
                                ? <img src={img} alt={ex.name} className="w-10 h-10 rounded-lg object-cover shrink-0 bg-gray-800" />
                                : <div className="w-10 h-10 rounded-lg bg-gray-800 shrink-0" />
                              }
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium truncate">{ex.name}</p>
                                {ex.equipment && <p className="text-[10px] text-gray-600 mt-0.5">{ex.equipment}</p>}
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Step 4: Confirm ── */}
            {step === 4 && (
              <div className="space-y-3">
                <div className="bg-gray-800/60 rounded-xl p-4">
                  <p className="text-sm font-bold text-white">{programName.trim() || 'Programul meu'}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{numDays} zile · va fi activat automat</p>
                </div>
                <div className="space-y-1.5">
                  {days.map((d, i) => (
                    <div key={i} className="flex items-center gap-3 px-3 py-2.5 bg-gray-800/40 rounded-xl">
                      <div
                        className="w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center shrink-0"
                        style={{ backgroundColor: GOLD + '1A', color: GOLD }}
                      >{i + 1}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white font-medium truncate">{d.name}</p>
                        <p className="text-xs text-gray-500">{d.exercises.length > 0 ? `${d.exercises.length} exerciții` : 'Fără exerciții (se adaugă după)'}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {error && (
                  <div className="flex items-start gap-2 text-red-400 bg-red-400/10 rounded-xl px-3 py-2.5">
                    <AlertCircle size={14} className="mt-0.5 shrink-0" />
                    <p className="text-xs">{error}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex gap-2 px-4 pb-4 pt-2">
            {step > 1 && (
              <button
                onClick={() => setStep(s => (s - 1) as 1 | 2 | 3 | 4)}
                className="flex items-center gap-1 px-3 py-2.5 rounded-xl bg-gray-800 text-gray-300 text-sm font-medium hover:bg-gray-700 transition-colors"
              >
                <ChevronLeft size={15} /> Înapoi
              </button>
            )}
            {step < 4 ? (
              <button
                onClick={() => { if (step === 2) setCurrentDayIdx(0); setStep(s => (s + 1) as 1 | 2 | 3 | 4) }}
                disabled={!canProceed}
                className="flex-1 flex items-center justify-center gap-1 py-2.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-40"
                style={{ backgroundColor: GOLD, color: '#111827' }}
              >
                Continuă <ChevronRight size={15} />
              </button>
            ) : (
              <button
                onClick={handleCreate}
                disabled={loading || done}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-40"
                style={{ backgroundColor: GOLD, color: '#111827' }}
              >
                {loading ? <><Loader2 size={14} className="animate-spin" /> Se creează...</> :
                 done    ? <><CheckCircle2 size={14} /> Program creat!</> :
                           'Creează programul'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
