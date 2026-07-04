import { useEffect, useState, useRef } from 'react'
import { X, RotateCcw } from 'lucide-react'

interface RestTimerProps {
  seconds: number
  onClose: () => void
}

export function RestTimer({ seconds, onClose }: RestTimerProps) {
  const [remaining, setRemaining] = useState(seconds)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    setRemaining(seconds)
    intervalRef.current = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [seconds])

  const progress = ((seconds - remaining) / seconds) * 100
  const mins = Math.floor(remaining / 60)
  const secs = remaining % 60

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center max-w-xs w-full">
        <p className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-6">Pauză</p>

        <div className="relative w-40 h-40 mx-auto mb-6">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="54" fill="none" stroke="#1f2937" strokeWidth="8" />
            <circle
              cx="60" cy="60" r="54"
              fill="none"
              stroke="#FF5C00"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 54}`}
              strokeDashoffset={`${2 * Math.PI * 54 * (1 - progress / 100)}`}
              style={{ transition: 'stroke-dashoffset 1s linear' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl font-black text-white">
              {mins > 0 ? `${mins}:${String(secs).padStart(2, '0')}` : secs}
            </span>
          </div>
        </div>

        {remaining === 0 && (
          <p className="text-green-400 font-bold mb-4">Gata! Poți continua.</p>
        )}

        <div className="flex gap-3">
          <button
            onClick={() => setRemaining(seconds)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-semibold transition-colors"
          >
            <RotateCcw size={16} />
            Reset
          </button>
          <button
            onClick={onClose}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition-colors"
          >
            <X size={16} />
            Skip
          </button>
        </div>
      </div>
    </div>
  )
}
