import { Plus } from 'lucide-react'
import type { MealEntry } from '../../../../shared/types'
import { FoodEntryRow } from '../FoodEntryRow'

interface Props {
  entries: MealEntry[]
  onRemove: (id: string) => void
  onEdit: (entry: MealEntry) => void
  onAddClick: () => void
}

export function MealEntryList({ entries, onRemove, onEdit, onAddClick }: Props) {
  return (
    <div className="px-4 pb-3">
      {entries.length > 0 ? (
        <div className="divide-y divide-gray-700/50">
          {entries.map((e) => (
            <FoodEntryRow key={e.id} entry={e} onRemove={onRemove} onEdit={onEdit} />
          ))}
        </div>
      ) : (
        <p className="text-xs text-gray-500 py-2">Niciun aliment adăugat</p>
      )}

      <button
        onClick={onAddClick}
        className="mt-2 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-gray-600 hover:border-orange-500/50 hover:bg-orange-500/5 text-gray-400 hover:text-orange-500 text-xs font-semibold transition-colors"
      >
        <Plus size={14} />
        Adaugă aliment
      </button>
    </div>
  )
}
