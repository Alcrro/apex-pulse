interface Props {
  cal: number
  protein: number
  carbs: number
  fat: number
}

export function FoodPreviewBanner({ cal, protein, carbs, fat }: Props) {
  return (
    <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-4">
      <p className="text-xs text-gray-400 mb-1">Per 100g</p>
      <p className="text-white font-semibold text-sm">
        {cal} kcal
        <span className="text-gray-400 font-normal"> | </span>
        <span className="text-blue-400">P {protein}g</span>
        <span className="text-gray-400 font-normal"> | </span>
        <span className="text-yellow-400">C {carbs}g</span>
        <span className="text-gray-400 font-normal"> | </span>
        <span className="text-red-400">G {fat}g</span>
      </p>
    </div>
  )
}
