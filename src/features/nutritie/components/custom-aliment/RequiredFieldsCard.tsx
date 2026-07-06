import { NutritionInput } from './NutritionInput'

interface Props {
  name: string;     onNameChange: (v: string) => void
  calories: string; onCaloriesChange: (v: string) => void
  protein: string;  onProteinChange: (v: string) => void
  carbs: string;    onCarbsChange: (v: string) => void
  fat: string;      onFatChange: (v: string) => void
}

export function RequiredFieldsCard({ name, onNameChange, calories, onCaloriesChange, protein, onProteinChange, carbs, onCarbsChange, fat, onFatChange }: Props) {
  return (
    <div className="bg-gray-900 rounded-2xl p-4 space-y-4">
      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Informații obligatorii</p>
      <NutritionInput
        label="Nume aliment"
        type="text"
        value={name}
        onChange={onNameChange}
        placeholder="ex: Piept de pui gătit"
      />
      <div className="grid grid-cols-2 gap-3">
        <NutritionInput label="Calorii / 100g"      value={calories} onChange={onCaloriesChange} />
        <NutritionInput label="Proteine / 100g"     value={protein}  onChange={onProteinChange}  labelColor="text-blue-400" />
        <NutritionInput label="Carbohidrați / 100g" value={carbs}    onChange={onCarbsChange}    labelColor="text-yellow-400" />
        <NutritionInput label="Grăsimi / 100g"      value={fat}      onChange={onFatChange}      labelColor="text-red-400" />
      </div>
    </div>
  )
}
