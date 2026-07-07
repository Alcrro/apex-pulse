import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../../../shared/lib/supabase'
import { useAuth } from '../../../shared/context/AuthContext'
import type { NutritionGoals, GoalType, NutritionPhase } from '../../../shared/types'
import { computeMacroTargets } from '../utils/nutritionHelpers'
import {
  DEFAULT_SPLIT,
  parseGoals,
  buildGoalTypeRow,
  buildManualCaloriesRow,
  buildCustomMacroRow,
} from '../utils/nutritionTarget'

export function useNutritionTarget() {
  const { user } = useAuth()
  const [goals, setGoals] = useState<NutritionGoals | null>(null)
  const [loading, setLoading] = useState(true)
  const [avgCalories, setAvgCalories] = useState<number | null>(null)

  const fetchGoals = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const { data } = await supabase
        .from('nutrition_goals')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle()
      setGoals(data ? parseGoals(data) : null)
    } catch {
      setGoals(null)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (!user) return
    const from = new Date()
    from.setDate(from.getDate() - 13)
    supabase
      .from('nutrition_logs')
      .select('total_calories')
      .eq('user_id', user.id)
      .gte('log_date', from.toISOString().split('T')[0])
      .is('deleted_at', null)
      .then(({ data }) => {
        if (!data || data.length === 0) { setAvgCalories(null); return }
        const avg = data.reduce((s: number, r) => s + Number(r.total_calories), 0) / data.length
        setAvgCalories(Math.round(avg))
      })
      .catch(() => setAvgCalories(null))
  }, [user])

  useEffect(() => { fetchGoals() }, [fetchGoals])

  const phase: NutritionPhase = goals?.goalType ? 'active' : 'discovery'

  const split = {
    protein: goals?.targetProteinPct ?? DEFAULT_SPLIT.protein,
    carbs:   goals?.targetCarbsPct   ?? DEFAULT_SPLIT.carbs,
    fat:     goals?.targetFatPct     ?? DEFAULT_SPLIT.fat,
  }

  const macroTargets = goals?.targetCalories
    ? computeMacroTargets(goals.targetCalories, split)
    : null

  async function setGoalType(type: GoalType, baseTdee?: number) {
    if (!user) return
    const tdee = baseTdee ?? avgCalories ?? 2000
    const { data } = await supabase
      .from('nutrition_goals')
      .upsert(buildGoalTypeRow(user.id, type, tdee), { onConflict: 'user_id' })
      .select()
      .single()
    if (data) setGoals(parseGoals(data))
  }

  async function setManualCalories(kcal: number) {
    if (!user) return
    const { data } = await supabase
      .from('nutrition_goals')
      .upsert(buildManualCaloriesRow(user.id, kcal), { onConflict: 'user_id' })
      .select()
      .single()
    if (data) setGoals(parseGoals(data))
  }

  async function setCustomMacroSplit(protein: number, carbs: number, fat: number) {
    if (!user) return
    const { data } = await supabase
      .from('nutrition_goals')
      .upsert(buildCustomMacroRow(user.id, protein, carbs, fat), { onConflict: 'user_id' })
      .select()
      .single()
    if (data) setGoals(parseGoals(data))
  }

  return { goals, phase, loading, macroTargets, avgCalories, setGoalType, setManualCalories, setCustomMacroSplit }
}
