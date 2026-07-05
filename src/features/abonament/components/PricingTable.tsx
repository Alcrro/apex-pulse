import { Check, X } from 'lucide-react'
import { Button } from '../../../shared/components/atoms/Button'
import { useCreateCheckout } from '../hooks/useCreateCheckout'

const FREE_FEATURES = [
  'Planuri de antrenament nelimitate',
  'Sesiuni active și log seturi',
  'Grafice de progres de bază',
  'Tracking greutate corporală',
  'Nutriție și log mese',
]

const PREMIUM_ONLY = [
  'Generator AI plan de antrenament',
  'Statistici avansate și analize',
  'Export date (CSV / PDF)',
  'Integrare cu wearables',
  'Suport prioritar',
]

export function PricingTable() {
  const { startCheckout, loading, error } = useCreateCheckout()

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex flex-col gap-4">
        <div>
          <h3 className="text-lg font-bold text-white">Free</h3>
          <p className="text-3xl font-black text-white mt-1">0 RON<span className="text-sm font-normal text-gray-400">/lună</span></p>
          <p className="text-xs text-gray-500 mt-1">Planul curent</p>
        </div>
        <ul className="flex flex-col gap-2 flex-1">
          {FREE_FEATURES.map(f => (
            <li key={f} className="flex items-start gap-2 text-sm text-gray-300">
              <Check size={16} className="text-green-500 mt-0.5 shrink-0" />
              {f}
            </li>
          ))}
          {PREMIUM_ONLY.map(f => (
            <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
              <X size={16} className="mt-0.5 shrink-0" />
              {f}
            </li>
          ))}
        </ul>
        <Button variant="secondary" disabled className="w-full">Plan curent</Button>
      </div>

      <div className="bg-gray-900 border border-orange-500/40 rounded-2xl p-5 flex flex-col gap-4 relative overflow-hidden">
        <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-gray-900 text-xs font-bold px-2.5 py-1 rounded-full">
          Recomandat
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Premium</h3>
          <p className="text-3xl font-black text-white mt-1">29 RON<span className="text-sm font-normal text-gray-400">/lună</span></p>
          <p className="text-xs text-gray-500 mt-1">Anulare oricând</p>
        </div>
        <ul className="flex flex-col gap-2 flex-1">
          {FREE_FEATURES.map(f => (
            <li key={f} className="flex items-start gap-2 text-sm text-gray-300">
              <Check size={16} className="text-green-500 mt-0.5 shrink-0" />
              {f}
            </li>
          ))}
          {PREMIUM_ONLY.map(f => (
            <li key={f} className="flex items-start gap-2 text-sm text-orange-300">
              <Check size={16} className="text-orange-500 mt-0.5 shrink-0" />
              {f}
            </li>
          ))}
        </ul>
        {error && <p className="text-xs text-red-400">{error}</p>}
        <Button onClick={startCheckout} disabled={loading} className="w-full">
          {loading ? 'Se deschide pagina de plată...' : 'Upgrade la Premium'}
        </Button>
      </div>
    </div>
  )
}
