import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, Dumbbell, LayoutList, Layers, FolderInput } from 'lucide-react'
import { usePrograms, getNextPlan } from '../hooks/usePrograms'
import { useWorkoutStats } from '../hooks/useWorkoutStats'
import { useSessions } from '../../session/hooks/useSessions'
import { StandalonePlanCard } from '../components/StandalonePlanCard'
import { WorkoutStatsCard } from '../components/WorkoutStatsCard'
import { ProgramCard } from '../components/ProgramCard'
import { CreateWorkoutModal } from '../components/CreateWorkoutModal'
import { SplitConfigurator } from '../components/SplitConfigurator'
import { useWorkouts } from '../hooks/useWorkouts'

const GOLD = '#D4B96A'

export function WorkoutsSetariPage() {
  const navigate = useNavigate()
  const {
    programs,
    standaloneWorkouts,
    loading,
    activateProgram,
    activateStandalonePlan,
    deactivateAll,
    renameProgram,
    deleteProgram,
    groupStandaloneIntoProgram,
    refetch,
  } = usePrograms()
  const { createWorkout, deleteWorkout, updateWorkout } = useWorkouts()
  const { stats, planStats, loading: statsLoading } = useWorkoutStats()
  const { sessions } = useSessions()
  const [showCreate, setShowCreate] = useState(false)
  const [saving, setSaving] = useState(false)
  const [groupingName, setGroupingName] = useState('')
  const [showGroupInput, setShowGroupInput] = useState(false)
  const [grouping, setGrouping] = useState(false)

  async function handleCreate(name: string, description: string) {
    setSaving(true)
    const { data, error } = await createWorkout(name, description)
    setSaving(false)
    if (!error && data) {
      setShowCreate(false)
      navigate(`/antrenamente/${data.id}`)
    }
  }

  async function handleGroup() {
    const name = groupingName.trim()
    if (!name) return
    setGrouping(true)
    await groupStandaloneIntoProgram(standaloneWorkouts.map(w => w.id), name)
    setGrouping(false)
    setShowGroupInput(false)
    setGroupingName('')
  }

  return (
    <div className="pb-8 space-y-4">
      <div className="flex items-center gap-3 py-1">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl hover:bg-gray-800 text-gray-400 hover:text-white transition-colors -ml-1"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-bold text-white flex-1">Planurile mele</h1>
      </div>

      <WorkoutStatsCard stats={stats} loading={statsLoading} />

      <SplitConfigurator onGenerated={refetch} />

      {programs.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-widest flex items-center gap-1.5 px-1" style={{ color: GOLD }}>
            <Layers size={12} />
            Programe
          </p>
          {programs.map(program => {
            const nextPlan = getNextPlan(program, sessions)
            return (
              <ProgramCard
                key={program.id}
                program={program}
                nextPlanId={nextPlan?.id ?? null}
                onActivate={() => activateProgram(program.id)}
                onDeactivate={() => deactivateAll()}
                onRename={name => renameProgram(program.id, name)}
                onDelete={() => deleteProgram(program.id)}
                onStartPlan={planId => navigate(`/sesiune/${planId}`)}
                planStats={planStats}
              />
            )
          })}
        </div>
      )}

      {(standaloneWorkouts.length > 0 || !loading) && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <p className="text-xs font-semibold uppercase tracking-widest flex items-center gap-1.5" style={{ color: GOLD }}>
              <LayoutList size={12} />
              Planuri independente
            </p>
            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg transition-all active:scale-95"
              style={{ backgroundColor: GOLD + '1A', color: GOLD, border: `1px solid ${GOLD}30` }}
            >
              <Plus size={12} />
              Nou
            </button>
          </div>

          {!loading && standaloneWorkouts.length >= 2 && (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl px-4 py-3">
              {showGroupInput ? (
                <div className="space-y-2.5">
                  <p className="text-xs text-gray-400">
                    Grupează cele <span className="text-white font-semibold">{standaloneWorkouts.length} planuri</span> într-un program cu rotație automată:
                  </p>
                  <input
                    type="text"
                    value={groupingName}
                    onChange={e => setGroupingName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleGroup()}
                    placeholder="ex: Split Grupe Musculare"
                    autoFocus
                    className="w-full px-3 py-2 rounded-xl text-sm outline-none bg-gray-800 border border-gray-700 text-white placeholder-gray-600 focus:border-yellow-600/50"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleGroup}
                      disabled={!groupingName.trim() || grouping}
                      className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all active:scale-95 disabled:opacity-40"
                      style={{ backgroundColor: GOLD + '20', color: GOLD, border: `1px solid ${GOLD}40` }}
                    >
                      {grouping ? 'Se grupează…' : 'Grupează'}
                    </button>
                    <button
                      onClick={() => { setShowGroupInput(false); setGroupingName('') }}
                      className="px-4 py-2 rounded-xl text-xs text-gray-500 hover:text-gray-300 border border-gray-800 transition-colors"
                    >
                      Anulează
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowGroupInput(true)}
                  className="w-full flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  <FolderInput size={15} style={{ color: GOLD }} />
                  <span>Grupează toate într-un program</span>
                </button>
              )}
            </div>
          )}

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-gray-800 rounded-2xl p-4 h-24 animate-pulse" />
              ))}
            </div>
          ) : standaloneWorkouts.length === 0 ? (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl px-4 py-8 text-center">
              <Dumbbell size={36} className="text-gray-600 mx-auto mb-2" />
              <p className="text-gray-400 text-sm font-semibold mb-1">Niciun plan independent</p>
              <p className="text-gray-500 text-xs mb-4">Creează un plan sau generează un split cu AI</p>
              <button
                onClick={() => setShowCreate(true)}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all active:scale-95"
                style={{ backgroundColor: GOLD + '1A', color: GOLD, border: `1px solid ${GOLD}40` }}
              >
                <Plus size={13} />
                Creează plan
              </button>
            </div>
          ) : (
            standaloneWorkouts.map(w => (
              <StandalonePlanCard
                key={w.id}
                workout={w}
                planStats={planStats[w.id]}
                onActivate={() => activateStandalonePlan(w.id)}
                onDeactivate={() => deactivateAll()}
                onRename={name => updateWorkout(w.id, { name })}
                onDelete={async () => { await deleteWorkout(w.id); refetch() }}
                onStart={() => navigate(`/sesiune/${w.id}`)}
                onView={() => navigate(`/antrenamente/${w.id}`)}
              />
            ))
          )}
        </div>
      )}

      <CreateWorkoutModal
        open={showCreate}
        saving={saving}
        onClose={() => setShowCreate(false)}
        onSubmit={handleCreate}
      />
    </div>
  )
}
