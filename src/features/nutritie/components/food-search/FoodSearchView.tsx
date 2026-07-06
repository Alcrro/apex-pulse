import { useState } from 'react'
import type { FoodItem } from '../../../../shared/types'
import { useFrequentFoods } from '../../hooks/useFrequentFoods'
import { useRecentFoods } from '../../hooks/useRecentFoods'
import { FoodSearchTabBar, type SearchTab } from './FoodSearchTabBar'
import { SearchTab as SearchTabContent } from './SearchTab'
import { FoodListTab } from './FoodListTab'
import { ScanTab } from './ScanTab'

interface Props {
  onSelect: (food: FoodItem) => void
}

export function FoodSearchView({ onSelect }: Props) {
  const [tab, setTab] = useState<SearchTab>('search')
  const { foods: frequentFoods, isLoading: freqLoading } = useFrequentFoods()
  const { foods: recentFoods, isLoading: recentLoading } = useRecentFoods()

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <FoodSearchTabBar active={tab} onChange={setTab} />

      {tab === 'search'   && <SearchTabContent onSelect={onSelect} />}
      {tab === 'frequent' && (
        <FoodListTab
          foods={frequentFoods}
          isLoading={freqLoading}
          emptyMessage="Niciun aliment frecvent — adaugă alimente în jurnal pentru a le vedea aici."
          onSelect={onSelect}
        />
      )}
      {tab === 'recent' && (
        <FoodListTab
          foods={recentFoods}
          isLoading={recentLoading}
          emptyMessage="Niciun aliment recent — adaugă alimente în jurnal pentru a le vedea aici."
          onSelect={onSelect}
        />
      )}
      {tab === 'scan' && <ScanTab onSelect={onSelect} />}
    </div>
  )
}
