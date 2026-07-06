# TODO — Setări / Split Macronutrienți

## Frontend

### Logică în `NutritieSetariPage`
- [x] Bară segmentată colorată (albastru P / galben C / portocaliu G) proporțională cu procentele
- [x] 3 rânduri cu butoane `−` / `+` pentru fiecare macro
- [x] Afișare gramaj echivalent live: `Math.round((pct/100) × targetKcal / kcalPerG)`
- [x] Indicator „Total: 100% ✓" verde / „Total: X% ✗" roșu
- [x] Buton „Salvează split-ul" disabled dacă suma ≠ 100%
- [x] Buton `+` dezactivat când adăugarea ar depăși 100%

### Hook (`useNutritionTarget`)
- [x] `updateMacroPct(protein, carbs, fat)` — validează sumă = 100, UPDATE `nutrition_goals`
- [x] La schimbare `goal_type`: resetează macro split la valorile implicite ale obiectivului

### UX / Edge cases
- [x] Ajustare cu ±5% per click (nu ±1%)
- [ ] Test că constraint DB `valid_macro_pct` blochează orice sumă ≠ 100 care ar trece de validarea client

## Progres general
- [x] Secțiunea „Split macronutrienți" implementată și funcțională
- [ ] Testare constraint DB cu sumă invalidă
- [ ] Testare resetare split la schimbare obiectiv
