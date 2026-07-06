import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

export function InfoAccordion({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-gray-800 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-800/40 transition-colors"
      >
        <span className="text-sm font-semibold text-gray-300">{title}</span>
        {open ? <ChevronUp size={15} className="text-gray-500" /> : <ChevronDown size={15} className="text-gray-500" />}
      </button>
      {open && (
        <div className="px-4 pb-4 pt-1 border-t border-gray-800 space-y-2">
          {children}
        </div>
      )}
    </div>
  )
}

export function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <span className="text-xs text-gray-600 shrink-0 mt-0.5">→</span>
      <div>
        <span className="text-xs font-semibold text-gray-400">{label} </span>
        <span className="text-xs text-gray-500">{value}</span>
      </div>
    </div>
  )
}
