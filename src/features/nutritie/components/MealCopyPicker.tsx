import { useState, useEffect } from 'react'
import { X, Copy } from 'lucide-react'
import { supabase } from '../../../shared/lib/supabase'
import { useAuth } from '../../../shared/context/AuthContext'
import type { MealType } from '../../../shared/types'
import { formatDate, addDays } from '../utils/nutritionHelpers'

interface DayOption {
  date: string
  label: string
  count: number
}

interface MealCopyPickerProps {
  mealType: MealType
  onCopy: (fromDate: string) => void
  onClose: () => void
}

function getDayLabel(dateStr: string): string {
  const today = formatDate(new Date())
  const yesterday = addDays(today, -1)
  if (dateStr === today) return 'Azi'
  if (dateStr === yesterday) return 'Ieri'
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('ro-RO', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
  })
}

export function MealCopyPicker({ mealType, onCopy, onClose }: MealCopyPickerProps) {
  const { user } = useAuth()
  const [days, setDays] = useState<DayOption[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    setIsLoading(true)

    const today = formatDate(new Date())
    const from = addDays(today, -30)

    supabase
      .from('meal_entries')
      .select('fdc_id, meal_type, added_at, nutrition_logs!inner(log_date)')
      .eq('user_id', user.id)
      .eq('meal_type', mealType)
      .is('deleted_at', null)
      .gte('added_at', `${from}T00:00:00`)
      .order('added_at', { ascending: false })
      .then(({ data }) => {
        const countByDate = new Map<string, number>()
        for (const row of data ?? []) {
          const logDate = (row.nutrition_logs as any)?.log_date
          if (!logDate) continue
          countByDate.set(logDate, (countByDate.get(logDate) ?? 0) + 1)
        }

        const result: DayOption[] = []
        for (let i = 1; i <= 30; i++) {
          const d = addDays(today, -i)
          const count = countByDate.get(d) ?? 0
          if (count > 0) {
            result.push({ date: d, label: getDayLabel(d), count })
          }
        }
        setDays(result)
      })
      .catch(() => setDays([]))
      .finally(() => setIsLoading(false))
  }, [user, mealType])

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gray-950">
      <div className="flex items-center gap-3 px-4 pt-safe pt-4 pb-3 border-b border-gray-800">
        <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-800 text-gray-400">
          <X size={20} />
        </button>
        <h2 className="font-bold text-white flex-1">Copiază din altă zi</h2>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-800 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : days.length === 0 ? (
          <div className="text-center py-12">
            <Copy size={32} className="text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">Nicio masă de copiat în ultimele 30 de zile.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {days.map((day) => (
              <button
                key={day.date}
                onClick={() => { onCopy(day.date); onClose() }}
                className="w-full flex items-center gap-4 p-4 bg-gray-800 hover:bg-gray-700 rounded-2xl transition-colors text-left"
              >
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white capitalize">{day.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{day.date}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-sm font-bold text-orange-500">{day.count}</span>
                  <span className="text-xs text-gray-500 ml-1">{day.count === 1 ? 'aliment' : 'alimente'}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="px-4 pb-safe pb-6 pt-3 border-t border-gray-800">
        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-2xl bg-gray-800 text-gray-300 font-semibold"
        >
          Anulează
        </button>
      </div>
    </div>
  )
}
