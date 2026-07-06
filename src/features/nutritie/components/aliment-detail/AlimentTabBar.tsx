export type AlimentTab = 'macro' | 'micro' | 'aminoacizi'

const TABS: { id: AlimentTab; label: string }[] = [
  { id: 'macro',      label: 'Macro' },
  { id: 'micro',      label: 'Micro' },
  { id: 'aminoacizi', label: 'Aminoacizi' },
]

interface Props {
  active: AlimentTab
  onChange: (tab: AlimentTab) => void
}

export function AlimentTabBar({ active, onChange }: Props) {
  return (
    <div className="flex border-b border-gray-800">
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
    </div>
  )
}
