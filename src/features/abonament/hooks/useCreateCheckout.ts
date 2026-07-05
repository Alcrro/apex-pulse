import { useState } from 'react'
import { supabase } from '../../../shared/lib/supabase'

const API_URL = import.meta.env.VITE_API_URL ?? ''

export function useCreateCheckout() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function startCheckout() {
    setLoading(true)
    setError(null)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('Trebuie să fii autentificat')

      const res = await fetch(`${API_URL}/api/subscriptions/create-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error((body as { message?: string }).message ?? 'Eroare la creare sesiune de plată')
      }

      const { url } = await res.json() as { url: string }
      window.location.href = url
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare necunoscută')
      setLoading(false)
    }
  }

  return { startCheckout, loading, error }
}
