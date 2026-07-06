interface Props {
  value: string
  onChange: (v: string) => void
}

export function PortionSelector({ value, onChange }: Props) {
  const quickGrams = [50, 100, 200]
  return (
    <div className="bg-gray-900 rounded-2xl p-4">
      <label className="text-xs text-gray-400 block mb-2">Porție (grame)</label>
      <div className="flex items-center gap-3">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          min="1"
          className="flex-1 bg-gray-800 rounded-xl px-4 py-3 text-white font-semibold text-lg text-center focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <div className="flex gap-2">
          {quickGrams.map((g) => (
            <button
              key={g}
              onClick={() => onChange(String(g))}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                value === String(g)
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              {g}g
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
