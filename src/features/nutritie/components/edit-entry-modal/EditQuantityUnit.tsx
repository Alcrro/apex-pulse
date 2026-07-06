interface Props {
  quantity: string
  unit: string
  onQuantityChange: (v: string) => void
  onUnitChange: (v: string) => void
}

export function EditQuantityUnit({ quantity, unit, onQuantityChange, onUnitChange }: Props) {
  const units = [
    { value: 'grame',  label: 'grame' },
    { value: 'ml',     label: 'ml' },
    { value: 'bucata', label: 'bucată' },
    { value: 'pounds', label: 'pounds' },
  ]

  return (
    <div className="bg-gray-900 rounded-2xl p-4 space-y-3">
      <div>
        <label className="text-xs text-gray-400 block mb-1.5">Cantitate</label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => onQuantityChange(e.target.value)}
          min="1"
          className="w-full bg-gray-800 rounded-xl px-4 py-3 text-white font-semibold text-lg text-center focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>
      <div>
        <label className="text-xs text-gray-400 block mb-1.5">Unitate</label>
        <div className="grid grid-cols-4 gap-2">
          {units.map((u) => (
            <button
              key={u.value}
              onClick={() => onUnitChange(u.value)}
              className={`py-2 rounded-xl text-xs font-semibold transition-colors ${
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
  )
}
