import { useState } from 'react'
import type { MealEntry, MealType, FoodItem } from '../../../shared/types'
import { FoodSearchModal } from './FoodSearchModal'
import { EditEntryModal } from './EditEntryModal'
import { MealCopyPicker } from './MealCopyPicker'
import { useMealCopy } from '../hooks/useMealCopy'
import { MealCardHeader } from './meal-card/MealCardHeader'
import { MealEntryList } from './meal-card/MealEntryList'

interface MealCardProps {
  mealType: MealType
  entries: MealEntry[]
  onAdd: (food: FoodItem, quantity: number, unit: string, mealType: MealType) => void
  onUpdate: (entryId: string, food: FoodItem, quantity: number, unit: string) => void
  onRemove: (entryId: string) => void
}

export function MealCard({ mealType, entries, onAdd, onUpdate, onRemove }: MealCardProps) {
  const [open, setOpen] = useState(true)
  const [searchOpen, setSearchOpen] = useState(false)
  const [editEntry, setEditEntry] = useState<MealEntry | null>(null)
  const [copyPickerOpen, setCopyPickerOpen] = useState(false)
  const { fetchDayMealEntries, copyEntries, isLoading: isCopying } = useMealCopy()

  const totalKcal = entries.reduce((s, e) => s + e.calories, 0)

  async function handleCopyFrom(fromDate: string) {
    const sourceEntries = await fetchDayMealEntries(fromDate, mealType)
    await copyEntries(sourceEntries, '', mealType, onAdd)
  }

  return (
    <>
      <div className="bg-gray-900 rounded-2xl overflow-hidden">
        <MealCardHeader
          mealType={mealType}
          open={open}
          totalKcal={totalKcal}
          hasEntries={entries.length > 0}
          isCopying={isCopying}
          onToggle={() => setOpen((v) => !v)}
          onOpenCopy={() => setCopyPickerOpen(true)}
        />
        {open && (
          <MealEntryList
            entries={entries}
            onRemove={onRemove}
            onEdit={setEditEntry}
            onAddClick={() => setSearchOpen(true)}
          />
        )}
      </div>

      {searchOpen && (
        <FoodSearchModal mealType={mealType} onAdd={onAdd} onClose={() => setSearchOpen(false)} />
      )}
      {editEntry && (
        <EditEntryModal entry={editEntry} onSave={onUpdate} onDelete={onRemove} onClose={() => setEditEntry(null)} />
      )}
      {copyPickerOpen && (
        <MealCopyPicker mealType={mealType} onCopy={handleCopyFrom} onClose={() => setCopyPickerOpen(false)} />
      )}
    </>
  )
}
