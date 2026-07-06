# PRD — Setări / Target Hidratare Zilnic

## Overview

Secțiunea „Target hidratare zilnic" din `/nutritie/setari`. Utilizatorul alege target-ul de apă zilnic dintre 4 opțiuni predefinite (1.5L / 2L / 2.5L / 3L). Target-ul ales devine referința pentru tracker-ul de apă din log-ul zilnic.

## Problemă

Target-ul implicit de 2L nu e potrivit pentru toți — cineva care face sport intens are nevoie de 3L+, un sedentar de birou poate fi ok cu 1.5L. O selecție rapidă fără introducere manuală reduce fricțiunea.

## Obiective

- [ ] Selector vizual cu 4 opțiuni predefinite (1.5L / 2L / 2.5L / 3L)
- [ ] Opțiunea selectată vizibil evidențiată (accent orange)
- [ ] Salvare automată la selecție (fără buton explicit)

## Non-obiective

- Input manual de valoare arbitrară în ml
- Target diferit per zi a săptămânii
- Reminder/notificări push pentru hidratare

## User Stories

- Ca utilizator, vreau să setez target-ul de apă la 3L pentru că fac sport zilnic, astfel încât tracker-ul să reflecte nevoia mea reală
- Ca utilizator, vreau că schimbarea să fie salvată imediat la tap, astfel încât să nu am un pas suplimentar

## Criterii de acceptanță

- [ ] 4 butoane/carduri cu valorile predefinite
- [ ] Opțiunea curentă evidențiată vizual; celelalte în stare neutră
- [ ] Schimbarea se salvează imediat (optimistic update + persist Supabase)
- [ ] Valoarea selectată apare și în `WaterTracker` din log-ul zilnic în <1s

## Design / UX Notes

- 4 carduri orizontale pe un rând: `1.5L / ml`, `2L / ml`, `2.5L / ml`, `3L / ml`
- Cardul selectat: fundal blue-ish/orange accent, text alb bold
- Cardurile neselectate: `bg-gray-800`, text gri

## Metrici de succes

- Distribuție selecții: cel puțin 3 din 4 opțiuni folosite activ (validează că diversitatea e utilă)
- Zero desincronizări între target setat și cel afișat în `WaterTracker`
