# PRD — Setări / Split Macronutrienți

## Overview

Secțiunea „Split macronutrienți" din `/nutritie/setari`. Utilizatorul ajustează procentele de Proteine / Carbohidrați / Grăsimi din totalul caloric zilnic. Procentele se sumează obligatoriu la 100%. Gramajul echivalent se calculează live față de target-ul caloric setat.

## Problemă

Spliturile macro implicite per obiectiv (ex: 30P/40C/30G pentru deficit ușor) nu se potrivesc tuturor. Utilizatorii cu dietă ketogenică, high-protein sau cu restricții medicale au nevoie să ajusteze manual.

## Obiective

- [ ] Afișare split curent ca bare colorate (albastru/galben/portocaliu) și procente
- [ ] Ajustare per macro cu butoane `−` / `+` și validare că suma rămâne 100%
- [ ] Afișare gramaj echivalent live (ex: „35% → 175g Proteine") față de target-ul caloric
- [ ] Indicator vizual „Total: 100% ✓" / „Total: X% ✗" cu culori
- [ ] Buton „Salvează split-ul"

## Non-obiective

- Split macro diferit per masă individuală
- Target macro în grame absolute (doar procente + calcul derivat)
- Preset-uri de split (keto, vegan etc.) — doar valorile implicite per obiectiv

## User Stories

- Ca utilizator, vreau să cresc proteinele la 40% și să văd automat că carbohidrații și grăsimile se ajustează, astfel încât suma să rămână 100%
- Ca utilizator, vreau să văd câte grame de proteine reprezintă 35% din 2000 kcal, astfel încât să înțeleg concret ce înseamnă procentul

## Criterii de acceptanță

- [ ] Bara vizuală P/C/G actualizată live la fiecare ajustare
- [ ] Suma procentelor afișată permanent; roșie dacă ≠ 100%, verde dacă = 100%
- [ ] Buton „Salvează split-ul" disabled dacă suma ≠ 100%
- [ ] Gramaj calculat: `(pct / 100) × target_calories / kcal_per_g` (P=4, C=4, G=9)
- [ ] Valorile implicite restaurate când utilizatorul schimbă obiectivul (dar nu suprascrie override manual)

## Design / UX Notes

- Bară segmentată colorată în top (albastru P / galben C / portocaliu G), proporțională cu procentele
- 3 rânduri: `● Proteine  [−] 35% [+]  175g`
- Text „Total: 100% ✓" verde jos stânga; „2.000 kcal bază" gri jos dreapta
- Butoanele `−`/`+` ajustează cu ±5% la click
- La depășire 100%: butonul `+` dezactivat pentru macro-ul care ar face suma >100%

## Metrici de succes

- Rata de modificare split față de default ≥20% (indică că feature-ul e folosit)
- Zero erori de salvare cu sumă ≠ 100% ajunsă în DB (validare constraint)
