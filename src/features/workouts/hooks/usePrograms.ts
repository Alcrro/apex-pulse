import { useEffect, useState } from 'react'
import { supabase } from '../../../shared/lib/supabase'
import { useAuth } from '../../../shared/context/AuthContext'
import type { Program, WorkoutPlan } from '../../../shared/types'

export interface ProgramWithPlans extends Program {
  workout_plans: WorkoutPlan[]
}

export function getNextPlan(
  program: ProgramWithPlans,
  sessions: Array<{ workout_plan_id: string | null; started_at: string }>
): WorkoutPlan | null {
  const plans = [...program.workout_plans].sort((a, b) => a.program_order - b.program_order)
  if (plans.length === 0) return null

  const planIds = new Set(plans.map(p => p.id))
  const lastSession = sessions
    .filter(s => s.workout_plan_id && planIds.has(s.workout_plan_id))
    .sort((a, b) => new Date(b.started_at).getTime() - new Date(a.started_at).getTime())[0]

  if (!lastSession || !lastSession.workout_plan_id) return plans[0]

  const lastIdx = plans.findIndex(p => p.id === lastSession.workout_plan_id)
  if (lastIdx === -1) return plans[0]

  return plans[(lastIdx + 1) % plans.length]
}

export function usePrograms() {
  const { user } = useAuth()
  const [programs, setPrograms] = useState<ProgramWithPlans[]>([])
  const [standaloneWorkouts, setStandaloneWorkouts] = useState<WorkoutPlan[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    fetchAll()
  }, [user])

  async function fetchAll() {
    setLoading(true)

    const [{ data: programsData }, { data: standalonePlans }] = await Promise.all([
      supabase
        .from('programs')
        .select('*, workout_plans(*, workout_exercises(count))')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false }),
      supabase
        .from('workout_plans')
        .select('*, workout_exercises(count)')
        .eq('user_id', user!.id)
        .is('program_id', null)
        .order('created_at', { ascending: false }),
    ])

    const rawPrograms = (programsData ?? []) as ProgramWithPlans[]
    const normalized = rawPrograms.map(p => ({
      ...p,
      workout_plans: (p.workout_plans ?? []).sort((a: WorkoutPlan, b: WorkoutPlan) => a.program_order - b.program_order),
    }))

    setPrograms(normalized)
    setStandaloneWorkouts((standalonePlans as WorkoutPlan[]) ?? [])
    setLoading(false)
  }

  const activeProgram = programs.find(p => p.is_active) ?? null

  async function createProgram(name: string): Promise<ProgramWithPlans | null> {
    const { data, error } = await supabase
      .from('programs')
      .insert({ user_id: user!.id, name, is_active: false })
      .select()
      .single()
    if (error || !data) return null
    const newProgram: ProgramWithPlans = { ...(data as Program), workout_plans: [] }
    setPrograms(prev => [newProgram, ...prev])
    return newProgram
  }

  async function activateProgram(id: string) {
    await supabase.from('programs').update({ is_active: false }).eq('user_id', user!.id)
    await supabase.from('programs').update({ is_active: true }).eq('id', id)
    setPrograms(prev => prev.map(p => ({ ...p, is_active: p.id === id })))
  }

  async function deactivateAll() {
    await supabase.from('programs').update({ is_active: false }).eq('user_id', user!.id)
    await supabase.from('workout_plans').update({ is_active: false }).eq('user_id', user!.id)
    setPrograms(prev => prev.map(p => ({ ...p, is_active: false })))
    setStandaloneWorkouts(prev => prev.map(w => ({ ...w, is_active: false })))
  }

  async function activateStandalonePlan(id: string) {
    await supabase.from('programs').update({ is_active: false }).eq('user_id', user!.id)
    await supabase.from('workout_plans').update({ is_active: false }).eq('user_id', user!.id)
    await supabase.from('workout_plans').update({ is_active: true }).eq('id', id)
    setPrograms(prev => prev.map(p => ({ ...p, is_active: false })))
    setStandaloneWorkouts(prev => prev.map(w => ({ ...w, is_active: w.id === id })))
  }

  async function renameProgram(id: string, name: string) {
    const { error } = await supabase.from('programs').update({ name }).eq('id', id)
    if (!error) setPrograms(prev => prev.map(p => p.id === id ? { ...p, name } : p))
  }

  async function deleteProgram(id: string) {
    const { error } = await supabase.from('programs').delete().eq('id', id)
    if (!error) {
      setPrograms(prev => prev.filter(p => p.id !== id))
      await fetchAll()
    }
  }

  async function groupStandaloneIntoProgram(planIds: string[], name: string) {
    await supabase.from('programs').update({ is_active: false }).eq('user_id', user!.id)
    const { data: newProgram } = await supabase
      .from('programs')
      .insert({ user_id: user!.id, name, is_active: true })
      .select('id')
      .single()
    if (!newProgram) return
    await Promise.all(
      planIds.map((id, idx) =>
        supabase.from('workout_plans').update({ program_id: newProgram.id, program_order: idx }).eq('id', id)
      )
    )
    await fetchAll()
  }

  const activePlan = standaloneWorkouts.find(w => w.is_active) ?? null

  return {
    programs,
    standaloneWorkouts,
    loading,
    activeProgram,
    activePlan,
    createProgram,
    activateProgram,
    activateStandalonePlan,
    deactivateAll,
    renameProgram,
    deleteProgram,
    groupStandaloneIntoProgram,
    refetch: fetchAll,
  }
}
