# Database — Setări / Split Macronutrienți

## Coloane relevante din `nutrition_goals`

```sql
-- Coloanele folosite de secțiunea „Split macronutrienți"
-- Tabela completă: vezi ../DATABASE.md

target_protein_pct   SMALLINT NOT NULL DEFAULT 25,
target_carbs_pct     SMALLINT NOT NULL DEFAULT 45,
target_fat_pct       SMALLINT NOT NULL DEFAULT 30,

CONSTRAINT valid_macro_pct
  CHECK (target_protein_pct + target_carbs_pct + target_fat_pct = 100)
```

## Schema DB completă

vezi `../DATABASE.md`

## Testare manuală

- [ ] Insert cu `target_protein_pct + target_carbs_pct + target_fat_pct ≠ 100` → eșuează (constraint DB)
- [ ] Validare client-side previne request-ul cu sumă invalidă (buton disabled)
- [ ] La schimbarea `goal_type`, split-ul se resetează la valorile implicite ale obiectivului nou
