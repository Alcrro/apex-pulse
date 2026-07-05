import { useState, useRef, useEffect } from 'react'
import { Dumbbell, Play, Pencil, Trash2, Check, X } from 'lucide-react'
import type { ProgramWithPlans } from '../hooks/usePrograms'
import type { PlanStats } from '../hooks/useWorkoutStats'

const GOLD = '#D4B96A'

interface ProgramCardProps {
  program: ProgramWithPlans
  nextPlanId: string | null
  onActivate: () => void
  onDeactivate: () => void
  onRename: (name: string) => void
  onDelete: () => void
  onStartPlan: (planId: string) => void
  planStats: Record<string, PlanStats>
}

export function ProgramCard({
  program,
  nextPlanId,
  onActivate,
  onDeactivate,
  onRename,
  onDelete,
  onStartPlan,
  planStats,
}: ProgramCardProps) {
  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState(program.name)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing) inputRef.current?.focus()
  }, [editing])

  function handleRenameConfirm() {
    const trimmed = editName.trim()
    if (trimmed && trimmed !== program.name) onRename(trimmed)
    setEditing(false)
  }

  function handleRenameCancel() {
    setEditName(program.name)
    setEditing(false)
  }

  function handleDeleteClick() {
    if (confirm(`Ștergi programul "${program.name}" și dezasociezi toate planurile din el?`)) {
      onDelete()
    }
  }

  return (
    <div
      className="bg-gray-900 border rounded-2xl overflow-hidden"
      style={{ borderColor: program.is_active ? GOLD + '40' : '#1f2937' }}
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
            <span className="font-semibold text-white text-sm truncate">{program.name}</span>
            <button
              onClick={() => { setEditName(program.name); setEditing(true) }}
              className="p-1 rounded-lg text-gray-600 hover:text-gray-300 hover:bg-gray-800 transition-colors flex-shrink-0"
            >
              <Pencil size={12} />
            </button>
          </div>
        )}

        {program.is_active ? (
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

      <div className="divide-y divide-gray-800/60">
        {program.workout_plans.length === 0 ? (
          <div className="px-4 py-4 text-center text-gray-500 text-xs">Niciun plan în acest program</div>
        ) : (
          program.workout_plans.map(plan => {
            const isNext = plan.id === nextPlanId
            const stats = planStats[plan.id]
            return (
              <div key={plan.id} className="flex items-center gap-3 px-4 py-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: GOLD + '15' }}
                >
                  <Dumbbell size={15} style={{ color: GOLD }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white truncate">{plan.name}</span>
                    {isNext && (
                      <span
                        className="flex-shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded-full tracking-wider"
                        style={{ backgroundColor: GOLD + '25', color: GOLD, border: `1px solid ${GOLD}50` }}
                      >
                        URMĂTOR
                      </span>
                    )}
                  </div>
                  {stats && (
                    <span className="text-[11px] text-gray-500">
                      {stats.sessionCount} sesiuni
                    </span>
                  )}
                </div>
                <button
                  onClick={() => onStartPlan(plan.id)}
                  className="flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all active:scale-95"
                  style={{ backgroundColor: GOLD + '15', color: GOLD, border: `1px solid ${GOLD}30` }}
                >
                  <Play size={9} fill="currentColor" />
                  Start
                </button>
              </div>
            )
          })
        )}
      </div>

      <div className="px-4 py-2.5 border-t border-gray-800/60">
        <button
          onClick={handleDeleteClick}
          className="flex items-center gap-1.5 text-xs text-red-500/70 hover:text-red-400 transition-colors"
        >
          <Trash2 size={11} />
          Șterge program
        </button>
      </div>
    </div>
  )
}
