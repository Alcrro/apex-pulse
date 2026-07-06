import { MacroDonut } from '../MacroDonut'

interface Portion {
  calories: number
  protein: number
  carbs: number
  fat: number
}

interface Props {
  portion: Portion
  gramsNum: number
}

export function MacroTabContent({ portion, gramsNum }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex justify-center py-2">
        <MacroDonut
          proteinG={portion.protein}
          carbsG={portion.carbs}
          fatG={portion.fat}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-900 rounded-2xl p-4 text-center col-span-2">
          <p className="text-4xl font-black text-orange-500 tabular-nums">{portion.calories}</p>
          <p className="text-xs text-gray-400 mt-1">kcal per {gramsNum}g</p>
        </div>
        <div className="bg-gray-900 rounded-2xl p-4 text-center">
          <p className="text-2xl font-black text-blue-400 tabular-nums">{portion.protein}g</p>
          <p className="text-xs text-gray-400 mt-1">Proteine</p>
        </div>
        <div className="bg-gray-900 rounded-2xl p-4 text-center">
          <p className="text-2xl font-black text-yellow-400 tabular-nums">{portion.carbs}g</p>
          <p className="text-xs text-gray-400 mt-1">Carbohidrați</p>
        </div>
        <div className="bg-gray-900 rounded-2xl p-4 text-center col-span-2">
          <p className="text-2xl font-black text-red-400 tabular-nums">{portion.fat}g</p>
          <p className="text-xs text-gray-400 mt-1">Grăsimi</p>
        </div>
      </div>
    </div>
  )
}
