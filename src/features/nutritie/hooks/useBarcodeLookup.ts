import { useState, useCallback } from 'react'
import type { FoodItem } from '../../../shared/types'
import { OFF_API, parseOffProduct } from '../utils/offApi'
import { lookupCachedBarcode, cacheBarcode } from '../utils/barcodeCache'

export function useBarcodeLookup() {
  const [food, setFood] = useState<FoodItem | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isNotFound, setIsNotFound] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const lookup = useCallback(async (barcode: string) => {
    setIsLoading(true)
    setIsNotFound(false)
    setError(null)
    setFood(null)

    try {
      const cached = await lookupCachedBarcode(barcode)
      if (cached) {
        setFood(cached)
        return
      }

      const res = await fetch(`${OFF_API}/${barcode}.json`)
      if (!res.ok) throw new Error('OFF API error')
      const json = await res.json()

      if (json.status === 0 || !json.product) {
        setIsNotFound(true)
        return
      }

      const parsed = parseOffProduct(barcode, json)
      if (!parsed) {
        setIsNotFound(true)
        return
      }

      await cacheBarcode(barcode, parsed)
      setFood(parsed)
    } catch {
      setError('Nu s-a putut identifica produsul. Încearcă din nou.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setFood(null)
    setIsNotFound(false)
    setError(null)
    setIsLoading(false)
  }, [])

  return { food, isLoading, isNotFound, error, lookup, reset }
}
