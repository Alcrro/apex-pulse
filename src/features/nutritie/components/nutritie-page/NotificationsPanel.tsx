import { AlertTriangle, Info, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { NutritionNotification } from '../../utils/nutritionHelpers'

interface Props {
  open: boolean
  notifications: NutritionNotification[]
  onClose: () => void
}

export function NotificationsPanel({ open, notifications, onClose }: Props) {
  const navigate = useNavigate()

  if (!open) return null

  function goToSettings() {
    navigate('/nutritie/setari')
    onClose()
  }

  return (
    <div className="bg-gray-900 rounded-2xl overflow-hidden">
      {notifications.length > 0 ? (
        <>
          <p className="text-[10px] text-gray-600 font-semibold uppercase tracking-wider px-4 pt-3 pb-1">
            Recomandări
          </p>
          {notifications.map((n, i) => (
            <button
              key={n.id}
              onClick={goToSettings}
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
              <ChevronRight size={14} className="text-gray-600 shrink-0 mt-1" />
            </button>
          ))}
          <div className="px-4 pb-3 pt-2">
            <button
              onClick={goToSettings}
              className="w-full py-2.5 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 text-xs font-bold transition-colors"
            >
              Deschide setările nutriție
            </button>
          </div>
        </>
      ) : (
        <div className="px-4 py-4">
          <span className="text-xs text-gray-500">Totul e la zi — nicio recomandare.</span>
        </div>
      )}
    </div>
  )
}
