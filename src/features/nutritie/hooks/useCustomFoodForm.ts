import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCustomFood } from './useCustomFood'
import {
  parseCustomFoodFields,
  validateCustomFoodForm,
  buildCustomFoodPayload,
} from '../utils/customFoodForm'

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

  const fields = { name, nameRo, calories, protein, carbs, fat, fiber, sodium }
  const { calNum, protNum, carbNum, fatNum } = parseCustomFoodFields(fields)
  const isValid = validateCustomFoodForm(name, calNum, protNum, carbNum, fatNum)

  async function handleSubmit() {
    if (!isValid) return
    setError(null)
    const result = await createCustomFood(buildCustomFoodPayload(fields, calNum, protNum, carbNum, fatNum))
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
