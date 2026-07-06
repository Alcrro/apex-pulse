import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function AlimentNotFound() {
  const navigate = useNavigate()
  return (
    <div className="flex flex-col min-h-screen bg-gray-950">
      <div className="flex items-center gap-3 px-4 pt-safe pt-4 pb-3 border-b border-gray-800">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-gray-800 text-gray-400">
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-bold text-white">Aliment</h1>
      </div>
      <div className="flex-1 flex items-center justify-center p-8 text-center">
        <p className="text-gray-500 text-sm">Date indisponibile pentru acest aliment.</p>
      </div>
    </div>
  )
}
