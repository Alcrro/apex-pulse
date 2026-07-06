interface Props {
  kcal: number
  protein: number
  carbs: number
  fat: number
}

export function EditMacroPreview({ kcal, protein, carbs, fat }: Props) {
  return (
    <div className="bg-gray-900 rounded-2xl p-4 space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-gray-400 text-sm">Total</span>
        <span className="text-2xl font-black text-orange-500 tabular-nums">{kcal} kcal</span>
      </div>
      <div className="grid grid-cols-3 gap-2 pt-1 border-t border-gray-800">
        <div className="text-center">
          <p className="text-base font-bold text-blue-400 tabular-nums">{protein}g</p>
          <p className="text-xs text-gray-500 mt-0.5">Proteine</p>
        </div>
        <div className="text-center">
          <p className="text-base font-bold text-yellow-400 tabular-nums">{carbs}g</p>
          <p className="text-xs text-gray-500 mt-0.5">Carbo</p>
        </div>
        <div className="text-center">
          <p className="text-base font-bold text-red-400 tabular-nums">{fat}g</p>
          <p className="text-xs text-gray-500 mt-0.5">Grăsimi</p>
        </div>
      </div>
    </div>
  )
}
