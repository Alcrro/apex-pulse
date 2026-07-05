import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, X } from 'lucide-react'
import { BottomNav } from './BottomNav'
import { Header } from './Header'
import { useSubscriptionContext } from '../../../context/SubscriptionContext'

function ExpiryBanner() {
  const { daysUntilExpiry, isPremium } = useSubscriptionContext()
  const navigate = useNavigate()
  const [dismissed, setDismissed] = useState(false)

  if (dismissed || !isPremium || daysUntilExpiry === null || daysUntilExpiry > 7) return null

  return (
    <div className="bg-yellow-500/10 border-b border-yellow-500/20 px-4 py-2 flex items-center gap-2 max-w-2xl mx-auto w-full">
      <AlertTriangle size={14} className="text-yellow-400 shrink-0" />
      <button onClick={() => navigate('/abonament')} className="flex-1 text-xs text-yellow-300 text-left">
        Abonamentul expiră în {daysUntilExpiry} {daysUntilExpiry === 1 ? 'zi' : 'zile'} — reînnoire
      </button>
      <button onClick={() => setDismissed(true)} className="text-yellow-500 hover:text-yellow-300 transition-colors">
        <X size={14} />
      </button>
    </div>
  )
}

export function Layout() {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <Header />
      <ExpiryBanner />
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 pb-24 pt-4">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
