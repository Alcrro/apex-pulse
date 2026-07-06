import { useState } from 'react'
import { useNutritionLog } from '../hooks/useNutritionLog'
import { useNutritionTarget } from '../hooks/useNutritionTarget'
import { useMealCount } from '../hooks/useMealCount'
import { WeekStrip } from '../components/WeekStrip'
import { WeekNav } from '../components/nutritie-page/WeekNav'
import { CalorieCard } from '../components/nutritie-page/CalorieCard'
import { WaterCard } from '../components/nutritie-page/WaterCard'
import { NotificationsPanel } from '../components/nutritie-page/NotificationsPanel'
import { MealList } from '../components/nutritie-page/MealList'
import { formatDate, computeMacroTargets, buildNotifications } from '../utils/nutritionHelpers'

export function NutritiePage() {
  const today = formatDate(new Date())
  const [date, setDate] = useState(today)
  const [notifOpen, setNotifOpen] = useState(false)

  const { log, loading, addFoodEntry, updateFoodEntry, removeFoodEntry, addWater } = useNutritionLog(date)
  const { goals, phase, macroTargets, avgCalories } = useNutritionTarget()
  const { mealCount, addMeal } = useMealCount(date, log?.entries)

  const totalCalories = log?.totalCalories ?? 0
  const totalProtein  = log?.totalProteinG ?? 0
  const totalCarbs    = log?.totalCarbsG ?? 0
  const totalFat      = log?.totalFatG ?? 0
  const waterMl       = log?.waterMl ?? 0
  const waterTarget   = Number(localStorage.getItem('water_target_ml') || 2000)

  const hasActiveGoal = phase === 'active' && goals?.targetCalories
  const effectiveMacroTargets = macroTargets ?? computeMacroTargets(
    hasActiveGoal ? goals!.targetCalories! : 2000,
    { protein: 25, carbs: 45, fat: 30 },
  )

  const notifications = buildNotifications(phase, avgCalories)

  return (
    <div className="space-y-3 pb-6">
      <WeekNav date={date} today={today} onChange={setDate} />
      <WeekStrip selectedDate={date} today={today} onSelect={setDate} />

      {loading ? (
        <div className="grid grid-cols-2 gap-3">
          <div className="h-52 bg-gray-900 rounded-2xl animate-pulse" />
          <div className="h-52 bg-gray-900 rounded-2xl animate-pulse" />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <CalorieCard
            totalCalories={totalCalories}
            targetCalories={hasActiveGoal ? goals!.targetCalories! : null}
            totalProtein={totalProtein}
            totalCarbs={totalCarbs}
            totalFat={totalFat}
            macroTargets={effectiveMacroTargets}
            notifCount={notifications.length}
            notifOpen={notifOpen}
            onToggleNotif={() => setNotifOpen((v) => !v)}
          />
          <WaterCard waterMl={waterMl} waterTarget={waterTarget} onAdd={addWater} />
        </div>
      )}

      <NotificationsPanel
        open={notifOpen}
        notifications={notifications}
        onClose={() => setNotifOpen(false)}
      />

      <MealList
        mealCount={mealCount}
        entries={log?.entries ?? []}
        onAdd={addFoodEntry}
        onUpdate={updateFoodEntry}
        onRemove={removeFoodEntry}
        onAddMeal={addMeal}
      />
    </div>
  )
}
