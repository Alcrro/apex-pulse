import type { GoalType } from '../../../shared/types'
import { GoalCard } from './GoalCard'

const GOAL_TYPES: GoalType[] = ['mentinere', 'deficit_usor', 'deficit_moderat', 'surplus']

interface GoalSelectorProps {
  selected: GoalType | null
  tdee: number
  onSelect: (goal: GoalType) => void
}

export function GoalSelector({ selected, tdee, onSelect }: GoalSelectorProps) {
  return (
    <div className="space-y-3">
      {GOAL_TYPES.map(g => (
        <GoalCard key={g} goal={g} tdee={tdee} isSelected={selected === g} onSelect={onSelect} />
      ))}
    </div>
  )
}
