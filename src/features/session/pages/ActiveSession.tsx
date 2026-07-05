import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSessions, useActiveSession, usePreviousExerciseLogs } from '../hooks/useSessions'
import { useWorkoutDetail } from '../../workouts/hooks/useWorkouts'
import { SessionExerciseBlock } from '../components/SessionExerciseBlock'
import { SessionHeader } from '../components/SessionHeader'
import { FinishSessionModal } from '../components/FinishSessionModal'

export function ActiveSessionPage() {
  const { workoutId } = useParams<{ workoutId: string }>()
  const navigate = useNavigate()
  const { startSession, finishSession } = useSessions()
  const { exercises } = useWorkoutDetail(workoutId)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const { session, logs, logSet, deleteLog } = useActiveSession(sessionId)
  const prevLogs = usePreviousExerciseLogs(exercises.map(e => e.exercise_id), sessionId)
  const [starting, setStarting] = useState(true)
  const [showFinish, setShowFinish] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const startRef = useRef<number>(Date.now())

  useEffect(() => {
    if (!workoutId) { navigate('/'); return }
    async function init() {
      const { data, error } = await startSession(workoutId!)
      if (error || !data) { navigate('/'); return }
      setSessionId(data.id)
      startRef.current = Date.now()
      setStarting(false)
    }
    init()
  }, [])

  useEffect(() => {
    const t = setInterval(() => setElapsed(Math.floor((Date.now() - startRef.current) / 1000)), 1000)
    return () => clearInterval(t)
  }, [])

  async function handleFinish(notes: string) {
    if (!sessionId) return
    await finishSession(sessionId, notes)
    navigate('/')
  }

  if (starting) return (
    <div className="pt-16 text-center text-gray-400">Se pregătește sesiunea...</div>
  )

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-2xl w-full mx-auto px-4 pt-4 pb-8 space-y-4">
      <SessionHeader
        title={session?.workout_plans?.name ?? 'Antrenament activ'}
        elapsed={elapsed}
        onBack={() => setShowFinish(true)}
        onFinish={() => setShowFinish(true)}
      />

      <div className="space-y-5">
        {Object.entries(
          exercises.reduce<Record<string, typeof exercises>>((acc, we) => {
            const group = we.exercises?.muscle_group ?? 'Altele'
            if (!acc[group]) acc[group] = []
            acc[group].push(we)
            return acc
          }, {})
        ).map(([group, items]) => (
          <div key={group}>
            <p className="text-xs font-semibold uppercase tracking-widest mb-2 px-1" style={{ color: '#D4B96A' }}>{group}</p>
            <div className="space-y-3">
              {items.map(we => (
                <SessionExerciseBlock
                  key={we.id}
                  we={we}
                  logs={logs}
                  restSeconds={we.rest_seconds ?? 90}
                  prevLog={prevLogs[we.exercise_id]}
                  onLogSet={logSet}
                  onDeleteLog={deleteLog}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <FinishSessionModal
        open={showFinish}
        elapsed={elapsed}
        logsCount={logs.length}
        onClose={() => setShowFinish(false)}
        onSave={handleFinish}
      />
      </div>
    </div>
  )
}
