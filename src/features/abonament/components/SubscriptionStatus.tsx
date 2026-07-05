import { Crown, AlertTriangle, XCircle, RefreshCw } from 'lucide-react'
import { Button } from '../../../shared/components/atoms/Button'
import { useSubscriptionContext } from '../../../shared/context/SubscriptionContext'
import { useCustomerPortal } from '../hooks/useCustomerPortal'
import type { SubscriptionStatus as Status } from '../../../shared/types'

const STATUS_LABELS: Record<Status, string> = {
  free: 'Gratuit',
  active: 'Activ',
  trialing: 'Perioadă de probă',
  past_due: 'Plată eșuată',
  canceled: 'Anulat',
}

const STATUS_COLORS: Record<Status, string> = {
  free: 'text-gray-400',
  active: 'text-green-400',
  trialing: 'text-blue-400',
  past_due: 'text-red-400',
  canceled: 'text-gray-500',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' })
}

export function SubscriptionStatus() {
  const { subscription, daysUntilExpiry } = useSubscriptionContext()
  const { openPortal, loading, error } = useCustomerPortal()

  if (!subscription || subscription.subscription_status === 'free') return null

  const status = subscription.subscription_status
  const isActive = status === 'active' || status === 'trialing'
  const isPastDue = status === 'past_due'
  const isCanceled = status === 'canceled'
  const expiringsSoon = daysUntilExpiry !== null && daysUntilExpiry <= 7 && isActive

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Crown size={20} className={isActive ? 'text-orange-500' : 'text-gray-500'} />
          <span className="font-semibold text-white">Abonament Premium</span>
        </div>
        <span className={`text-sm font-medium ${STATUS_COLORS[status]}`}>
          {STATUS_LABELS[status]}
        </span>
      </div>

      {subscription.current_period_end && (
        <div className="text-sm text-gray-400">
          {isCanceled ? 'Activ până la' : subscription.cancel_at_period_end ? 'Se anulează la' : 'Reînnoire la'}
          {': '}
          <span className="text-white font-medium">{formatDate(subscription.current_period_end)}</span>
        </div>
      )}

      {expiringsSoon && (
        <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 rounded-xl px-3 py-2 text-sm text-yellow-400">
          <AlertTriangle size={14} />
          Abonamentul expiră în {daysUntilExpiry} {daysUntilExpiry === 1 ? 'zi' : 'zile'}
        </div>
      )}

      {isPastDue && (
        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-xl px-3 py-2 text-sm text-red-400">
          <XCircle size={14} />
          Ultima plată a eșuat. Actualizează datele cardului pentru a păstra accesul.
        </div>
      )}

      {error && <p className="text-xs text-red-400">{error}</p>}

      <Button variant="secondary" onClick={openPortal} disabled={loading} className="w-full">
        <RefreshCw size={15} />
        {loading ? 'Se deschide portalul...' : 'Gestionează abonamentul'}
      </Button>
    </div>
  )
}
