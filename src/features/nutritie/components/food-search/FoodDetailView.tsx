import { useState } from 'react'
import type { FoodItem } from '../../../../shared/types'
import { useFoodDetail } from '../../hooks/useFoodDetail'
import { NutrientTable } from '../NutrientTable'
import { AminoAcidList } from '../AminoAcidList'
import { AlimentTabBar, type AlimentTab } from '../aliment-detail/AlimentTabBar'
import { calcPreview } from '../../utils/portionCalc'
import { QuantityUnitPicker } from './QuantityUnitPicker'
import { MacroPreviewCards } from './MacroPreviewCards'

interface Props {
  food: FoodItem
  quantity: string
  unit: string
  onQuantityChange: (v: string) => void
  onUnitChange: (v: string) => void
  onBack: () => void
  onAdd: () => void
  canAdd: boolean
}

export function FoodDetailView({ food, quantity, unit, onQuantityChange, onUnitChange, onBack, onAdd, canAdd }: Props) {
  const [detailTab, setDetailTab] = useState<AlimentTab>('macro')
  const { food: foodDetail, isLoading: detailLoading } = useFoodDetail(food.fdcId)
  const preview = calcPreview(food, quantity, unit)

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <QuantityUnitPicker
        quantity={quantity}
        unit={unit}
        onQuantityChange={onQuantityChange}
        onUnitChange={onUnitChange}
      />

      <div className="shrink-0">
        <AlimentTabBar active={detailTab} onChange={setDetailTab} />
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {detailTab === 'macro' && <MacroPreviewCards {...preview} />}

        {detailTab === 'micro' && (
          detailLoading
            ? <div className="space-y-2">{[1, 2, 3, 4].map((i) => <div key={i} className="h-10 bg-gray-800 rounded-xl animate-pulse" />)}</div>
            : <NutrientTable vitamins={foodDetail?.vitamins} minerals={foodDetail?.minerals} />
        )}

        {detailTab === 'aminoacizi' && (
          detailLoading
            ? <div className="space-y-2">{[1, 2, 3, 4].map((i) => <div key={i} className="h-8 bg-gray-800 rounded-xl animate-pulse" />)}</div>
            : <AminoAcidList aminoAcids={foodDetail?.aminoAcids} />
        )}
      </div>

      <div className="shrink-0 px-4 pb-safe pb-4 pt-3 border-t border-gray-800 flex gap-3">
        <button onClick={onBack} className="flex-1 py-3 rounded-2xl bg-gray-800 text-gray-300 font-semibold">
          Înapoi
        </button>
        <button
          onClick={onAdd}
          disabled={!canAdd}
          className="flex-1 py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold disabled:opacity-40 transition-colors"
        >
          Adaugă
        </button>
      </div>
    </div>
  )
}
