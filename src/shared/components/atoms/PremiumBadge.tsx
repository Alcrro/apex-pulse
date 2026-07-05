import { Lock } from 'lucide-react'

interface PremiumBadgeProps {
  size?: 'sm' | 'md'
}

export function PremiumBadge({ size = 'md' }: PremiumBadgeProps) {
  const sm = size === 'sm'
  return (
    <span
      className={`inline-flex items-center gap-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-gray-900 font-bold rounded-full ${sm ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'}`}
    >
      <Lock size={sm ? 10 : 12} />
      Premium
    </span>
  )
}
