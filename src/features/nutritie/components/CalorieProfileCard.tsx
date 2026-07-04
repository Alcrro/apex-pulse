import { useNavigate } from 'react-router-dom'
import { TrendingUp, ChevronRight } from 'lucide-react'

interface CalorieProfileCardProps {
  avgCalories: number | null
  daysLogged: number
  onSetGoal: () => void
}

export function CalorieProfileCard({ avgCalories, daysLogged, onSetGoal }: CalorieProfileCardProps) {
  const navigate = useNavigate()

  function handleSetGoal() {
    onSetGoal()
    navigate('/nutritie/setari')
  }

  return (
    <div className="bg-gray-900 rounded-2xl p-4 space-y-3">
      <div className="flex items-center gap-2">
        <TrendingUp size={16} className="text-orange-500" />
        <span className="text-sm font-semibold text-white">Profilul tău caloric</span>
      </div>

      {avgCalories !== null ? (
        <>
          <div>
            <p className="text-3xl font-black text-orange-500 tabular-nums">
              {avgCalories.toLocaleString('ro-RO')}
              <span className="text-base text-gray-400 font-normal ml-1">kcal/zi</span>
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Media din ultimele {daysLogged} {daysLogged === 1 ? 'zi logată' : 'zile logate'}
            </p>
          </div>

          <button
            onClick={handleSetGoal}
            className="w-full flex items-center justify-between py-3 px-4 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 text-sm font-semibold transition-colors border border-orange-500/20"
          >
            Setează obiectiv
            <ChevronRight size={16} />
          </button>
        </>
      ) : (
        <p className="text-sm text-gray-400 leading-relaxed">
          Loghează alimente câteva zile pentru a-ți calcula profilul caloric și a primi recomandări personalizate.
        </p>
      )}
    </div>
  )
}
