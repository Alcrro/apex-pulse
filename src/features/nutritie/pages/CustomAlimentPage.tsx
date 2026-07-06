import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useCustomFoodForm } from '../hooks/useCustomFoodForm'
import { FoodPreviewBanner } from '../components/custom-aliment/FoodPreviewBanner'
import { RequiredFieldsCard } from '../components/custom-aliment/RequiredFieldsCard'
import { OptionalFieldsAccordion } from '../components/custom-aliment/OptionalFieldsAccordion'

export function CustomAlimentPage() {
  const navigate = useNavigate()
  const {
    name, setName, calories, setCalories, protein, setProtein,
    carbs, setCarbs, fat, setFat, fiber, setFiber, sodium, setSodium,
    nameRo, setNameRo, calNum, protNum, carbNum, fatNum,
    isValid, error, isLoading, handleSubmit,
  } = useCustomFoodForm()

  return (
    <div className="flex flex-col min-h-screen bg-gray-950">
      <div className="flex items-center gap-3 px-4 pt-safe pt-4 pb-3 border-b border-gray-800 shrink-0">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-gray-800 text-gray-400">
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-bold text-white flex-1">Aliment nou</h1>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          {isValid && <FoodPreviewBanner cal={calNum} protein={protNum} carbs={carbNum} fat={fatNum} />}

          <RequiredFieldsCard
            name={name}         onNameChange={setName}
            calories={calories} onCaloriesChange={setCalories}
            protein={protein}   onProteinChange={setProtein}
            carbs={carbs}       onCarbsChange={setCarbs}
            fat={fat}           onFatChange={setFat}
          />

          <OptionalFieldsAccordion
            fiber={fiber}   onFiberChange={setFiber}
            sodium={sodium} onSodiumChange={setSodium}
            nameRo={nameRo} onNameRoChange={setNameRo}
          />

          {error && <p className="text-sm text-red-400 text-center">{error}</p>}
        </div>
      </div>

      <div className="px-4 pb-safe pb-6 pt-3 border-t border-gray-800 shrink-0">
        <button
          onClick={handleSubmit}
          disabled={!isValid || isLoading}
          className="w-full py-4 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-base disabled:opacity-40 transition-colors"
        >
          {isLoading ? 'Se salvează...' : 'Salvează aliment'}
        </button>
      </div>
    </div>
  )
}
