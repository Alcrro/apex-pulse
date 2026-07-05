import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../../../shared/lib/supabase'
import { useAuth } from '../../../shared/context/AuthContext'
import type { NutritionGoals, GoalType, NutritionPhase } from '../../../shared/types'
import { GOAL_OFFSETS, GOAL_MACRO_SPLIT, computeMacroTargets } from '../utils/nutritionHelpers'

const DEFAULT_SPLIT = { protein: 25, carbs: 45, fat: 30 }

function parseGoals(row: any): NutritionGoals {
  return {
    goalType: row.goal_type ?? null,
    tdeeEstimated: row.tdee_estimated ?? undefined,
    targetCalories: row.target_calories ?? undefined,
    isManualOverride: row.is_manual_override ?? false,
    targetProteinPct: row.target_protein_pct ?? 25,
    targetCarbsPct: row.target_carbs_pct ?? 45,
    targetFatPct: row.target_fat_pct ?? 30,
  }
}

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

  // media caloric din ultimele 14 zile (pentru faza discovery)
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
        const avg = data.reduce((s: number, r: any) => s + Number(r.total_calories), 0) / data.length
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
    const targetCalories = tdee + GOAL_OFFSETS[type]
    const s = GOAL_MACRO_SPLIT[type]

    const row = {
      user_id: user.id,
      goal_type: type,
      target_calories: targetCalories,
      target_protein_pct: s.protein,
      target_carbs_pct: s.carbs,
      target_fat_pct: s.fat,
      is_manual_override: false,
      updated_at: new Date().toISOString(),
    }

    const { data } = await supabase
      .from('nutrition_goals')
      .upsert(row, { onConflict: 'user_id' })
      .select()
      .single()

    if (data) setGoals(parseGoals(data))
  }

  async function setManualCalories(kcal: number) {
    if (!user) return
    const now = new Date().toISOString()
    const base = { user_id: user.id, updated_at: now }
    const { data } = await supabase
      .from('nutrition_goals')
      .upsert({ ...base, target_calories: kcal, is_manual_override: true }, { onConflict: 'user_id' })
      .select()
      .single()
    if (data) setGoals(parseGoals(data))
  }

  async function setCustomMacroSplit(protein: number, carbs: number, fat: number) {
    if (!user) return
    const now = new Date().toISOString()
    const { data } = await supabase
      .from('nutrition_goals')
      .upsert(
        { user_id: user.id, target_protein_pct: protein, target_carbs_pct: carbs, target_fat_pct: fat, updated_at: now },
        { onConflict: 'user_id' },
      )
      .select()
      .single()
    if (data) setGoals(parseGoals(data))
  }

  return { goals, phase, loading, macroTargets, avgCalories, setGoalType, setManualCalories, setCustomMacroSplit }
}
