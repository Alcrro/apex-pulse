# Tech Spec — Setări / Split Macronutrienți

## Arhitectură generală

Secțiune în `NutritieSetariPage`. Consumă `useNutritionTarget` (partajat). Toată logica de validare sumă = 100% stă în componentă, save-ul în hook.

```
NutritieSetariPage (secțiunea „Split macronutrienți")
  └── useNutritionTarget
        └── updateMacroPct(protein, carbs, fat) → UPDATE nutrition_goals
  └── UI inline (nu componentă separată — suficient de simplu)
```

## Componente

Nu se creează componentă separată — secțiunea e inline în `NutritieSetariPage`. Suficient de simplă (3 rânduri cu butoane ±).

## Hooks

Consumă `useNutritionTarget.updateMacroPct(p, c, f)`. Validare client: `p + c + f === 100` înainte de a activa butonul „Salvează split-ul".

## Schema DB

vezi `../DATABASE.md` — coloane `target_protein_pct`, `target_carbs_pct`, `target_fat_pct` din `nutrition_goals`

## Calcul gramaj live

```ts
// kcal per gram: P=4, C=4, G=9
function gramsFromPct(pct: number, targetKcal: number, kcalPerG: number) {
  return Math.round((pct / 100) * targetKcal / kcalPerG)
}
// Proteine: gramsFromPct(35, 2000, 4) = 175g
// Carbohidrați: gramsFromPct(40, 2000, 4) = 200g
// Grăsimi: gramsFromPct(25, 2000, 9) = 56g
```

## Decizii tehnice

**Ajustare cu ±5% per click:** Simplu și predictibil. La ±1% ar fi prea granular pentru un selector cu butoane; slider ar fi mai fluid dar mai greu de controlat precis pe mobile.

**Buton `+` dezactivat când suma ar depăși 100%:** Previne stări invalide fără a bloca utilizatorul agresiv. El vede că nu poate adăuga mai mult la un macro fără să scadă altul.

**Valorile implicite per obiectiv restaurate la schimbarea goal_type:** `setGoalType()` din `useNutritionTarget` resetează și macro split-ul la valorile default ale obiectivului — dar numai dacă `is_manual_macro_override` e `false` (flag viitor; la lansare: mereu resetăm).
