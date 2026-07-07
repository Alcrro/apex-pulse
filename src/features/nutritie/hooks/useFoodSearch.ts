import { useState, useRef } from 'react'
import type { FoodItem } from '../../../shared/types'
import { searchFoodCache, searchUsdaFoods, cacheFoodItems } from '../utils/foodSearch'

const DEBOUNCE_MS = 400

export function useFoodSearch() {
  const [results, setResults] = useState<FoodItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function search(query: string) {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (!query.trim()) { setResults([]); return }

    debounceRef.current = setTimeout(async () => {
      setIsLoading(true)
      setIsError(false)

      const local = await searchFoodCache(query)

      if (local.length >= 5) {
        setResults(local)
        setIsLoading(false)
        return
      }

      try {
        const remote = await searchUsdaFoods(query)
        cacheFoodItems(remote)
        const seen = new Set(local.map(f => f.fdcId))
        setResults([...local, ...remote.filter(f => !seen.has(f.fdcId))])
      } catch {
        setIsError(true)
        setResults(local)
      } finally {
        setIsLoading(false)
      }
    }, DEBOUNCE_MS)
  }

  return { results, isLoading, isError, search, clearResults: () => setResults([]) }
}
