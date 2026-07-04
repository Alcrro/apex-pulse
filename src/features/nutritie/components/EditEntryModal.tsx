import { useState, useRef, useEffect } from 'react'
import { X, ArrowLeft, Search, Loader2, Plus, PlusCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { MealEntry, FoodItem } from '../../../shared/types'
import { useFoodSearch } from '../hooks/useFoodSearch'
import { FoodSearchResult } from './FoodSearchResult'
import { toGrams } from '../utils/nutritionHelpers'

const UNITS = [
  { value: 'grame', label: 'grame' },
  { value: 'ml', label: 'ml' },
  { value: 'bucata', label: 'bucată' },
  { value: 'pounds', label: 'pounds' },
]

interface EditEntryModalProps {
  entry: MealEntry
  onSave: (entryId: string, food: FoodItem, quantity: number, unit: string) => void
  onDelete: (entryId: string) => void
  onClose: () => void
}

function entryToFood(entry: MealEntry): FoodItem {
  const g = entry.gramsEquivalent > 0 ? entry.gramsEquivalent : 100
  return {
    fdcId: entry.fdcId,
    name: entry.food?.name ?? entry.fdcId,
    nameRo: entry.food?.nameRo,
    imageUrl: entry.food?.imageUrl,
    caloriesPerG: entry.calories / g,
    proteinG: entry.proteinG / g,
    carbsG: entry.carbsG / g,
    fatG: entry.fatG / g,
  }
}

export function EditEntryModal({ entry, onSave, onDelete, onClose }: EditEntryModalProps) {
  const navigate = useNavigate()
  const [mode, setMode] = useState<'edit' | 'search'>('edit')
  const [food, setFood] = useState<FoodItem>(() => entryToFood(entry))
  const [quantity, setQuantity] = useState(String(entry.quantity))
  const [unit, setUnit] = useState(entry.unit)

  const [query, setQuery] = useState('')
  const { results, isLoading, isError, search, clearResults } = useFoodSearch()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (mode === 'search') inputRef.current?.focus()
  }, [mode])

  const previewGrams = unit === 'pounds'
    ? (parseFloat(quantity) || 0) * 453.59
    : parseFloat(quantity) || 0

  const previewKcal    = Math.round(food.caloriesPerG * previewGrams)
  const previewProtein = Math.round(food.proteinG * previewGrams * 10) / 10
  const previewCarbs   = Math.round(food.carbsG * previewGrams * 10) / 10
  const previewFat     = Math.round(food.fatG * previewGrams * 10) / 10

  function handleFoodSelect(newFood: FoodItem) {
    setFood(newFood)
    setMode('edit')
    clearResults()
    setQuery('')
  }

  function handleSave() {
    const qty = parseFloat(quantity)
    if (isNaN(qty) || qty <= 0) return
    onSave(entry.id, food, qty, unit)
    onClose()
  }

  const foodName = food.nameRo || food.name

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gray-950/60">
      <div className="flex-1 flex flex-col max-w-2xl w-full mx-auto bg-gray-950 min-h-0">

        {/* header */}
        <div className="flex items-center gap-3 px-4 pt-safe pt-4 pb-3 border-b border-gray-800 shrink-0">
          <button
            onClick={mode === 'search' ? () => { setMode('edit'); setQuery(''); clearResults() } : onClose}
            className="p-2 rounded-xl hover:bg-gray-800 text-gray-400"
          >
            {mode === 'search' ? <ArrowLeft size={20} /> : <X size={20} />}
          </button>
          <h2 className="font-bold text-white flex-1 truncate">
            {mode === 'search' ? 'Schimbă aliment' : foodName}
          </h2>
        </div>

        {mode === 'edit' ? (
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">

              {/* food row */}
              <button
                onClick={() => setMode('search')}
                className="w-full flex items-center gap-3 bg-gray-900 rounded-2xl p-4 text-left hover:bg-gray-800 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 mb-0.5">Aliment</p>
                  <p className="text-white font-semibold text-sm truncate">{foodName}</p>
                </div>
                <span className="text-xs text-orange-500 font-semibold shrink-0">Schimbă</span>
              </button>

              {/* quantity + unit */}
              <div className="bg-gray-900 rounded-2xl p-4 space-y-3">
                <div>
                  <label className="text-xs text-gray-400 block mb-1.5">Cantitate</label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    min="1"
                    className="w-full bg-gray-800 rounded-xl px-4 py-3 text-white font-semibold text-lg text-center focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1.5">Unitate</label>
                  <div className="grid grid-cols-4 gap-2">
                    {UNITS.map((u) => (
                      <button
                        key={u.value}
                        onClick={() => setUnit(u.value)}
                        className={`py-2 rounded-xl text-xs font-semibold transition-colors ${
                          unit === u.value
                            ? 'bg-orange-500 text-white'
                            : 'bg-gray-800 text-gray-400 hover:text-white'
                        }`}
                      >
                        {u.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* macro preview */}
              <div className="bg-gray-900 rounded-2xl p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Total</span>
                  <span className="text-2xl font-black text-orange-500 tabular-nums">{previewKcal} kcal</span>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-1 border-t border-gray-800">
                  <div className="text-center">
                    <p className="text-base font-bold text-blue-400 tabular-nums">{previewProtein}g</p>
                    <p className="text-xs text-gray-500 mt-0.5">Proteine</p>
                  </div>
                  <div className="text-center">
                    <p className="text-base font-bold text-yellow-400 tabular-nums">{previewCarbs}g</p>
                    <p className="text-xs text-gray-500 mt-0.5">Carbo</p>
                  </div>
                  <div className="text-center">
                    <p className="text-base font-bold text-red-400 tabular-nums">{previewFat}g</p>
                    <p className="text-xs text-gray-500 mt-0.5">Grăsimi</p>
                  </div>
                </div>
              </div>
            </div>

            {/* actions */}
            <div className="shrink-0 px-4 pb-safe pb-4 pt-3 border-t border-gray-800 flex gap-3">
              <button
                onClick={() => { onDelete(entry.id); onClose() }}
                className="px-5 py-3 rounded-2xl bg-red-500/10 hover:bg-red-500/20 text-red-400 font-semibold text-sm transition-colors"
              >
                Șterge
              </button>
              <button
                onClick={handleSave}
                disabled={!quantity || parseFloat(quantity) <= 0}
                className="flex-1 py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold disabled:opacity-40 transition-colors"
              >
                Salvează
              </button>
            </div>
          </div>
        ) : (
          /* search mode */
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="px-4 py-3 shrink-0">
              <div className="flex items-center gap-3 bg-gray-800 rounded-2xl px-4 py-3">
                <Search size={18} className="text-gray-500 shrink-0" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); search(e.target.value) }}
                  placeholder="Caută un aliment..."
                  className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none text-sm"
                />
                {isLoading && <Loader2 size={16} className="text-orange-500 animate-spin shrink-0" />}
                {query && !isLoading && (
                  <button onClick={() => { setQuery(''); clearResults() }}>
                    <X size={16} className="text-gray-500" />
                  </button>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4">
              {isError && (
                <p className="text-gray-500 text-sm text-center py-6">
                  Căutarea externă nu este disponibilă.<br />Afișăm doar rezultatele locale.
                </p>
              )}
              {!isLoading && query && results.length === 0 && (
                <div className="text-center py-8 space-y-3">
                  <p className="text-gray-500 text-sm">Niciun aliment găsit pentru „{query}"</p>
                  <button
                    onClick={() => navigate('/nutritie/aliment/custom/nou')}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 text-sm font-semibold transition-colors border border-orange-500/20"
                  >
                    <PlusCircle size={16} />
                    Adaugă aliment nou
                  </button>
                </div>
              )}
              {!query && (
                <div className="py-8 space-y-4">
                  <p className="text-gray-500 text-sm text-center">Scrie numele unui aliment pentru a căuta</p>
                  <div className="flex justify-center">
                    <button
                      onClick={() => navigate('/nutritie/aliment/custom/nou')}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-semibold transition-colors"
                    >
                      <Plus size={16} />
                      Adaugă aliment personalizat
                    </button>
                  </div>
                </div>
              )}
              {results.map((f) => (
                <FoodSearchResult key={f.fdcId} food={f} onClick={handleFoodSelect} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
