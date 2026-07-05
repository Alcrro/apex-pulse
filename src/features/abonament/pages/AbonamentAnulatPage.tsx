import { useNavigate } from 'react-router-dom'
import { XCircle } from 'lucide-react'
import { Button } from '../../../shared/components/atoms/Button'

export function AbonamentAnulatPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="max-w-sm w-full text-center space-y-6">
        <XCircle size={48} className="text-gray-500 mx-auto" />
        <div>
          <h1 className="text-xl font-black text-white mb-2">Plată anulată</h1>
          <p className="text-sm text-gray-400">
            Ai anulat procesul de plată. Nu a fost efectuată nicio tranzacție.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <Button onClick={() => navigate('/abonament')} className="w-full">
            Încearcă din nou
          </Button>
          <Button variant="ghost" onClick={() => navigate('/')} className="w-full">
            Înapoi la aplicație
          </Button>
        </div>
      </div>
    </div>
  )
}
