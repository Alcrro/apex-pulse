import { X, ArrowLeft } from 'lucide-react'

interface Props {
  mode: 'edit' | 'search'
  title: string
  onBack: () => void
  onClose: () => void
}

export function EditModalHeader({ mode, title, onBack, onClose }: Props) {
  return (
    <div className="flex items-center gap-3 px-4 pt-safe pt-4 pb-3 border-b border-gray-800 shrink-0">
      <button
        onClick={mode === 'search' ? onBack : onClose}
        className="p-2 rounded-xl hover:bg-gray-800 text-gray-400"
      >
        {mode === 'search' ? <ArrowLeft size={20} /> : <X size={20} />}
      </button>
      <h2 className="font-bold text-white flex-1 truncate">
        {mode === 'search' ? 'Schimbă aliment' : title}
      </h2>
    </div>
  )
}
