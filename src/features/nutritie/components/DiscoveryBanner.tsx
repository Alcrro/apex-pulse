import { useState } from 'react'
import type { GoalType } from '../../../shared/types'
import { DiscoveryBannerPrompt } from './discovery-banner/DiscoveryBannerPrompt'
import { DiscoveryBannerSelector } from './discovery-banner/DiscoveryBannerSelector'

interface DiscoveryBannerProps {
  avgCalories: number | null
  onSetGoal: (goal: GoalType) => void
}

export function DiscoveryBanner({ avgCalories, onSetGoal }: DiscoveryBannerProps) {
  const [showSelector, setShowSelector] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState<GoalType | null>(null)

  if (showSelector) {
    return (
      <DiscoveryBannerSelector
        avgCalories={avgCalories}
        selectedGoal={selectedGoal}
        onSelect={setSelectedGoal}
        onConfirm={() => { if (selectedGoal) onSetGoal(selectedGoal) }}
        onClose={() => setShowSelector(false)}
      />
    )
  }

  return <DiscoveryBannerPrompt avgCalories={avgCalories} onShowSelector={() => setShowSelector(true)} />
}
