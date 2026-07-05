import { useState } from 'react'
import Anthropic from '@anthropic-ai/sdk'
import { supabase } from '../../../shared/lib/supabase'
import { DEFAULT_EXERCISES } from '../../../shared/lib/exercises'
import type { SplitConfig, DayType } from '../utils/splitTypes'

const LEVEL_RO: Record<string, string> = {
  incepator: 'începător',
  intermediar: 'intermediar',
  avansat: 'avansat',
}

const WORKOUT_MUSCLES: Record<DayType, string[]> = {
  upper: ['Piept', 'Spate', 'Umeri', 'Biceps', 'Triceps'],
  lower: ['Picioare'],
  push:  ['Piept', 'Umeri', 'Triceps'],
  pull:  ['Spate', 'Biceps'],
  legs:  ['Picioare'],
  full:  ['Piept', 'Spate', 'Umeri', 'Biceps', 'Triceps', 'Picioare'],
  rest:  [],
}

const WORKOUT_NAMES_RO: Record<DayType, string> = {
  upper: 'Upper Body',
  lower: 'Lower Body',
  push:  'Push',
  pull:  'Pull',
  legs:  'Picioare',
  full:  'Full Body',
  rest:  '',
}

interface GeneratedExercise {
  name: string
  sets: number
  reps: number
  rest_seconds: number
}

interface GeneratedPlan {
  type: DayType
  name: string
  exercises: GeneratedExercise[]
}

function buildExercisePool(types: DayType[]): string {
  const muscles = new Set<string>()
  types.forEach(t => WORKOUT_MUSCLES[t].forEach(m => muscles.add(m)))

  return [...muscles].map(group => {
    const exs = DEFAULT_EXERCISES
      .filter(e => e.muscle_group === group)
      .map(e => `${e.name} (${e.equipment})`)
      .join(', ')
    return `${group}: ${exs}`
  }).join('\n')
}

export function useGenerateWorkouts() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function generate(config: SplitConfig): Promise<boolean> {
    const apiKey = import.meta.env.VITE_CLAUDE_API_KEY as string | undefined
    if (!apiKey) {
      setError('Adaugă VITE_CLAUDE_API_KEY în fișierul .env')
      return false
    }

    // unique non-rest workout types
    const uniqueTypes = [...new Set(config.days.filter(d => d !== 'rest'))] as DayType[]
    if (uniqueTypes.length === 0) {
      setError('Configurează cel puțin o zi de antrenament.')
      return false
    }

    setLoading(true)
    setError(null)

    try {
      // 1. fetch existing exercises from DB to get their IDs
      const { data: dbExercises } = await supabase
        .from('exercises')
        .select('id, name')
        .is('user_id', null) // global exercises only

      const nameToId: Record<string, string> = {}
      if (dbExercises) {
        dbExercises.forEach((e: { id: string; name: string }) => {
          nameToId[e.name.toLowerCase()] = e.id
        })
      }

      const exercisePool = buildExercisePool(uniqueTypes)
      const level = LEVEL_RO[config.level] ?? config.level

      const prompt = `Ești un antrenor personal expert. Generează planuri de antrenament în format JSON.

Nivel client: ${level}
Tipuri de antrenament necesare: ${uniqueTypes.map(t => WORKOUT_NAMES_RO[t]).join(', ')}

Exerciții disponibile (alege DOAR din această listă, respectă exact numele):
${exercisePool}

Returnează un JSON valid cu structura:
{
  "plans": [
    {
      "type": "<tip>",
      "name": "<nume plan în română>",
      "exercises": [
        { "name": "<nume exact din lista de mai sus>", "sets": <număr>, "reps": <număr>, "rest_seconds": <secunde> }
      ]
    }
  ]
}

Reguli:
- ${level === 'începător' ? '4-5 exerciții pe plan, 3 serii, 10-12 repetări' : level === 'intermediar' ? '5-6 exerciții pe plan, 3-4 serii, 8-12 repetări' : '6-8 exerciții pe plan, 4-5 serii, 5-12 repetări'}
- Rest între serii: 60-120 secunde pentru exerciții de izolație, 120-180 pentru exerciții compuse
- Prioritizează exerciții compuse (Bench Press, Squat, Deadlift, Overhead Press, Row)
- Variază echipamentul (Bara, Gantere, Cablu, Masina)
- Returnează STRICT JSON, fără text suplimentar`

      const client = new Anthropic({
        apiKey,
        dangerouslyAllowBrowser: true,
      })

      const message = await client.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 2048,
        messages: [{ role: 'user', content: prompt }],
      })

      const rawText = message.content[0].type === 'text' ? message.content[0].text : ''
      const jsonMatch = rawText.match(/\{[\s\S]*\}/)
      if (!jsonMatch) throw new Error('Răspuns invalid de la AI.')

      const parsed = JSON.parse(jsonMatch[0]) as { plans: GeneratedPlan[] }

      // 2. get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Utilizator neautentificat.')

      // 3. create workout plans in DB
      for (const plan of parsed.plans) {
        // create the plan
        const { data: newPlan, error: planErr } = await supabase
          .from('workout_plans')
          .insert({ name: plan.name, user_id: user.id })
          .select('id')
          .single()

        if (planErr || !newPlan) continue

        // add exercises
        const exercisesToInsert = plan.exercises
          .map((ex, idx) => {
            const exId = nameToId[ex.name.toLowerCase()]
            if (!exId) return null
            return {
              workout_plan_id: newPlan.id,
              exercise_id: exId,
              sets: ex.sets,
              reps: ex.reps,
              rest_seconds: ex.rest_seconds,
              order_index: idx,
            }
          })
          .filter(Boolean)

        if (exercisesToInsert.length > 0) {
          await supabase.from('workout_exercises').insert(exercisesToInsert)
        }
      }

      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare la generare.')
      return false
    } finally {
      setLoading(false)
    }
  }

  return { generate, loading, error }
}
