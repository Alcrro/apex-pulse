import { useState } from 'react'
import { Card } from '../../../shared/components/atoms/Card'
import { Button } from '../../../shared/components/atoms/Button'
import { SetRow } from './SetRow'
import { RpeSelector } from './RpeSelector'
import { RestTimer } from './RestTimer'
import { calculate1RM } from '../../../shared/lib/exercises'
import { getExerciseImage } from '../../../shared/lib/exercise_images'
import type { WorkoutExercise, SessionLog } from '../../../shared/types'
import { Check, Timer, Dumbbell } from 'lucide-react'

interface SessionExerciseBlockProps {
  we: WorkoutExercise
  logs: SessionLog[]
  restSeconds: number
  prevLog?: { weight: number | null; reps: number }
  onLogSet: (exerciseId: string, workoutExerciseId: string, setData: { weight: number | null; reps: number; rpe: number | null; notes: string | null }) => Promise<{ data: SessionLog | null; error: unknown }>
  onDeleteLog: (id: string) => Promise<{ error: unknown }>
}

export function SessionExerciseBlock({ we, logs, restSeconds, prevLog, onLogSet, onDeleteLog }: SessionExerciseBlockProps) {
  const exerciseLogs = logs.filter(l => l.workout_exercise_id === we.id)
  const lastLog = exerciseLogs[exerciseLogs.length - 1]

  const [form, setForm] = useState({
    weight: lastLog?.weight?.toString() ?? prevLog?.weight?.toString() ?? '',
    reps: we.reps.toString(),
    rpe: '',
    notes: '',
  })
  const [showRpe, setShowRpe] = useState(false)
  const [showTimer, setShowTimer] = useState(false)
  const [logging, setLogging] = useState(false)

  async function handleLog() {
    setLogging(true)
    await onLogSet(we.exercise_id, we.id, {
      weight: form.weight !== '' ? Number(form.weight) : null,
      reps: Number(form.reps),
      rpe: form.rpe !== '' ? Number(form.rpe) : null,
      notes: form.notes || null,
    })
    setLogging(false)
    if (restSeconds > 0) setShowTimer(true)
    setForm(p => ({ ...p, notes: '' }))
  }

  const weightNum = form.weight !== '' ? Number(form.weight) : null
  const repsNum = Number(form.reps)

  const img = we.exercises ? (we.exercises.image_url ?? getExerciseImage(we.exercises.name)) : null

  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center gap-3">
        <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-800 flex-shrink-0 flex items-center justify-center">
          {img ? (
            <img
              src={img}
              alt={we.exercises?.name}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={e => {
                (e.currentTarget as HTMLImageElement).style.display = 'none';
                (e.currentTarget.nextSibling as HTMLElement).style.display = 'flex'
              }}
            />
          ) : null}
          <span className={`text-gray-600 ${img ? 'hidden' : 'flex'} items-center justify-center w-full h-full`}>
            <Dumbbell size={22} />
          </span>
        </div>
        <div>
          <h4 className="font-bold text-white">{we.exercises?.name}</h4>
          <p className="text-xs text-gray-400">{we.exercises?.muscle_group} • {we.sets} × {we.reps} rep</p>
          {prevLog && (
            <p className="text-xs mt-0.5" style={{ color: '#D4B96A99' }}>
              Ultima dată: {prevLog.weight != null ? `${prevLog.weight} kg × ` : ''}{prevLog.reps} rep
            </p>
          )}
        </div>
      </div>

      {exerciseLogs.length > 0 && (
        <div className="space-y-0.5 border-b border-gray-800 pb-3">
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
            <span className="w-6" />
            <span className="w-16 text-center">Greutate</span>
            <span className="w-12 text-center">Reps</span>
            <span className="w-12 text-center">RPE</span>
          </div>
          {exerciseLogs.map((log, i) => (
            <SetRow key={log.id} set={log} index={i} onDelete={onDeleteLog} />
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-gray-500 block mb-1">Greutate (kg)</label>
          <input
            type="number" min="0" step="0.5" placeholder="0"
            value={form.weight}
            onChange={e => setForm(p => ({ ...p, weight: e.target.value }))}
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white text-center focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">Repetări</label>
          <input
            type="number" min="1" max="200"
            value={form.reps}
            onChange={e => setForm(p => ({ ...p, reps: e.target.value }))}
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white text-center focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setShowRpe(!showRpe)}
          className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
            form.rpe !== '' ? 'border-orange-500 text-orange-400 bg-orange-500/10' : 'border-gray-700 text-gray-500 hover:border-gray-600'
          }`}
        >
          RPE {form.rpe !== '' ? form.rpe : '+'}
        </button>
        <input
          type="text" placeholder="Notă..."
          value={form.notes}
          onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
          className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-orange-500"
        />
      </div>

      {showRpe && (
        <RpeSelector value={form.rpe} onSelect={v => setForm(p => ({ ...p, rpe: v }))} onClose={() => setShowRpe(false)} />
      )}

      {weightNum !== null && repsNum > 0 && (
        <p className="text-xs text-gray-500">
          1RM estimat: <span className="text-orange-400 font-semibold">{calculate1RM(weightNum, repsNum)} kg</span>
        </p>
      )}

      <Button variant="gold" onClick={handleLog} className="w-full" disabled={logging}>
        <Check size={16} />
        {logging ? 'Se salvează...' : `Înregistrează set ${exerciseLogs.length + 1}`}
      </Button>

      {restSeconds > 0 && exerciseLogs.length > 0 && (
        <button
          onClick={() => setShowTimer(true)}
          className="w-full flex items-center justify-center gap-2 text-sm text-gray-400 hover:text-orange-400 transition-colors"
        >
          <Timer size={14} />
          Timer pauză ({restSeconds}s)
        </button>
      )}

      {showTimer && <RestTimer seconds={restSeconds} onClose={() => setShowTimer(false)} />}
    </Card>
  )
}
