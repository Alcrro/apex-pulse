import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCustomFood } from './useCustomFood'

export function useCustomFoodForm() {
  const navigate = useNavigate()
  const { createCustomFood, isLoading } = useCustomFood()

  const [name, setName]         = useState('')
  const [calories, setCalories] = useState('')
  const [protein, setProtein]   = useState('')
  const [carbs, setCarbs]       = useState('')
  const [fat, setFat]           = useState('')
  const [fiber, setFiber]       = useState('')
  const [sodium, setSodium]     = useState('')
  const [nameRo, setNameRo]     = useState('')
  const [error, setError]       = useState<string | null>(null)

  const calNum  = parseFloat(calories) || 0
  const protNum = parseFloat(protein)  || 0
  const carbNum = parseFloat(carbs)    || 0
  const fatNum  = parseFloat(fat)      || 0

  const isValid =
    name.trim().length > 0 &&
    calNum > 0 &&
    protNum >= 0 &&
    carbNum >= 0 &&
    fatNum >= 0

  async function handleSubmit() {
    if (!isValid) return
    setError(null)
    const result = await createCustomFood({
      name:        name.trim(),
      nameRo:      nameRo.trim() || undefined,
      caloriesPerG: calNum  / 100,
      proteinG:    protNum / 100,
      carbsG:      carbNum / 100,
      fatG:        fatNum  / 100,
      fiberG:      fiber  ? parseFloat(fiber)  / 100 : undefined,
      sodiumMg:    sodium ? parseFloat(sodium) / 100 : undefined,
    })
    if (result) navigate(-1)
    else setError('Nu s-a putut salva alimentul. Încearcă din nou.')
  }

  return {
    name, setName,
    calories, setCalories,
    protein, setProtein,
    carbs, setCarbs,
    fat, setFat,
    fiber, setFiber,
    sodium, setSodium,
    nameRo, setNameRo,
    calNum, protNum, carbNum, fatNum,
    isValid, error, isLoading,
    handleSubmit,
  }
}
