interface Props {
  label: string
  labelColor?: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: 'text' | 'number'
}

export function NutritionInput({ label, labelColor = 'text-gray-400', value, onChange, placeholder = '0', type = 'number' }: Props) {
  return (
    <div>
      <label className={`text-xs block mb-2 ${labelColor}`}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        min={type === 'number' ? '0' : undefined}
        className="w-full bg-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
      />
    </div>
  )
}
