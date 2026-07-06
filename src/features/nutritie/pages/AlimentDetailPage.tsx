import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useFoodDetail } from '../hooks/useFoodDetail'
import { NutrientTable } from '../components/NutrientTable'
import { AminoAcidList } from '../components/AminoAcidList'
import { AlimentDetailSkeleton } from '../components/aliment-detail/AlimentDetailSkeleton'
import { AlimentNotFound } from '../components/aliment-detail/AlimentNotFound'
import { AlimentHeader } from '../components/aliment-detail/AlimentHeader'
import { PortionSelector } from '../components/aliment-detail/PortionSelector'
import { AlimentTabBar, type AlimentTab } from '../components/aliment-detail/AlimentTabBar'
import { MacroTabContent } from '../components/aliment-detail/MacroTabContent'
import { calcPortion } from '../utils/portionCalc'

export function AlimentDetailPage() {
  const { fdcId } = useParams<{ fdcId: string }>()
  const { food, isLoading } = useFoodDetail(fdcId)
  const [grams, setGrams] = useState('100')
  const [tab, setTab] = useState<AlimentTab>('macro')

  if (isLoading) return <AlimentDetailSkeleton />
  if (!food) return <AlimentNotFound />

  const { gramsNum, portion } = calcPortion(food, grams)

  return (
    <div className="flex flex-col min-h-screen bg-gray-950">
      <AlimentHeader name={food.nameRo || food.name} brand={food.brand} />

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          <PortionSelector value={grams} onChange={setGrams} />
          <AlimentTabBar active={tab} onChange={setTab} />

          {tab === 'macro' && <MacroTabContent portion={portion} gramsNum={gramsNum} />}
          {tab === 'micro' && <NutrientTable vitamins={food.vitamins} minerals={food.minerals} />}
          {tab === 'aminoacizi' && <AminoAcidList aminoAcids={food.aminoAcids} />}
        </div>
      </div>
    </div>
  )
}
