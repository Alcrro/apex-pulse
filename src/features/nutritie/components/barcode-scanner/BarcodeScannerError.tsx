import { CameraOff, RotateCcw } from 'lucide-react'

interface BarcodeScannerErrorProps {
  error: string | null
  onRetry: () => void
}

export function BarcodeScannerError({ error, onRetry }: BarcodeScannerErrorProps) {
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
        onClick={onRetry}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-800 text-gray-300 text-sm font-semibold"
      >
        <RotateCcw size={14} />
        Reîncearcă
      </button>
    </div>
  )
}
