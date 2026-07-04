# PRD — Nutriție

## Overview

Feature complet de tracking nutrițional integrat în ApexPulse. Utilizatorul poate căuta alimente dintr-o bază de date hibridă (USDA + alimente românești pre-populate + alimente custom), le adaugă pe mese (mic dejun, prânz, cină, gustări) cu unități flexibile (grame, ml, bucată), și vede macro-urile + micro-nutrienții în timp real. Sistemul construiește un profil caloric din datele reale de consum zilnic/săptămânal, iar după ce are suficiente date, îl întreabă pe utilizator ce vrea să facă (menținere, deficit, surplus) și generează un target personalizat. Caloriile arse din antrenamente (calculate pe baza intensității din feature-ul de sesiuni) se scad din balanța zilnică.

## Problemă

Calculele tradiționale TDEE (Harris-Benedict, Mifflin-St Jeor) folosesc greutatea și înălțimea ca proxy pentru metabolism, dar ignoră realitatea biologică a fiecărui utilizator. ApexPulse rezolvă asta altfel: construiește un profil caloric din ce mănâncă utilizatorul efectiv, urmărește ce se întâmplă cu greutatea pe parcurs, și abia după ce are date reale sugerează un target. Utilizatorul descoperă unde se află înainte să i se ceară să se schimbe.

## Obiective

- [ ] Bază de date alimentară hibridă: USDA (macro + micro detaliat) + Open Food Facts (poze + produse ambalate) + ~200 alimente românești tradiționale pre-populate + alimente custom create de utilizator
- [ ] Tracking pe mese structurate pe zi (mic dejun / prânz / cină / gustări) cu unități flexibile: grame, pounds, ml, bucată
- [ ] Tracking apă zilnic (ml)
- [ ] Shortcut-uri pentru alimente frecvente și funcție de copiere mese din zile anterioare
- [ ] Profilul caloric construit progresiv: calculează zilnic și săptămânal din datele reale, fără target impus inițial
- [ ] Flow de onboarding caloric: după acumulare de date, arată utilizatorului unde se află și îl întreabă ce vrea să facă
- [ ] Target caloric personalizat după obiectiv (menținere / deficit ușor / deficit moderat / surplus) cu split macro diferit per obiectiv
- [ ] Integrare calorii arse din antrenamente (citite din feature-ul de sesiuni)
- [ ] Avertizare pentru ambele extreme: sub-consum și surplus față de target
- [ ] Avertizare pentru instabilitatea calculului TDEE (retenție apă, variații hormonale)
- [ ] Soft delete pentru date nutriționale (nu ștergere permanentă)

## Non-obiective (out of scope)

- Scanare cod de bare (v2)
- Rețete proprii sau meal planning automat
- Sincronizare cu wearables / alte apps externe
- Filtrare după dietă specifică (vegan, keto, gluten-free)
- Alergeni

## User Stories

- Ca utilizator, vreau să caut un aliment în română sau engleză și să văd imediat macro-urile + caloriile, astfel încât să pot decide dacă îl includ în masă.
- Ca utilizator, vreau să adaug un aliment românesc tradițional (ex: mici, cozonac) care nu există în baze de date internaționale, astfel încât să pot loga tot ce mănânc.
- Ca utilizator, vreau să adaug alimente cu unitate de măsură relevantă (bucată de ou, ml de lapte, grame de pui), astfel încât să nu fiu nevoit să calculez mereu conversia.
- Ca utilizator, vreau să văd câtă apă am băut azi față de ținta zilnică, astfel încât să rămân hidratat.
- Ca utilizator, vreau ca aplicația să-mi arate mai întâi câte calorii mănânc în medie, fără să-mi impună imediat un target, astfel încât să înțeleg situația mea reală înainte de orice schimbare.
- Ca utilizator, vreau să fiu întrebat ce vrea să fac după ce aplicația a acumulat date suficiente, astfel încât targetul să fie o decizie informată.
- Ca utilizator, vreau să copiez mesele din ziua de ieri sau dintr-o altă zi, astfel încât să nu introduc manual același mic dejun zilnic.
- Ca utilizator, vreau ca alimentele pe care le adaug frecvent să apară ca shortcut, astfel încât logarea să dureze sub 10 secunde.
- Ca utilizator, vreau să văd un avertizare când mănânc cu mult mai puțin sau mai mult decât targetul, astfel încât să fiu conștient de extreme.
- Ca utilizator, vreau ca caloriile arse la antrenamente să fie scăzute din balanța zilnică, astfel încât targetul să reflecte efortul fizic real.
- Ca utilizator, vreau ca datele mele nutriționale să nu fie șterse permanent dacă accidental șterg un entry, astfel încât să le pot recupera.

## Criterii de acceptanță

- [ ] Search aliment returnează rezultate în < 1s (cache local după prima căutare); dacă nu găsește în cache, USDA API cu fallback graceful la eroare
- [ ] Alimentele românești tradiționale (~200) sunt disponibile fără conexiune la USDA (pre-populate în Supabase)
- [ ] Utilizatorul poate crea un aliment custom cu minim: nume, calorii/100g, proteine, carbohidrați, grăsimi
- [ ] Unitățile disponibile la adăugare: grame, pounds (convertite automat la grame), ml, bucată (cu gramaj configurat per aliment)
- [ ] Tracker apă zilnic vizibil pe dashboard nutrițional cu target implicit 2000ml ajustabil
- [ ] Dashboard-ul inițial (fără date) arată consumul real zilnic/săptămânal fără target; nu impune un număr
- [ ] Flow de onboarding caloric se declanșează după ≥ 7 zile de date nutriționale; utilizatorul e întrebat activ ce vrea să facă
- [ ] Alimentele frecvente (top 5 pe baza frecvenței) apar ca shortcut-uri în fiecare ecran de adăugare masă
- [ ] Funcția de copiere mese permite selectarea oricărei zile din ultimele 30 de zile
- [ ] Caloriile arse din sesiunile de antrenament sunt afișate pe dashboard și scăzute din balanța zilnică
- [ ] Warning vizibil (non-blocant) când caloriile consumate sunt < 70% din target sau > 120% din target
- [ ] Warning dedicat pentru TDEE instabil (variație greutate neuniformă)
- [ ] Ștergerea unui entry face soft delete (`deleted_at`), nu șterge fizic din DB
- [ ] Toate textele sunt în română

## Design / UX Notes

**Pagina principală `/nutritie` — faza fără target (primele zile):**
- Header: data curentă + navigator ← →
- Banner informativ neutru: „Până acum mănânci în medie X kcal/zi" (fără judecată, fără target)
- Secțiune macro summary: P/C/G ca bare absolute (grame), nu procente față de target
- Tracker apă: bară simplă cu butoane +250ml și input manual
- 4 carduri mese cu shortcut-uri frecvente vizibile direct

**Pagina principală `/nutritie` — după setarea obiectivului:**
- Inel caloric (calorii consumate / target net după calorii arse)
- Badge-uri macro cu procente față de target
- Inel secundar sau indicator pentru apă
- Warning cards: galben pentru sub-consum, portocaliu pentru surplus
- Secțiunea „Antrenamente azi" cu caloriile arse afișate

**Flow onboarding caloric (modal sau pagină dedicată):**
1. „Iată situația ta din ultimele X zile: mănânci în medie Y kcal/zi. Greutatea ta a [crescut / scăzut / rămas stabilă] cu Z kg."
2. „Ce vrei să faci?" → 4 opțiuni cu descriere clară
3. Confirmare target sugerat + posibilitate de ajustare manuală

**Search / adăugare aliment:**
- Modal full-screen cu input autofocused
- Tab-uri: Căutare | Frecvente | Recent
- La rezultat fără imagine: placeholder `Salad` Lucide
- La confirmare: selector unitate (grame/ml/bucată) + gramaj/cantitate + preview recalculat live
- Dacă aliment negăsit: buton „Adaugă aliment nou" → form custom

**Copiere mese:**
- Button „Copiază din altă zi" pe fiecare MealCard
- Calendar picker cu ultimele 30 zile; zilele cu date marcate vizual
- Dacă ai mâncat același lucru mai multe zile la rând, le grupează: „Aceeași masă în 3 zile — copiezi toate?"

**Edge cases:**
- Aliment fără poză → placeholder generic
- Aliment fără micro → tab-urile Micro/Aminoacizi afișate cu „Date indisponibile"
- Depășire target → warning portocaliu non-blocant, nu eroare
- Sub-consum sever → warning galben cu mesaj empatic, nu punitiv

## Metrici de succes

- Utilizatorii loghează ≥ 3 mese pe zi timp de ≥ 7 zile consecutive
- ≥ 60% dintre utilizatorii cu 7+ zile de date completează flow-ul de onboarding caloric
- Rata de utilizare a shortcut-urilor frecvente ≥ 40% din adăugările totale
- Timp mediu adăugare aliment din shortcut < 10 secunde
- Timp mediu adăugare aliment din search < 30 secunde
