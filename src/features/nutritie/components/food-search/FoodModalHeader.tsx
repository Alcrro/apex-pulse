import { X } from 'lucide-react'

interface Props {
  title: string
  onClose: () => void
}

export function FoodModalHeader({ title, onClose }: Props) {
  return (
    <div className="flex items-center gap-3 px-4 pt-safe pt-4 pb-3 border-b border-gray-800">
      <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-800 text-gray-400">
        <X size={20} />
      </button>
      <h2 className="font-bold text-white flex-1">{title}</h2>
    </div>
  )
}
