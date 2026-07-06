interface Props {
  kcal: number
  protein: number
  carbs: number
  fat: number
}

export function MacroPreviewCards({ kcal, protein, carbs, fat }: Props) {
  return (
    <>
      <div className="bg-gray-900 rounded-2xl p-4 flex justify-between items-center">
        <span className="text-gray-400 text-sm">Calorii</span>
        <span className="text-3xl font-black text-orange-500 tabular-nums">{kcal} kcal</span>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-gray-900 rounded-2xl p-4 text-center">
          <p className="text-xl font-black text-blue-400 tabular-nums">{protein}g</p>
          <p className="text-xs text-gray-400 mt-1">Proteine</p>
        </div>
        <div className="bg-gray-900 rounded-2xl p-4 text-center">
          <p className="text-xl font-black text-yellow-400 tabular-nums">{carbs}g</p>
          <p className="text-xs text-gray-400 mt-1">Carbohidrați</p>
        </div>
        <div className="bg-gray-900 rounded-2xl p-4 text-center">
          <p className="text-xl font-black text-red-400 tabular-nums">{fat}g</p>
          <p className="text-xs text-gray-400 mt-1">Grăsimi</p>
        </div>
      </div>
    </>
  )
}
