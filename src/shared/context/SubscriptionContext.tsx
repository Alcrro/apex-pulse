import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'
import type { UserSubscription } from '../types'

interface SubscriptionContextType {
  subscription: UserSubscription | null
  loading: boolean
  isPremium: boolean
  daysUntilExpiry: number | null
  refetch: () => Promise<void>
}

const SubscriptionContext = createContext<SubscriptionContextType | null>(null)

const DEFAULT_SUB: UserSubscription = {
  subscription_status: 'free',
  subscription_plan: 'free',
  subscription_id: null,
  stripe_customer_id: null,
  current_period_end: null,
  cancel_at_period_end: false,
}

function extractSubscription(row: Record<string, unknown>): UserSubscription {
  return {
    subscription_status: (row.subscription_status as UserSubscription['subscription_status']) ?? 'free',
    subscription_plan: (row.subscription_plan as UserSubscription['subscription_plan']) ?? 'free',
    subscription_id: (row.subscription_id as string | null) ?? null,
    stripe_customer_id: (row.stripe_customer_id as string | null) ?? null,
    current_period_end: (row.current_period_end as string | null) ?? null,
    cancel_at_period_end: (row.cancel_at_period_end as boolean) ?? false,
  }
}

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [subscription, setSubscription] = useState<UserSubscription | null>(null)
  const [loading, setLoading] = useState(true)

  async function fetchSubscription() {
    if (!user) { setSubscription(DEFAULT_SUB); setLoading(false); return }
    setLoading(true)
    const { data } = await supabase
      .from('profiles')
      .select('subscription_status, subscription_plan, subscription_id, stripe_customer_id, current_period_end, cancel_at_period_end')
      .eq('id', user.id)
      .maybeSingle()
    setSubscription(data ? extractSubscription(data as Record<string, unknown>) : DEFAULT_SUB)
    setLoading(false)
  }

  useEffect(() => {
    fetchSubscription()
    if (!user) return

    const channel = supabase
      .channel(`sub_${user.id}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'profiles',
        filter: `id=eq.${user.id}`,
      }, ({ new: row }) => {
        setSubscription(extractSubscription(row as Record<string, unknown>))
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [user])

  const isPremium =
    subscription?.subscription_status === 'active' ||
    subscription?.subscription_status === 'trialing'

  const daysUntilExpiry = (() => {
    if (!subscription?.current_period_end) return null
    const diff = new Date(subscription.current_period_end).getTime() - Date.now()
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
  })()

  return (
    <SubscriptionContext.Provider value={{ subscription, loading, isPremium, daysUntilExpiry, refetch: fetchSubscription }}>
      {children}
    </SubscriptionContext.Provider>
  )
}

export function useSubscriptionContext(): SubscriptionContextType {
  const ctx = useContext(SubscriptionContext)
  if (!ctx) throw new Error('useSubscriptionContext must be used within SubscriptionProvider')
  return ctx
}
