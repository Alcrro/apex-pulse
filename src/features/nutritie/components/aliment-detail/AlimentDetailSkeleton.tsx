import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function AlimentDetailSkeleton() {
  const navigate = useNavigate()
  return (
    <div className="flex flex-col min-h-screen bg-gray-950">
      <div className="flex items-center gap-3 px-4 pt-safe pt-4 pb-3 border-b border-gray-800">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-gray-800 text-gray-400">
          <ArrowLeft size={20} />
        </button>
        <div className="h-5 w-40 bg-gray-800 rounded animate-pulse" />
      </div>
      <div className="p-4 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-gray-800 rounded-2xl animate-pulse" />
        ))}
      </div>
    </div>
  )
}
