interface Props {
  foodName: string
  onSwitch: () => void
}

export function EditFoodRow({ foodName, onSwitch }: Props) {
  return (
    <button
      onClick={onSwitch}
      className="w-full flex items-center gap-3 bg-gray-900 rounded-2xl p-4 text-left hover:bg-gray-800 transition-colors"
    >
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500 mb-0.5">Aliment</p>
        <p className="text-white font-semibold text-sm truncate">{foodName}</p>
      </div>
      <span className="text-xs text-orange-500 font-semibold shrink-0">Schimbă</span>
    </button>
  )
}
