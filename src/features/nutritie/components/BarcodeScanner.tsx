import { useEffect, useRef } from 'react'
import { Flashlight, FlashlightOff } from 'lucide-react'
import { useBarcodeScan } from '../hooks/useBarcodeScan'
import { BarcodeScannerError } from './barcode-scanner/BarcodeScannerError'
import { BarcodeScannerOverlay } from './barcode-scanner/BarcodeScannerOverlay'

interface BarcodeScannerProps {
  onDetected: (barcode: string) => void
}

export function BarcodeScanner({ onDetected }: BarcodeScannerProps) {
  const { videoRef, state, detectedBarcode, error, startScan, stopScan, isTorchAvailable, torchOn, toggleTorch } = useBarcodeScan()

  const onDetectedRef = useRef(onDetected)
  onDetectedRef.current = onDetected

  useEffect(() => {
    startScan()
    return () => stopScan()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (detectedBarcode) onDetectedRef.current(detectedBarcode)
  }, [detectedBarcode])

  if (state === 'requesting') {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <div className="w-10 h-10 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-400 text-sm">Se inițializează camera...</p>
      </div>
    )
  }

  if (state === 'error') {
    return <BarcodeScannerError error={error} onRetry={startScan} />
  }

  return (
    <div className="relative w-full overflow-hidden bg-black" style={{ aspectRatio: '4/3' }}>
      <video ref={videoRef} className="w-full h-full object-cover" playsInline muted autoPlay />
      <BarcodeScannerOverlay state={state} />
      {isTorchAvailable && (
        <button
          onClick={toggleTorch}
          className="absolute top-3 right-3 z-20 w-11 h-11 rounded-xl bg-black/60 flex items-center justify-center active:scale-95"
        >
          {torchOn ? <FlashlightOff size={20} className="text-white" /> : <Flashlight size={20} className="text-white" />}
        </button>
      )}
    </div>
  )
}
