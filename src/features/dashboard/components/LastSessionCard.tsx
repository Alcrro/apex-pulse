import { History } from 'lucide-react'
import { formatDate, getDuration, getDaysSince } from '../utils/formatters'
import type { Session } from '../../../shared/types'

export function LastSessionCard({ session }: { session: Session }) {
  const daysSince = getDaysSince(session.started_at)
  const recencyLabel =
    daysSince === 0 ? 'Azi' : daysSince === 1 ? 'Ieri' : `${daysSince} zile în urmă`

  return (
    <div>
      <h3 className="text-forge-muted text-xs font-semibold tracking-widest uppercase mb-3 flex items-center gap-2">
        <History size={12} />
        Ultima sesiune
      </h3>
      <div className="bg-forge-surface rounded-xl p-4 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="font-semibold text-forge-text truncate">
            {session.workout_plans?.name ?? 'Antrenament liber'}
          </div>
          <div className="text-forge-muted text-xs mt-0.5">
            {formatDate(session.started_at)}
            {session.finished_at && ` · ${getDuration(session.started_at, session.finished_at)}`}
          </div>
          {session.notes && (
            <div className="text-forge-muted text-xs mt-1.5 italic truncate">"{session.notes}"</div>
          )}
        </div>
        <div className="text-forge-muted text-xs whitespace-nowrap">{recencyLabel}</div>
      </div>
    </div>
  )
}
