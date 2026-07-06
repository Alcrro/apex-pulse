# Database — Setări / Obiectiv Caloric

## Coloane relevante din `nutrition_goals`

```sql
-- Coloanele folosite de secțiunea „Obiectiv caloric"
-- Tabela completă: vezi ../DATABASE.md

goal_type            TEXT CHECK (goal_type IN ('mentinere', 'deficit_usor', 'deficit_moderat', 'surplus')),
tdee_estimated       INT,           -- calculat din AVG(nutrition_logs.total_calories)
tdee_calculated_at   TIMESTAMPTZ,
tdee_warning         BOOLEAN NOT NULL DEFAULT FALSE,
target_calories      INT,           -- NULL în faza discovery
is_manual_override   BOOLEAN NOT NULL DEFAULT FALSE,
onboarding_triggered_at TIMESTAMPTZ
```

## Schema DB completă

vezi `../DATABASE.md`

## Testare manuală

- [ ] `goal_type = 'deficit_usor'` → `target_calories = tdee_estimated - 300`
- [ ] `is_manual_override = TRUE` → schimbarea `goal_type` nu suprascrie `target_calories`
- [ ] `onboarding_triggered_at` setat o singură dată, nu suprascris
