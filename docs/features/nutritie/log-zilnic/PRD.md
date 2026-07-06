# PRD — Nutriție / Log Zilnic

## Overview

Pagina principală `/nutritie` — dashboard zilnic de tracking nutrițional. Utilizatorul vede macro-urile consumate față de target, adaugă alimente pe mese structurate (mic dejun / prânz / cină / gustări), trackează apa și vede caloriile arse din antrenamente. Dashboardul are două faze: faza discovery (fără target — arată medii reale) și faza activă (cu target — arată inelul caloric + warning-uri).

## Problemă

Utilizatorul nu are o metodă rapidă să vadă ce a mâncat azi, cât mai are de mâncat și cum se compară cu obiectivul său. Fără vizibilitate zilnică, comportamentul alimentar nu se schimbă.

## Obiective

- [ ] Dashboard zilnic cu navigator dată ← → și strip săptămânal
- [ ] Faza discovery: card medii reale (fără target impus)
- [ ] Faza activă: inel caloric + bare macro față de target + warning-uri
- [ ] 4 carduri de mese cu adăugare rapidă aliment și shortcut-uri frecvente
- [ ] Tracker apă zilnic cu butoane rapide și input manual
- [ ] Afișare calorii arse din antrenamentele zilei (cu disclaimer estimare)
- [ ] Funcție copiere mese din zile anterioare
- [ ] Warning non-blocant la sub-consum (<70% target) sau surplus (>120%)

## Non-obiective (out of scope)

- Planificare mese viitoare
- Notificări push pentru mese
- Scanare cod de bare (feature separat — vezi `scanare-cod-bare/`)
- Configurare obiective (feature separat — vezi `setari/`)

## User Stories

- Ca utilizator, vreau să văd dintr-o privire cât am mâncat azi față de target, astfel încât să știu dacă mai pot mânca sau am depășit
- Ca utilizator, vreau să adaug un aliment la o masă în sub 10 secunde (din frecvente), astfel încât logarea să nu fie o corvoadă
- Ca utilizator, vreau să navighez la ziua de ieri ca să completez ce am uitat, astfel încât datele să fie complete
- Ca utilizator, vreau să copiez micul dejun din ziua anterioară, astfel încât să nu reintroduc manual același lucru zilnic
- Ca utilizator, vreau să văd câtă apă am băut, astfel încât să rămân hidratat
- Ca utilizator, vreau să văd caloriile arse la antrenament scăzute din balanță, astfel încât targetul să reflecte efortul meu

## Criterii de acceptanță

- [ ] Navigator dată funcțional; butonul → dezactivat dacă azi
- [ ] Strip săptămânal cu zi selectată vizibilă și marcate zilele cu date
- [ ] Faza discovery afișată corect când `goal_type IS NULL`
- [ ] Faza activă cu `CalorieRing` și bare macro când `goal_type` e setat
- [ ] Shortcut-uri frecvente (top 5) vizibile direct în `MealCard` fără scroll
- [ ] Copiere masă funcțională din orice zi din ultimele 30 de zile
- [ ] `WorkoutCaloriesBar` vizibil cu disclaimer „estimare" atunci când există sesiuni în ziua curentă
- [ ] Warning apare și dispare corect față de pragurile 70%/120%
- [ ] Toate textele în română

## Design / UX Notes

- Header compus: data + buton setări (gear icon dreapta) + navigator zi
- `WeekStrip` sub header: 7 zile, click navighează la zi, azi evidențiat cu accent orange
- Faza discovery: `CalorieProfileCard` + bare macro absolute (grame, nu %) + `WaterTracker`
- Faza activă: `CalorieRing` centrat + `MacroProgressBars` + `WaterTracker` + `WorkoutCaloriesBar`
- `MealCard` × 4 (colaps/expand), shortcut-urile frecvente ca chips mici sub titlul mesei
- `CalorieWarning` și `TDEEWarning` (dacă cazul) deasupra cardurilor de mese — dismissible per sesiune
- `MealCopyPicker` se deschide ca bottom sheet sau modal full-screen

## Metrici de succes

- Utilizatorii loghează ≥3 mese/zi timp de ≥7 zile consecutive
- Rata de utilizare shortcut-uri frecvente ≥40% din adăugările totale
- Timp mediu adăugare aliment din shortcut <10 secunde
