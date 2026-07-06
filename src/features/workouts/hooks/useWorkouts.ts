import { useEffect, useState } from 'react'
import { supabase } from '../../../shared/lib/supabase'
import { useAuth } from '../../../shared/context/AuthContext'
import type { WorkoutPlan, WorkoutExercise } from '../../../shared/types'

export function useWorkouts() {
  const { user } = useAuth()
  const [workouts, setWorkouts] = useState<WorkoutPlan[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    fetchWorkouts()
  }, [user])

  async function fetchWorkouts() {
    setLoading(true)
    const { data } = await supabase
      .from('workout_plans')
      .select('*, workout_exercises(count)')
      .eq('user_id', user!.id)
      .order('created_at', { ascending: false })
    setWorkouts((data as WorkoutPlan[]) ?? [])
    setLoading(false)
  }

  async function createWorkout(name: string, description: string) {
    const { data, error } = await supabase
      .from('workout_plans')
      .insert({ user_id: user!.id, name, description })
      .select()
      .single()
    if (!error) {
      const newPlan = { ...(data as WorkoutPlan), workout_exercises: [{ count: 0 }] }
      setWorkouts(prev => [newPlan, ...prev])
    }
    return { data: data as WorkoutPlan | null, error }
  }

  async function deleteWorkout(id: string) {
    const { error } = await supabase.from('workout_plans').delete().eq('id', id)
    if (!error) setWorkouts(prev => prev.filter(w => w.id !== id))
    return { error }
  }

  async function updateWorkout(id: string, updates: Partial<Pick<WorkoutPlan, 'name' | 'description'>>) {
    const currentEditCount = workouts.find(w => w.id === id)?.edit_count ?? 0
    const { data, error } = await supabase
      .from('workout_plans')
      .update({ ...updates, edit_count: currentEditCount + 1 })
      .eq('id', id)
      .select()
      .single()
    if (!error) setWorkouts(prev => prev.map(w => w.id === id ? { ...w, ...(data as WorkoutPlan) } : w))
    return { data: data as WorkoutPlan | null, error }
  }

  async function incrementEditCount(id: string) {
    const currentEditCount = workouts.find(w => w.id === id)?.edit_count ?? 0
    await supabase
      .from('workout_plans')
      .update({ edit_count: currentEditCount + 1 })
      .eq('id', id)
    setWorkouts(prev => prev.map(w => w.id === id ? { ...w, edit_count: currentEditCount + 1 } : w))
  }

  return { workouts, loading, createWorkout, deleteWorkout, updateWorkout, incrementEditCount, refetch: fetchWorkouts }
}

export function useWorkoutDetail(workoutId: string | undefined) {
  const [workout, setWorkout] = useState<WorkoutPlan | null>(null)
  const [exercises, setExercises] = useState<WorkoutExercise[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!workoutId) return
    fetchWorkout()
  }, [workoutId])

  async function fetchWorkout() {
    if (!workoutId) return
    setLoading(true)
    const [{ data: wData }, { data: eData }] = await Promise.all([
      supabase.from('workout_plans').select('*').eq('id', workoutId).single(),
      supabase
        .from('workout_exercises')
        .select('*, exercises(*)')
        .eq('workout_plan_id', workoutId)
        .order('order_index'),
    ])
    setWorkout(wData as WorkoutPlan | null)
    setExercises((eData as WorkoutExercise[]) ?? [])
    setLoading(false)
  }

  async function bumpEditCount() {
    if (!workoutId || !workout) return
    const next = workout.edit_count + 1
    await supabase.from('workout_plans').update({ edit_count: next }).eq('id', workoutId)
    setWorkout(prev => prev ? { ...prev, edit_count: next } : prev)
  }

  async function addExercise(exerciseId: string, sets: number, reps: number, restSeconds: number) {
    const nextOrder = exercises.length
    const { data, error } = await supabase
      .from('workout_exercises')
      .insert({
        workout_plan_id: workoutId,
        exercise_id: exerciseId,
        sets,
        reps,
        rest_seconds: restSeconds,
        order_index: nextOrder,
      })
      .select('*, exercises(*)')
      .single()
    if (!error) {
      setExercises(prev => [...prev, data as WorkoutExercise])
      bumpEditCount()
    }
    return { data: data as WorkoutExercise | null, error }
  }

  async function removeExercise(weId: string) {
    const { error } = await supabase.from('workout_exercises').delete().eq('id', weId)
    if (!error) {
      setExercises(prev => prev.filter(e => e.id !== weId))
      bumpEditCount()
    }
    return { error }
  }

  async function updateExercise(weId: string, updates: Partial<Pick<WorkoutExercise, 'sets' | 'reps' | 'rest_seconds'>>) {
    const { data, error } = await supabase
      .from('workout_exercises')
      .update(updates)
      .eq('id', weId)
      .select('*, exercises(*)')
      .single()
    if (!error) setExercises(prev => prev.map(e => e.id === weId ? (data as WorkoutExercise) : e))
    return { data: data as WorkoutExercise | null, error }
  }

  async function reorderExercises(reordered: WorkoutExercise[]) {
    setExercises(reordered)
    await supabase
      .from('workout_exercises')
      .upsert(reordered.map((we, i) => ({ id: we.id, order_index: i })))
    bumpEditCount()
  }

  return { workout, exercises, loading, addExercise, removeExercise, updateExercise, reorderExercises, refetch: fetchWorkout }
}
