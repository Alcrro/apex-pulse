import { useState } from 'react'
import { Plus, ChevronDown, ChevronUp, CopyPlus } from 'lucide-react'
import type { MealEntry, MealType, FoodItem } from '../../../shared/types'
import { getMealLabel } from '../utils/nutritionHelpers'
import { FoodEntryRow } from './FoodEntryRow'
import { FoodSearchModal } from './FoodSearchModal'
import { EditEntryModal } from './EditEntryModal'
import { MealCopyPicker } from './MealCopyPicker'
import { useMealCopy } from '../hooks/useMealCopy'

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
        {/* header */}
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-3 flex-1 text-left"
          >
            <span className="w-7 h-7 rounded-lg bg-gray-800 flex items-center justify-center text-xs font-black text-gray-400 shrink-0">
              {mealType.replace('masa_', '')}
            </span>
            <span className="flex-1 text-white font-semibold text-sm">{getMealLabel(mealType)}</span>
            {entries.length > 0 && (
              <span className="text-xs text-orange-500 font-bold">{Math.round(totalKcal)} kcal</span>
            )}
            {open ? (
              <ChevronUp size={16} className="text-gray-500" />
            ) : (
              <ChevronDown size={16} className="text-gray-500" />
            )}
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); setCopyPickerOpen(true) }}
            disabled={isCopying}
            className="p-1.5 rounded-lg hover:bg-gray-700 text-gray-500 hover:text-orange-500 transition-colors disabled:opacity-40"
            title="Copiază din altă zi"
          >
            <CopyPlus size={15} />
          </button>
        </div>

        {open && (
          <div className="px-4 pb-3">
            {entries.length > 0 ? (
              <div className="divide-y divide-gray-700/50">
                {entries.map((e) => (
                  <FoodEntryRow key={e.id} entry={e} onRemove={onRemove} onEdit={setEditEntry} />
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-500 py-2">Niciun aliment adăugat</p>
            )}

            <button
              onClick={() => setSearchOpen(true)}
              className="mt-2 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-gray-600 hover:border-orange-500/50 hover:bg-orange-500/5 text-gray-400 hover:text-orange-500 text-xs font-semibold transition-colors"
            >
              <Plus size={14} />
              Adaugă aliment
            </button>
          </div>
        )}
      </div>

      {searchOpen && (
        <FoodSearchModal
          mealType={mealType}
          onAdd={onAdd}
          onClose={() => setSearchOpen(false)}
        />
      )}

      {editEntry && (
        <EditEntryModal
          entry={editEntry}
          onSave={onUpdate}
          onDelete={onRemove}
          onClose={() => setEditEntry(null)}
        />
      )}

      {copyPickerOpen && (
        <MealCopyPicker
          mealType={mealType}
          onCopy={handleCopyFrom}
          onClose={() => setCopyPickerOpen(false)}
        />
      )}
    </>
  )
}
