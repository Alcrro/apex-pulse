import { Camera } from 'lucide-react'

export type SearchTab = 'search' | 'frequent' | 'recent' | 'scan'

const TABS: { id: SearchTab; label: string }[] = [
  { id: 'search',   label: 'Căutare' },
  { id: 'frequent', label: 'Frecvente' },
  { id: 'recent',   label: 'Recent' },
]

interface Props {
  active: SearchTab
  onChange: (tab: SearchTab) => void
}

export function FoodSearchTabBar({ active, onChange }: Props) {
  return (
    <div className="flex border-b border-gray-800 shrink-0">
      {TABS.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          className={`flex-1 py-3 text-xs font-semibold transition-colors border-b-2 ${
            active === id
              ? 'border-orange-500 text-orange-500'
              : 'border-transparent text-gray-500 hover:text-white'
          }`}
        >
          {label}
        </button>
      ))}
      <button
        onClick={() => onChange('scan')}
        className={`flex-1 py-3 text-xs font-semibold transition-colors border-b-2 flex items-center justify-center gap-1 ${
          active === 'scan'
            ? 'border-orange-500 text-orange-500'
            : 'border-transparent text-gray-500 hover:text-white'
        }`}
      >
        <Camera size={13} />
        Scanează
      </button>
    </div>
  )
}
