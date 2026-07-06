import { Check } from 'lucide-react'

export function SavedBadge({ show }: { show: boolean }) {
  return (
    <span
      className={`flex items-center gap-1 text-xs text-green-400 font-semibold transition-all duration-300 ${
        show ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1 pointer-events-none'
      }`}
    >
      <Check size={12} /> Salvat
    </span>
  )
}
