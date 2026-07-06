# Tech Spec — Setări / Obiectiv Caloric

## Arhitectură generală

Secțiune în `NutritieSetariPage`. Consumă `useNutritionTarget` — nu are hook propriu, logica de calcul TDEE și save stă în hook-ul partajat al paginii de setări.

```
NutritieSetariPage (secțiunea „Obiectiv caloric")
  └── useNutritionTarget
        ├── SELECT AVG(total_calories) FROM nutrition_logs  → tdeeEstimated
        ├── setGoalType(type) → UPDATE nutrition_goals
        └── setManualCalories(kcal) → UPDATE nutrition_goals (is_manual_override = true)
  └── GoalSelector component
```

## Componente noi

| Componentă | Locație | Responsabilitate |
|-----------|---------|-----------------|
| `GoalSelector` | `features/nutritie/components/` | 4 carduri selectabile cu offset kcal + badge-uri macro |

## Hooks

Consumă `useNutritionTarget` (partajat cu `split-macro` și `hidratare` — același hook pentru toată pagina de setări). Nu se creează hook separat.

## Schema DB

vezi `../DATABASE.md` — coloana `goal_type`, `target_calories`, `is_manual_override`, `tdee_estimated` din `nutrition_goals`

## Calcul TDEE

```ts
// Fetch ultimele 14 zile cu date (total_calories > 0)
const { data } = await supabase
  .from('nutrition_logs')
  .select('total_calories')
  .eq('user_id', user.id)
  .gt('total_calories', 0)
  .order('log_date', { ascending: false })
  .limit(14)

tdeeEstimated = data.reduce((s, r) => s + r.total_calories, 0) / data.length

// Target = TDEE + offset obiectiv
const OFFSETS = { mentinere: 0, deficit_usor: -300, deficit_moderat: -500, surplus: 300 }
targetCalories = Math.round(tdeeEstimated + OFFSETS[goalType])
```

## Decizii tehnice

**TDEE afișat chiar dacă <14 zile de date:** Afișăm cu câte zile avem (minim 3), cu label „bazat pe ultimele N zile". Sub 3 zile: secțiunea TDEE hidden, afișăm mesaj „Adaugă mai multe zile de date pentru a estima TDEE".

**`is_manual_override` blochează recalculul automat:** Dacă `true`, `setGoalType()` nu suprascrie `target_calories` — doar schimbă `goal_type` (pentru split macro). Buton „Recalculează" resetează flag-ul.
