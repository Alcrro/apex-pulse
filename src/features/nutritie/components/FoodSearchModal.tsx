import { useState, useEffect, useRef } from 'react'
import { X, Search, Loader2, Plus, PlusCircle, Camera, ScanLine } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { FoodItem, MealType } from '../../../shared/types'
import { useFoodSearch } from '../hooks/useFoodSearch'
import { useFrequentFoods } from '../hooks/useFrequentFoods'
import { useRecentFoods } from '../hooks/useRecentFoods'
import { useFoodDetail } from '../hooks/useFoodDetail'
import { useBarcodeLookup } from '../hooks/useBarcodeLookup'
import { FoodSearchResult } from './FoodSearchResult'
import { NutrientTable } from './NutrientTable'
import { AminoAcidList } from './AminoAcidList'
import { BarcodeScanner } from './BarcodeScanner'
import { getMealLabel } from '../utils/nutritionHelpers'

type DetailTab = 'macro' | 'micro' | 'aminoacizi'

const UNITS = [
  { value: 'grame', label: 'grame' },
  { value: 'ml', label: 'ml' },
  { value: 'bucata', label: 'bucată' },
  { value: 'pounds', label: 'pounds' },
]

type Tab = 'search' | 'frequent' | 'recent' | 'scan'
type ScanPhase = 'scanner' | 'loading' | 'notfound' | 'error'

interface FoodSearchModalProps {
  mealType: MealType
  onAdd: (food: FoodItem, quantity: number, unit: string, mealType: MealType) => void
  onClose: () => void
}

export function FoodSearchModal({ mealType, onAdd, onClose }: FoodSearchModalProps) {
  const navigate = useNavigate()
  const [tab, setTab] = useState<Tab>('search')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<FoodItem | null>(null)
  const [quantity, setQuantity] = useState('100')
  const [unit, setUnit] = useState('grame')
  const [detailTab, setDetailTab] = useState<DetailTab>('macro')
  const [scanPhase, setScanPhase] = useState<ScanPhase>('scanner')
  const inputRef = useRef<HTMLInputElement>(null)
  const { results, isLoading, isError, search, clearResults } = useFoodSearch()
  const { foods: frequentFoods, isLoading: freqLoading } = useFrequentFoods()
  const { foods: recentFoods, isLoading: recentLoading } = useRecentFoods()
  const { food: foodDetail, isLoading: detailLoading } = useFoodDetail(selected?.fdcId)
  const { food: scannedFood, isLoading: barcodeLoading, isNotFound, error: barcodeError, lookup, reset: resetLookup } = useBarcodeLookup()

  useEffect(() => { inputRef.current?.focus() }, [])

  // Barcode scan effects
  useEffect(() => {
    if (scannedFood) {
      setSelected(scannedFood)
      setScanPhase('scanner')
      resetLookup()
    }
  }, [scannedFood]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isNotFound) setScanPhase('notfound')
    else if (barcodeError) setScanPhase('error')
  }, [isNotFound, barcodeError])

  function handleBarcodeDetected(barcode: string) {
    setScanPhase('loading')
    lookup(barcode)
  }

  function handleTabChange(newTab: Tab) {
    if (newTab !== 'scan') {
      setScanPhase('scanner')
      resetLookup()
    }
    setTab(newTab)
  }

  function handleRescan() {
    resetLookup()
    setScanPhase('scanner')
  }

  function handleQueryChange(val: string) {
    setQuery(val)
    search(val)
  }

  function handleSelect(food: FoodItem) {
    setSelected(food)
    setDetailTab('macro')
    clearResults()
  }

  function handleAdd() {
    if (!selected) return
    const qty = parseFloat(quantity)
    if (isNaN(qty) || qty <= 0) return
    onAdd(selected, qty, unit, mealType)
    onClose()
  }

  const previewGrams = selected
    ? (unit === 'pounds' ? (parseFloat(quantity) || 0) * 453.59 : parseFloat(quantity) || 0)
    : 0

  const previewKcal = selected ? Math.round(selected.caloriesPerG * previewGrams) : 0
  const previewProtein = selected ? Math.round(selected.proteinG * previewGrams * 10) / 10 : 0
  const previewCarbs = selected ? Math.round(selected.carbsG * previewGrams * 10) / 10 : 0
  const previewFat = selected ? Math.round(selected.fatG * previewGrams * 10) / 10 : 0

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gray-950/60">
      <div className="flex-1 flex flex-col max-w-2xl w-full mx-auto bg-gray-950 min-h-0">
      {/* header */}
      <div className="flex items-center gap-3 px-4 pt-safe pt-4 pb-3 border-b border-gray-800">
        <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-800 text-gray-400">
          <X size={20} />
        </button>
        <h2 className="font-bold text-white flex-1">
          {selected ? selected.nameRo || selected.name : `Adaugă la ${getMealLabel(mealType)}`}
        </h2>
      </div>

      {selected ? (
        /* ─── confirmare + detalii nutritionale ─────────── */
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* quantity + unit — sticky top */}
          <div className="shrink-0 px-4 pt-3 pb-2 border-b border-gray-800 space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <label className="text-xs text-gray-400 block mb-1">Cantitate</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  min="1"
                  className="w-full bg-gray-800 rounded-xl px-3 py-2.5 text-white font-semibold text-base text-center focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs text-gray-400 block mb-1">Unitate</label>
                <div className="grid grid-cols-4 gap-1">
                  {UNITS.map((u) => (
                    <button
                      key={u.value}
                      onClick={() => setUnit(u.value)}
                      className={`py-2 rounded-lg text-xs font-semibold transition-colors ${
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
          </div>

          {/* detail tabs */}
          <div className="shrink-0 flex border-b border-gray-800">
            {(['macro', 'micro', 'aminoacizi'] as DetailTab[]).map((t) => {
              const labels: Record<DetailTab, string> = { macro: 'Macro', micro: 'Micro', aminoacizi: 'Aminoacizi' }
              return (
                <button
                  key={t}
                  onClick={() => setDetailTab(t)}
                  className={`flex-1 py-3 text-xs font-semibold transition-colors border-b-2 ${
                    detailTab === t
                      ? 'border-orange-500 text-orange-500'
                      : 'border-transparent text-gray-500 hover:text-white'
                  }`}
                >
                  {labels[t]}
                </button>
              )
            })}
          </div>

          {/* tab content */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {detailTab === 'macro' && (
              <>
                <div className="bg-gray-900 rounded-2xl p-4 flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Calorii</span>
                  <span className="text-3xl font-black text-orange-500 tabular-nums">{previewKcal} kcal</span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-gray-900 rounded-2xl p-4 text-center">
                    <p className="text-xl font-black text-blue-400 tabular-nums">{previewProtein}g</p>
                    <p className="text-xs text-gray-400 mt-1">Proteine</p>
                  </div>
                  <div className="bg-gray-900 rounded-2xl p-4 text-center">
                    <p className="text-xl font-black text-yellow-400 tabular-nums">{previewCarbs}g</p>
                    <p className="text-xs text-gray-400 mt-1">Carbohidrați</p>
                  </div>
                  <div className="bg-gray-900 rounded-2xl p-4 text-center">
                    <p className="text-xl font-black text-red-400 tabular-nums">{previewFat}g</p>
                    <p className="text-xs text-gray-400 mt-1">Grăsimi</p>
                  </div>
                </div>
              </>
            )}

            {detailTab === 'micro' && (
              detailLoading
                ? <div className="space-y-2">{[1,2,3,4].map(i => <div key={i} className="h-10 bg-gray-800 rounded-xl animate-pulse" />)}</div>
                : <NutrientTable vitamins={foodDetail?.vitamins} minerals={foodDetail?.minerals} />
            )}

            {detailTab === 'aminoacizi' && (
              detailLoading
                ? <div className="space-y-2">{[1,2,3,4].map(i => <div key={i} className="h-8 bg-gray-800 rounded-xl animate-pulse" />)}</div>
                : <AminoAcidList aminoAcids={foodDetail?.aminoAcids} />
            )}
          </div>

          {/* actions */}
          <div className="shrink-0 px-4 pb-safe pb-4 pt-3 border-t border-gray-800 flex gap-3">
            <button
              onClick={() => setSelected(null)}
              className="flex-1 py-3 rounded-2xl bg-gray-800 text-gray-300 font-semibold"
            >
              Înapoi
            </button>
            <button
              onClick={handleAdd}
              disabled={!quantity || parseFloat(quantity) <= 0}
              className="flex-1 py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold disabled:opacity-40 transition-colors"
            >
              Adaugă
            </button>
          </div>
        </div>
      ) : (
        /* ─── tabs ─────────────────────────────────────────── */
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* tab bar */}
          <div className="flex border-b border-gray-800 shrink-0">
            {(['search', 'frequent', 'recent'] as Tab[]).map((t) => {
              const labels: Record<Tab, string> = { search: 'Căutare', frequent: 'Frecvente', recent: 'Recent', scan: 'Scanează' }
              return (
                <button
                  key={t}
                  onClick={() => handleTabChange(t)}
                  className={`flex-1 py-3 text-xs font-semibold transition-colors border-b-2 ${
                    tab === t
                      ? 'border-orange-500 text-orange-500'
                      : 'border-transparent text-gray-500 hover:text-white'
                  }`}
                >
                  {labels[t]}
                </button>
              )
            })}
            <button
              onClick={() => handleTabChange('scan')}
              className={`flex-1 py-3 text-xs font-semibold transition-colors border-b-2 flex items-center justify-center gap-1 ${
                tab === 'scan'
                  ? 'border-orange-500 text-orange-500'
                  : 'border-transparent text-gray-500 hover:text-white'
              }`}
            >
              <Camera size={13} />
              Scanează
            </button>
          </div>

          {/* search tab */}
          {tab === 'search' && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="px-4 py-3 shrink-0">
                <div className="flex items-center gap-3 bg-gray-800 rounded-2xl px-4 py-3">
                  <Search size={18} className="text-gray-500 shrink-0" />
                  <input
                    ref={inputRef}
                    value={query}
                    onChange={(e) => handleQueryChange(e.target.value)}
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
                  <p className="text-gray-500 text-sm text-center py-8">
                    Căutarea externă nu este disponibilă.<br />Afișăm doar rezultatele locale.
                  </p>
                )}
                {!isLoading && !isError && query && results.length === 0 && (
                  <div className="text-center py-8 space-y-4">
                    <p className="text-gray-500 text-sm">
                      Niciun aliment găsit pentru „{query}"
                    </p>
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
                    <p className="text-gray-500 text-sm text-center">
                      Scrie numele unui aliment pentru a căuta
                    </p>
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
                {results.map((food) => (
                  <FoodSearchResult key={food.fdcId} food={food} onClick={handleSelect} />
                ))}
              </div>
            </div>
          )}

          {/* frequent tab */}
          {tab === 'frequent' && (
            <div className="flex-1 overflow-y-auto px-4 py-3">
              {freqLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => <div key={i} className="h-16 bg-gray-800 rounded-2xl animate-pulse" />)}
                </div>
              ) : frequentFoods.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-8">
                  Niciun aliment frecvent — adaugă alimente în jurnal pentru a le vedea aici.
                </p>
              ) : (
                frequentFoods.map((food) => (
                  <FoodSearchResult key={food.fdcId} food={food} onClick={handleSelect} />
                ))
              )}
            </div>
          )}

          {/* recent tab */}
          {tab === 'recent' && (
            <div className="flex-1 overflow-y-auto px-4 py-3">
              {recentLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => <div key={i} className="h-16 bg-gray-800 rounded-2xl animate-pulse" />)}
                </div>
              ) : recentFoods.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-8">
                  Niciun aliment recent — adaugă alimente în jurnal pentru a le vedea aici.
                </p>
              ) : (
                recentFoods.map((food) => (
                  <FoodSearchResult key={food.fdcId} food={food} onClick={handleSelect} />
                ))
              )}
            </div>
          )}

          {/* scan tab */}
          {tab === 'scan' && (
            <div className="flex-1 flex flex-col overflow-hidden">
              {scanPhase === 'scanner' && (
                <BarcodeScanner onDetected={handleBarcodeDetected} />
              )}

              {scanPhase === 'loading' && (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <div className="w-10 h-10 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-gray-400 text-sm">Se caută produsul...</p>
                </div>
              )}

              {(scanPhase === 'notfound' || scanPhase === 'error') && (
                <div className="flex flex-col items-center justify-center py-12 px-6 gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gray-800 flex items-center justify-center">
                    <ScanLine size={28} className="text-gray-500" />
                  </div>
                  <div className="text-center">
                    <p className="text-white font-semibold text-sm">
                      {scanPhase === 'error' ? barcodeError : 'Produsul nu a fost găsit'}
                    </p>
                    {scanPhase === 'notfound' && (
                      <p className="text-gray-500 text-xs mt-1">
                        Produsul nu există în baza de date Open Food Facts.
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 w-full">
                    <button
                      onClick={handleRescan}
                      className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gray-800 text-gray-300 text-sm font-semibold"
                    >
                      <Camera size={15} />
                      Scanează din nou
                    </button>
                    <button
                      onClick={() => navigate('/nutritie/aliment/custom/nou')}
                      className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-semibold"
                    >
                      <PlusCircle size={15} />
                      Adaugă manual
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      </div>
    </div>
  )
}
