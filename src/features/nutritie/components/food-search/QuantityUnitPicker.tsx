interface Props {
  quantity: string
  unit: string
  onQuantityChange: (v: string) => void
  onUnitChange: (v: string) => void
}

export function QuantityUnitPicker({ quantity, unit, onQuantityChange, onUnitChange }: Props) {
  const units = [
    { value: 'grame',   label: 'grame' },
    { value: 'ml',      label: 'ml' },
    { value: 'bucata',  label: 'bucată' },
    { value: 'pounds',  label: 'pounds' },
  ]

  return (
    <div className="shrink-0 px-4 pt-3 pb-2 border-b border-gray-800 space-y-3">
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <label className="text-xs text-gray-400 block mb-1">Cantitate</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => onQuantityChange(e.target.value)}
            min="1"
            className="w-full bg-gray-800 rounded-xl px-3 py-2.5 text-white font-semibold text-base text-center focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <div className="flex-1">
          <label className="text-xs text-gray-400 block mb-1">Unitate</label>
          <div className="grid grid-cols-4 gap-1">
            {units.map((u) => (
              <button
                key={u.value}
                onClick={() => onUnitChange(u.value)}
                className={`py-2 rounded-lg text-xs font-semibold transition-colors ${
                  unit === u.value
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                {u.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
