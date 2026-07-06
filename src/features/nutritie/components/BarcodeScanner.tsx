import { useEffect, useRef } from 'react'
import { CameraOff, RotateCcw, Flashlight, FlashlightOff } from 'lucide-react'
import { useBarcodeScan } from '../hooks/useBarcodeScan'

interface BarcodeScannerProps {
  onDetected: (barcode: string) => void
}

export function BarcodeScanner({ onDetected }: BarcodeScannerProps) {
  const { videoRef, state, detectedBarcode, error, startScan, stopScan, isTorchAvailable, torchOn, toggleTorch } =
    useBarcodeScan()

  // Stable ref so the effect doesn't re-run when parent re-renders
  const onDetectedRef = useRef(onDetected)
  onDetectedRef.current = onDetected

  useEffect(() => {
    startScan()
    return () => stopScan()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps — pornire/oprire camera doar la mount/unmount

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
    return (
      <div className="flex flex-col items-center justify-center py-12 px-6 gap-4">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center">
          <CameraOff size={28} className="text-red-400" />
        </div>
        <div className="text-center">
          <p className="text-white font-semibold text-sm">{error || 'Eroare cameră'}</p>
          <p className="text-gray-500 text-xs mt-1">
            Permite accesul la cameră din setările browserului, apoi reîncearcă.
          </p>
        </div>
        <button
          onClick={startScan}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-800 text-gray-300 text-sm font-semibold"
        >
          <RotateCcw size={14} />
          Reîncearcă
        </button>
      </div>
    )
  }

  return (
    <div className="relative w-full overflow-hidden bg-black" style={{ aspectRatio: '4/3' }}>
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        playsInline
        muted
        autoPlay
      />

      {/* Targeting overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        {/* Dark corners — clip-path trick to dim outside the guide box */}
        <div className="absolute inset-0 bg-black/45" style={{ maskImage: 'none' }} />

        {/* Guide rectangle */}
        <div className="relative z-10 w-3/5 h-24">
          <div className="absolute top-0 left-0 w-7 h-7 border-t-2 border-l-2 border-orange-500" />
          <div className="absolute top-0 right-0 w-7 h-7 border-t-2 border-r-2 border-orange-500" />
          <div className="absolute bottom-0 left-0 w-7 h-7 border-b-2 border-l-2 border-orange-500" />
          <div className="absolute bottom-0 right-0 w-7 h-7 border-b-2 border-r-2 border-orange-500" />

          {/* Scan line */}
          {state === 'scanning' && (
            <div className="absolute inset-x-1 h-px bg-orange-500/70 top-1/2 animate-pulse" />
          )}

          {/* Detected flash */}
          {state === 'detected' && (
            <div className="absolute inset-0 border-2 border-green-400 bg-green-500/10 rounded-sm" />
          )}
        </div>

        <p className="relative z-10 mt-5 text-white text-xs text-center drop-shadow-md px-4">
          {state === 'detected'
            ? 'Cod detectat!'
            : 'Îndreaptă camera spre codul de bare'}
        </p>
      </div>

      {/* Torch button */}
      {isTorchAvailable && (
        <button
          onClick={toggleTorch}
          className="absolute top-3 right-3 z-20 w-11 h-11 rounded-xl bg-black/60 flex items-center justify-center active:scale-95"
        >
          {torchOn
            ? <FlashlightOff size={20} className="text-white" />
            : <Flashlight size={20} className="text-white" />}
        </button>
      )}
    </div>
  )
}
