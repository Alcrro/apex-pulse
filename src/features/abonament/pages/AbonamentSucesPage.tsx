import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, Loader2 } from 'lucide-react'
import { useSubscriptionContext } from '../../../shared/context/SubscriptionContext'
import { Button } from '../../../shared/components/atoms/Button'

export function AbonamentSucesPage() {
  const navigate = useNavigate()
  const { isPremium, refetch } = useSubscriptionContext()
  const [attempts, setAttempts] = useState(0)
  const [confirmed, setConfirmed] = useState(false)

  useEffect(() => {
    if (isPremium) { setConfirmed(true); return }
    if (attempts >= 3) return

    const timer = setTimeout(async () => {
      await refetch()
      setAttempts(a => a + 1)
    }, 2000)

    return () => clearTimeout(timer)
  }, [isPremium, attempts])

  useEffect(() => {
    if (isPremium) setConfirmed(true)
  }, [isPremium])

  const waiting = !confirmed && attempts < 3

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="max-w-sm w-full text-center space-y-6">
        {waiting ? (
          <>
            <Loader2 size={48} className="text-orange-500 animate-spin mx-auto" />
            <div>
              <h1 className="text-xl font-black text-white mb-2">Se activează abonamentul...</h1>
              <p className="text-sm text-gray-400">Așteptăm confirmarea plății de la Stripe.</p>
            </div>
          </>
        ) : (
          <>
            <CheckCircle size={48} className="text-green-500 mx-auto" />
            <div>
              <h1 className="text-xl font-black text-white mb-2">
                {confirmed ? 'Abonament activat!' : 'Plată procesată!'}
              </h1>
              <p className="text-sm text-gray-400">
                {confirmed
                  ? 'Ai acum acces la toate funcțiile Premium ApexPulse.'
                  : 'Abonamentul tău va fi activat în câteva secunde.'}
              </p>
            </div>
          </>
        )}

        {!waiting && (
          <div className="flex flex-col gap-3">
            <Button onClick={() => navigate('/profil')} className="w-full">
              Mergi la profil
            </Button>
            <Button variant="ghost" onClick={() => navigate('/abonament')} className="w-full">
              Vezi abonamentul
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
