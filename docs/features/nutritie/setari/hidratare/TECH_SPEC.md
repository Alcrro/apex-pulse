# Tech Spec — Setări / Target Hidratare Zilnic

## Arhitectură generală

Secțiune în `NutritieSetariPage`. Consumă `useNutritionTarget` (partajat) pentru `setWaterTarget(ml)`. UI: 4 butoane predefinite, save optimistic.

```
NutritieSetariPage (secțiunea „Target hidratare")
  └── useNutritionTarget
        └── setWaterTarget(ml) → UPDATE nutrition_goals.water_target_ml
  └── UI inline cu 4 butoane (1500 / 2000 / 2500 / 3000 ml)
```

## Componente

UI inline în `NutritieSetariPage` — 4 butoane simpli, nu necesită componentă separată.

## Hooks

`useNutritionTarget.setWaterTarget(ml)`:
```ts
async function setWaterTarget(ml: number) {
  // Optimistic update local
  setGoals(prev => ({ ...prev, water_target_ml: ml }))
  await supabase
    .from('nutrition_goals')
    .upsert({ user_id: user.id, water_target_ml: ml })
}
```

Valoarea e citită și de `useWaterLog` / `useNutritionLog` în log-ul zilnic via `nutrition_logs.water_target_ml` (copiată la crearea log-ului zilnic) sau direct din `nutrition_goals`.

## Schema DB

vezi `../DATABASE.md` — coloana `water_target_ml` din `nutrition_goals`

## Decizii tehnice

**4 valori fixe vs. input liber:** Reducerea fricțiunii — tap simplu în loc de tastare. Acoperă 95% din cazuri (1.5–3L). Input liber poate fi adăugat ca „altă valoare" în v2.

**Save optimistic fără buton:** Selecția e imediată și reversibilă (tap pe altă opțiune). Nu există risc de date loss — e o preferință, nu date nutriționale.

**`water_target_ml` în `nutrition_goals` vs. `nutrition_logs`:** Target-ul e global per utilizator (setat o dată). Valoarea zilnică consumată (`water_ml`) e per-zi în `nutrition_logs`. La crearea unui log nou, `water_target_ml` se copiază din `nutrition_goals` ca snapshot pentru ziua respectivă.
