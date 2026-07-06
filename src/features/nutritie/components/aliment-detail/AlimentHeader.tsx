import { ArrowLeft, Tag } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface Props {
  name: string
  brand?: string | null
}

export function AlimentHeader({ name, brand }: Props) {
  const navigate = useNavigate()
  return (
    <div className="flex items-center gap-3 px-4 pt-safe pt-4 pb-3 border-b border-gray-800 shrink-0">
      <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-gray-800 text-gray-400">
        <ArrowLeft size={20} />
      </button>
      <div className="flex-1 min-w-0">
        <h1 className="font-bold text-white text-base truncate">{name}</h1>
        {brand && (
          <div className="flex items-center gap-1 mt-0.5">
            <Tag size={10} className="text-gray-500" />
            <span className="text-xs text-gray-500 truncate">{brand}</span>
          </div>
        )}
      </div>
    </div>
  )
}
