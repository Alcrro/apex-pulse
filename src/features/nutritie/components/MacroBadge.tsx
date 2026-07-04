interface MacroBadgeProps {
  type: 'protein' | 'carbs' | 'fat'
  value: number
  size?: 'sm' | 'xs'
}

const CONFIG = {
  protein: { label: 'P', color: 'text-blue-400 bg-blue-400/10' },
  carbs:   { label: 'C', color: 'text-yellow-400 bg-yellow-400/10' },
  fat:     { label: 'G', color: 'text-red-400 bg-red-400/10' },
}

export function MacroBadge({ type, value, size = 'sm' }: MacroBadgeProps) {
  const { label, color } = CONFIG[type]
  const textSize = size === 'xs' ? 'text-[10px]' : 'text-xs'
  const padding = size === 'xs' ? 'px-1.5 py-0.5' : 'px-2 py-1'

  return (
    <span className={`inline-flex items-center gap-0.5 rounded-md font-semibold ${textSize} ${padding} ${color}`}>
      <span className="font-bold">{label}</span>
      <span>{Math.round(value)}g</span>
    </span>
  )
}
