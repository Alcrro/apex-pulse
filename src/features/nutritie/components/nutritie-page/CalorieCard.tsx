import { Bell, Settings } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { MacroBar } from './MacroBar'

interface MacroTargets {
  proteinG?: number
  carbsG?: number
  fatG?: number
}

interface Props {
  totalCalories: number
  targetCalories: number | null
  totalProtein: number
  totalCarbs: number
  totalFat: number
  macroTargets: MacroTargets
  notifCount: number
  notifOpen: boolean
  onToggleNotif: () => void
}

export function CalorieCard({
  totalCalories, targetCalories,
  totalProtein, totalCarbs, totalFat,
  macroTargets, notifCount, notifOpen, onToggleNotif,
}: Props) {
  const navigate = useNavigate()

  return (
    <div className="bg-gray-900 rounded-2xl p-4 flex flex-col gap-3">
      <div>
        <div className="flex items-center justify-between mb-1">
          <p className="text-[11px] text-gray-500">Calorii azi</p>
          <div className="flex items-center gap-0.5 -mr-1">
            <button
              onClick={onToggleNotif}
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
        {targetCalories ? (
          <p className="text-[10px] text-orange-400 mt-1 tabular-nums">
            / {targetCalories.toLocaleString('ro-RO')} kcal
          </p>
        ) : (
          <p className="text-[10px] text-gray-600 mt-1">sem obiectiv</p>
        )}
      </div>
      <div className="flex-1 flex flex-col justify-end gap-2.5">
        <MacroBar label="Proteine" value={Math.round(totalProtein)} target={macroTargets.proteinG} color="#60a5fa" />
        <MacroBar label="Carbo"    value={Math.round(totalCarbs)}   target={macroTargets.carbsG}   color="#facc15" />
        <MacroBar label="Grăsimi"  value={Math.round(totalFat)}     target={macroTargets.fatG}     color="#f97316" />
      </div>
    </div>
  )
}
