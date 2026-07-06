import { useState } from 'react'
import type { MealEntry, FoodItem } from '../../../shared/types'
import { useEditEntryForm } from '../hooks/useEditEntryForm'
import { EditModalHeader } from './edit-entry-modal/EditModalHeader'
import { EditView } from './edit-entry-modal/EditView'
import { SearchTab } from './food-search/SearchTab'

interface EditEntryModalProps {
  entry: MealEntry
  onSave: (entryId: string, food: FoodItem, quantity: number, unit: string) => void
  onDelete: (entryId: string) => void
  onClose: () => void
}

export function EditEntryModal({ entry, onSave, onDelete, onClose }: EditEntryModalProps) {
  const [mode, setMode] = useState<'edit' | 'search'>('edit')
  const {
    food, setFood, quantity, setQuantity, unit, setUnit,
    previewKcal, previewProtein, previewCarbs, previewFat,
    handleSave,
  } = useEditEntryForm(entry, onSave, onClose)

  function handleFoodSelect(newFood: FoodItem) {
    setFood(newFood)
    setMode('edit')
  }

  function handleBack() {
    setMode('edit')
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gray-950/60">
      <div className="flex-1 flex flex-col max-w-2xl w-full mx-auto bg-gray-950 min-h-0">
        <EditModalHeader
          mode={mode}
          title={food.nameRo || food.name}
          onBack={handleBack}
          onClose={onClose}
        />

        {mode === 'edit' ? (
          <EditView
            food={food}
            quantity={quantity} unit={unit}
            onQuantityChange={setQuantity} onUnitChange={setUnit}
            previewKcal={previewKcal} previewProtein={previewProtein}
            previewCarbs={previewCarbs} previewFat={previewFat}
            onSwitchToSearch={() => setMode('search')}
            onSave={handleSave}
            onDelete={() => { onDelete(entry.id); onClose() }}
            canSave={!!quantity && parseFloat(quantity) > 0}
          />
        ) : (
          <SearchTab onSelect={handleFoodSelect} />
        )}
      </div>
    </div>
  )
}
