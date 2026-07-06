import { useState, useEffect } from 'react'
import { Camera, ScanLine, PlusCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { FoodItem } from '../../../../shared/types'
import { useBarcodeLookup } from '../../hooks/useBarcodeLookup'
import { BarcodeScanner } from '../BarcodeScanner'

type ScanPhase = 'scanner' | 'loading' | 'notfound' | 'error'

interface Props {
  onSelect: (food: FoodItem) => void
}

export function ScanTab({ onSelect }: Props) {
  const [scanPhase, setScanPhase] = useState<ScanPhase>('scanner')
  const navigate = useNavigate()
  const { food, isNotFound, error, lookup, reset } = useBarcodeLookup()

  useEffect(() => {
    if (food) {
      reset()
      setScanPhase('scanner')
      onSelect(food)
    }
  }, [food]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isNotFound) setScanPhase('notfound')
    else if (error) setScanPhase('error')
  }, [isNotFound, error])

  function handleDetected(barcode: string) {
    setScanPhase('loading')
    lookup(barcode)
  }

  function handleRescan() {
    reset()
    setScanPhase('scanner')
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {scanPhase === 'scanner' && (
        <BarcodeScanner onDetected={handleDetected} />
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
              {scanPhase === 'error' ? error : 'Produsul nu a fost găsit'}
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
  )
}
