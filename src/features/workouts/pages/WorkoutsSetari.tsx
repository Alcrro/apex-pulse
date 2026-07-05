import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, Dumbbell } from 'lucide-react'
import { useWorkouts } from '../hooks/useWorkouts'
import { WorkoutCard } from '../components/WorkoutCard'
import { CreateWorkoutModal } from '../components/CreateWorkoutModal'
import { SplitConfigurator } from '../components/SplitConfigurator'
import { Card } from '../../../shared/components/atoms/Card'

const GOLD = '#D4B96A'

export function WorkoutsSetariPage() {
  const navigate = useNavigate()
  const { workouts, loading, createWorkout, deleteWorkout, refetch } = useWorkouts()
  const [showCreate, setShowCreate] = useState(false)
  const [saving, setSaving] = useState(false)

  async function handleCreate(name: string, description: string) {
    setSaving(true)
    const { data, error } = await createWorkout(name, description)
    setSaving(false)
    if (!error && data) {
      setShowCreate(false)
      navigate(`/antrenamente/${data.id}`)
    }
  }

  async function handleDelete(e: React.MouseEvent, id: string) {
    e.stopPropagation()
    if (!confirm('Ștergi planul și toate exercițiile din el?')) return
    await deleteWorkout(id)
  }

  return (
    <div className="pb-8">
      <div className="flex items-center gap-3 py-3 mb-2">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl hover:bg-gray-800 text-gray-400 hover:text-white transition-colors -ml-1"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-bold text-white flex-1">Planurile mele</h1>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-xl transition-all active:scale-95"
          style={{ backgroundColor: GOLD + '1A', color: GOLD, border: `1px solid ${GOLD}40` }}
        >
          <Plus size={15} />
          Nou
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-4 h-20 animate-pulse" />
          ))}
        </div>
      ) : workouts.length === 0 ? (
        <Card className="p-8 text-center">
          <Dumbbell size={40} className="text-gray-600 mx-auto mb-3" />
          <p className="text-gray-300 font-semibold mb-1">Niciun plan creat</p>
          <p className="text-gray-500 text-sm mb-4">Creează primul tău plan de antrenament</p>
          <button
            onClick={() => setShowCreate(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all active:scale-95"
            style={{ backgroundColor: GOLD + '1A', color: GOLD, border: `1px solid ${GOLD}40` }}
          >
            <Plus size={16} />
            Creează plan
          </button>
        </Card>
      ) : (
        <div className="space-y-3">
          {workouts.map(w => (
            <WorkoutCard
              key={w.id}
              workout={w}
              onClick={() => navigate(`/antrenamente/${w.id}`)}
              onDelete={e => handleDelete(e, w.id)}
            />
          ))}
        </div>
      )}

      <CreateWorkoutModal
        open={showCreate}
        saving={saving}
        onClose={() => setShowCreate(false)}
        onSubmit={handleCreate}
      />

      {/* ── Generare AI ── */}
      <div className="mt-6">
        <SplitConfigurator onGenerated={refetch} />
      </div>
    </div>
  )
}
