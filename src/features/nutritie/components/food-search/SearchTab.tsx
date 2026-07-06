import { useState, useEffect, useRef } from 'react'
import { Search, Loader2, X, Plus, PlusCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { FoodItem } from '../../../../shared/types'
import { useFoodSearch } from '../../hooks/useFoodSearch'
import { FoodSearchResult } from '../FoodSearchResult'

interface Props {
  onSelect: (food: FoodItem) => void
}

export function SearchTab({ onSelect }: Props) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const { results, isLoading, isError, search, clearResults } = useFoodSearch()

  useEffect(() => { inputRef.current?.focus() }, [])

  function handleQueryChange(val: string) {
    setQuery(val)
    search(val)
  }

  function handleClear() {
    setQuery('')
    clearResults()
  }

  return (
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
            <button onClick={handleClear}>
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

        {results.map((food) => (
          <FoodSearchResult key={food.fdcId} food={food} onClick={onSelect} />
        ))}
      </div>
    </div>
  )
}
