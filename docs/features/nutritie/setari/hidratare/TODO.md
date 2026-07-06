# TODO — Setări / Target Hidratare Zilnic

## Frontend

### Logică în `NutritieSetariPage`
- [x] 4 butoane/carduri orizontale: 1.5L / 2L / 2.5L / 3L
- [x] Cardul selectat evidențiat vizual (accent orange / fundal diferit)
- [x] Save optimistic la tap (fără buton „Salvează" explicit)

### Hook (`useNutritionTarget`)
- [x] `setWaterTarget(ml)` → optimistic update + `UPDATE nutrition_goals.water_target_ml`

### UX / Edge cases
- [x] Valoarea curentă pre-selectată la deschiderea paginii
- [ ] Testare că `WaterTracker` din log-ul zilnic reflectă imediat noua valoare după schimbare

## Progres general
- [x] Secțiunea „Target hidratare" implementată și funcțională
- [ ] Testare sincronizare cu `WaterTracker` din NutritiePage
- [ ] Verificare că log-urile din zilele anterioare nu se modifică (snapshot corect)
