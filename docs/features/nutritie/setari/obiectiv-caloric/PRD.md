# PRD — Setări / Obiectiv Caloric

## Overview

Secțiunea „Obiectiv caloric" din `/nutritie/setari`. Permite utilizatorului să aleagă un obiectiv (menținere / deficit ușor / deficit moderat / surplus) pe baza TDEE-ului estimat din consumul real, sau să introducă manual un număr de calorii. La salvare, target-ul devine baza pentru inelul caloric din log-ul zilnic.

## Problemă

Fără un target caloric, utilizatorul nu știe față de ce să se raporteze. Dar un target impus din formula antropometrică (Harris-Benedict etc.) e adesea greșit. Soluția: calculăm TDEE din ce mănâncă efectiv utilizatorul și abia după îi propunem un număr.

## Obiective

- [ ] Afișare TDEE estimat din mediile reale de consum (ultimele 14 zile)
- [ ] `GoalSelector` cu 4 opțiuni, fiecare cu offset kcal clar vizibil
- [ ] Toggle „Calorii manuale" pentru override cu input numeric
- [ ] Buton „Salvează obiectivul" cu feedback vizual

## Non-obiective

- Calcul TDEE pe baza formulelor antropometrice (înălțime/greutate)
- Mai mult de 4 opțiuni de obiectiv la lansare
- Obiectiv caloric diferit per zi a săptămânii

## User Stories

- Ca utilizator, vreau să văd câte calorii mănânc în medie înainte să aleg un obiectiv, astfel încât decizia să fie informată
- Ca utilizator, vreau să aleg „Deficit ușor" și să văd imediat ce target îmi propune aplicația, astfel încât să confirm că e rezonabil
- Ca utilizator avansat, vreau să introduc manual un număr de calorii, astfel încât să nu fiu limitat de calculul automat

## Criterii de acceptanță

- [ ] TDEE afișat ca „Media caloriilor din ultimele 14 zile" cu numărul exact
- [ ] La selecție obiectiv: target calculat afișat în timp real (TDEE ± offset)
- [ ] Toggle manual: ascunde `GoalSelector`, afișează input numeric
- [ ] Buton „Salvează obiectivul" activ doar dacă s-a schimbat ceva
- [ ] După salvare: badge „Salvat ✓" animat 2s

## Design / UX Notes

- `GoalSelector`: 4 carduri verticale, fiecare cu titlu + descriere scurtă + offset kcal (dreapta) + badge macro P/C/G (stânga jos)
- Cardul selectat: border orange + fundal ușor mai deschis
- „Calorii manuale": toggle switch + input numeric cu sufix „kcal / zi"
- TDEE estimat: text gri deschis sub titlul secțiunii, cu numărul bold

## Metrici de succes

- ≥60% din utilizatorii cu 7+ zile de date completează alegerea obiectivului
- Rata override manual ≤15%
