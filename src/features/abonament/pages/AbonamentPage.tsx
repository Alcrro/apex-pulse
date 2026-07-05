import { Crown, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useSubscriptionContext } from '../../../shared/context/SubscriptionContext'
import { PricingTable } from '../components/PricingTable'
import { SubscriptionStatus } from '../components/SubscriptionStatus'

export function AbonamentPage() {
  const { isPremium, loading } = useSubscriptionContext()
  const navigate = useNavigate()

  return (
    <div className="space-y-6 pt-2">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <button
            onClick={() => navigate(-1)}
            className="p-1.5 rounded-xl hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <Crown size={22} className="text-orange-500" />
          <h1 className="text-xl font-black text-white">Abonament</h1>
        </div>
        <p className="text-sm text-gray-400 pl-11">
          {isPremium
            ? 'Gestionează-ți abonamentul Premium.'
            : 'Deblochează toate funcțiile avansate ale ApexPulse.'}
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map(i => (
            <div key={i} className="h-48 bg-gray-900 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : isPremium ? (
        <SubscriptionStatus />
      ) : (
        <PricingTable />
      )}
    </div>
  )
}
