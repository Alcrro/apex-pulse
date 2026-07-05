import { getWeekTrainingDays, getWeeklyCount } from '../utils/formatters'
import { useTheme } from '../../../shared/context/ThemeContext'
import type { Session } from '../../../shared/types'

const DAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D']

export function WeeklyRhythmStrip({ sessions }: { sessions: Session[] }) {
  const trainingDays = getWeekTrainingDays(sessions)
  const weeklyCount = getWeeklyCount(sessions)
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const raw = new Date().getDay()
  const todayIdx = raw === 0 ? 6 : raw - 1

  const weekLabel =
    weeklyCount === 0
      ? 'Niciun antrenament săptămâna aceasta'
      : weeklyCount === 1
        ? '1 antrenament săptămâna aceasta'
        : `${weeklyCount} antrenamente săptămâna aceasta`

  return (
    <div className="bg-gray-900 rounded-xl p-5">
      <div className="text-forge-muted text-xs font-semibold tracking-widest uppercase mb-5">
        Săptămâna aceasta
      </div>

      <div className="flex justify-between items-end">
        {DAYS.map((day, i) => {
          const trained = trainingDays[i]
          const isToday = i === todayIdx

          return (
            <div key={i} className="flex flex-col items-center gap-2">
              <div
                className="w-9 h-9 rounded-full transition-all"
                style={{
                  backgroundColor: trained ? '#D4B96A' : 'transparent',
                  border: `2px solid ${trained ? '#D4B96A' : isToday ? '#909090' : isDark ? '#2A2A2A' : '#cbd5e1'}`,
                  boxShadow: trained && isToday ? '0 0 0 3px #D4B96A28' : 'none',
                }}
              />
              <span
                className="font-semibold"
                style={{
                  fontSize: '0.6rem',
                  letterSpacing: '0.05em',
                  color: isToday ? (isDark ? '#F0EFEC' : '#0f172a') : (isDark ? '#616161' : '#64748b'),
                }}
              >
                {day}
              </span>
            </div>
          )
        })}
      </div>

      <div className="mt-5 text-forge-muted text-xs">{weekLabel}</div>
    </div>
  )
}
