# Database — Setări / Target Hidratare Zilnic

## Coloane relevante din `nutrition_goals`

```sql
-- Coloana folosită de secțiunea „Target hidratare"
-- Tabela completă: vezi ../DATABASE.md

water_target_ml  INT NOT NULL DEFAULT 2000
```

## Relație cu `nutrition_logs`

```sql
-- La crearea unui log zilnic nou, target-ul e copiat ca snapshot:
-- nutrition_logs.water_target_ml = nutrition_goals.water_target_ml

-- Astfel, dacă utilizatorul schimbă target-ul la mijlocul zilei,
-- log-urile existente nu se modifică retroactiv.
```

## Schema DB completă

vezi `../DATABASE.md`

## Testare manuală

- [ ] Schimbare target → `nutrition_goals.water_target_ml` actualizat imediat
- [ ] `WaterTracker` din log-ul zilnic reflectă noul target în <1s (după refetch / Realtime)
- [ ] Log-urile din zilele anterioare au `water_target_ml` neschimbat (snapshot corect)
