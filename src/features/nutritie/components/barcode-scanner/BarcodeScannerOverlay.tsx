import type { BarcodeScanState } from '../../hooks/useBarcodeScan'

interface BarcodeScannerOverlayProps {
  state: BarcodeScanState
}

export function BarcodeScannerOverlay({ state }: BarcodeScannerOverlayProps) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
      <div className="absolute inset-0 bg-black/45" />
      <div className="relative z-10 w-3/5 h-24">
        <div className="absolute top-0 left-0 w-7 h-7 border-t-2 border-l-2 border-orange-500" />
        <div className="absolute top-0 right-0 w-7 h-7 border-t-2 border-r-2 border-orange-500" />
        <div className="absolute bottom-0 left-0 w-7 h-7 border-b-2 border-l-2 border-orange-500" />
        <div className="absolute bottom-0 right-0 w-7 h-7 border-b-2 border-r-2 border-orange-500" />
        {state === 'scanning' && (
          <div className="absolute inset-x-1 h-px bg-orange-500/70 top-1/2 animate-pulse" />
        )}
        {state === 'detected' && (
          <div className="absolute inset-0 border-2 border-green-400 bg-green-500/10 rounded-sm" />
        )}
      </div>
      <p className="relative z-10 mt-5 text-white text-xs text-center drop-shadow-md px-4">
        {state === 'detected' ? 'Cod detectat!' : 'Îndreaptă camera spre codul de bare'}
      </p>
    </div>
  )
}
