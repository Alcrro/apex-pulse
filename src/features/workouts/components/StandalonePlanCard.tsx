import { useState, useRef, useEffect } from 'react'
import { Play, Pencil, Trash2, Check, X } from 'lucide-react'
import type { WorkoutPlan } from '../../../shared/types'
import type { PlanStats } from '../hooks/useWorkoutStats'
import { WorkoutPlanMiniStats } from './WorkoutPlanMiniStats'

const GOLD = '#D4B96A'

interface StandalonePlanCardProps {
  workout: WorkoutPlan
  planStats?: PlanStats
  onActivate: () => void
  onDeactivate: () => void
  onRename: (name: string) => void
  onDelete: () => void
  onStart: () => void
  onView: () => void
}

export function StandalonePlanCard({
  workout,
  planStats,
  onActivate,
  onDeactivate,
  onRename,
  onDelete,
  onStart,
  onView,
}: StandalonePlanCardProps) {
  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState(workout.name)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing) inputRef.current?.focus()
  }, [editing])

  function handleRenameConfirm() {
    const trimmed = editName.trim()
    if (trimmed && trimmed !== workout.name) onRename(trimmed)
    setEditing(false)
  }

  function handleRenameCancel() {
    setEditName(workout.name)
    setEditing(false)
  }

  function handleDeleteClick() {
    if (confirm(`Ștergi planul "${workout.name}" și toate exercițiile din el?`)) {
      onDelete()
    }
  }

  return (
    <div
      className="bg-gray-900 border rounded-2xl overflow-hidden"
      style={{ borderColor: workout.is_active ? GOLD + '40' : '#1f2937' }}
    >
      <div className="flex items-center justify-between px-4 pt-3.5 pb-3 border-b border-gray-800/60">
        {editing ? (
          <div className="flex items-center gap-2 flex-1 mr-2">
            <input
              ref={inputRef}
              value={editName}
              onChange={e => setEditName(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleRenameConfirm()
                if (e.key === 'Escape') handleRenameCancel()
              }}
              className="flex-1 bg-gray-800 text-white text-sm font-semibold px-2.5 py-1 rounded-lg outline-none border border-gray-700 focus:border-yellow-600/50"
            />
            <button onClick={handleRenameConfirm} className="p-1.5 rounded-lg text-green-400 hover:bg-green-400/10 transition-colors">
              <Check size={14} />
            </button>
            <button onClick={handleRenameCancel} className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-700 transition-colors">
              <X size={14} />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <button
              onClick={onView}
              className="font-semibold text-white text-sm truncate hover:underline text-left"
            >
              {workout.name}
            </button>
            <button
              onClick={() => { setEditName(workout.name); setEditing(true) }}
              className="p-1 rounded-lg text-gray-600 hover:text-gray-300 hover:bg-gray-800 transition-colors flex-shrink-0"
            >
              <Pencil size={12} />
            </button>
          </div>
        )}

        {workout.is_active ? (
          <button
            onClick={onDeactivate}
            className="flex-shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-lg tracking-wider transition-all"
            style={{ backgroundColor: GOLD + '20', color: GOLD, border: `1px solid ${GOLD}40` }}
          >
            ACTIV
          </button>
        ) : (
          <button
            onClick={onActivate}
            className="flex-shrink-0 text-[10px] font-semibold px-2.5 py-1 rounded-lg text-gray-400 hover:text-white border border-gray-700 hover:border-gray-600 transition-all"
          >
            Activează
          </button>
        )}
      </div>

      <div className="px-4 py-3">
        <WorkoutPlanMiniStats
          sessionCount={planStats?.sessionCount ?? 0}
          lastSessionDate={planStats?.lastSessionDate ?? null}
          avgDurationMinutes={planStats?.avgDurationMinutes ?? null}
          exerciseCount={workout.workout_exercises?.[0]?.count ?? 0}
          editCount={workout.edit_count ?? 0}
        />
      </div>

      <div className="flex items-center justify-between px-4 py-2.5 border-t border-gray-800/60">
        <button
          onClick={handleDeleteClick}
          className="flex items-center gap-1.5 text-xs text-red-500/70 hover:text-red-400 transition-colors"
        >
          <Trash2 size={11} />
          Șterge plan
        </button>
        <button
          onClick={onStart}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all active:scale-95"
          style={{ backgroundColor: GOLD + '15', color: GOLD, border: `1px solid ${GOLD}30` }}
        >
          <Play size={9} fill="currentColor" />
          Start
        </button>
      </div>
    </div>
  )
}
