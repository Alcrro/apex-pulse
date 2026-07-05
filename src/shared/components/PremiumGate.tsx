import { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock } from 'lucide-react'
import { useSubscriptionContext } from '../context/SubscriptionContext'
import { Button } from './atoms/Button'

interface PremiumGateProps {
  children: ReactNode
  feature?: string
}

export function PremiumGate({ children, feature }: PremiumGateProps) {
  const { isPremium, loading } = useSubscriptionContext()
  const navigate = useNavigate()

  if (loading || isPremium) return <>{children}</>

  return (
    <div className="relative">
      <div className="blur-sm pointer-events-none select-none">{children}</div>
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-950/80 rounded-2xl gap-3 p-4">
        <div className="flex items-center gap-2">
          <Lock size={20} className="text-orange-500" />
          <span className="text-sm font-semibold text-white">Funcție Premium</span>
        </div>
        {feature && <p className="text-xs text-gray-400 text-center">{feature}</p>}
        <Button size="sm" onClick={() => navigate('/abonament')}>
          Upgrade la Premium
        </Button>
      </div>
    </div>
  )
}
