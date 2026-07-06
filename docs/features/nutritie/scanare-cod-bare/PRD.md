# PRD — Scanare Cod de Bare Alimente

## Overview

Adaugă un tab „Scanează" în `FoodSearchModal` care permite utilizatorului să fotografieze codul de bare de pe ambalajul unui produs alimentar și să adauge automat acel produs în jurnal, cu date nutriționale complete preluate din Open Food Facts.

## Problemă

Căutarea text a alimentelor este lentă și imprecisă pentru produse procesate/ambalate (ex: iaurturi, cereale, batoane proteice). Userul trebuie să ghicească cum se numește produsul în baza de date, iar pentru branduri românești rezultatele USDA lipsesc complet. Scanarea codului de bare elimină ambiguitatea și adaugă produsul exact, cu datele de pe ambalaj.

## Obiective

- [ ] Scanare cod EAN-13 / UPC-A / QR direct din browser (fără app nativ)
- [ ] Lookup produs după barcode: mai întâi local (`food_cache`), apoi Open Food Facts API
- [ ] Afișare date nutriționale și confirmare cantitate — același flow ca la căutare text
- [ ] Caching barcode → produs în `food_cache` pentru reutilizare offline
- [ ] Fallback „produs negăsit" cu opțiune de creare manuală

## Non-obiective (out of scope)

- Suport pentru coduri de bare 1D non-standard (ITF, Code 128 industriale)
- Recunoaștere OCR a etichetelor nutriționale
- Bază de date proprie de produse — folosim Open Food Facts
- Funcționalitate offline completă (lookup necesită internet dacă produsul nu e în cache)

## User Stories

- Ca utilizator, vreau să scanez codul de bare de pe un iaurt astfel încât să adaug produsul exact fără să tastez nimic
- Ca utilizator, vreau să văd datele nutriționale înainte de a confirma adăugarea astfel încât să verific că am scanat corect
- Ca utilizator, vreau ca produsele scanate anterior să se încarce instant (din cache) astfel încât să nu aștept la fiecare adăugare
- Ca utilizator, vreau să primesc un mesaj clar când produsul nu este în baza de date astfel încât să știu că pot adăuga manual

## Criterii de acceptanță

- [ ] Camera se deschide în <2 secunde pe iOS Safari și Android Chrome
- [ ] Scanarea reușește în <3 secunde pentru coduri EAN-13 standard, în lumină normală
- [ ] Produsele găsite în Open Food Facts se afișează cu calorii, proteine, carbohidrați, grăsimi per 100g
- [ ] Același produs scanat a 2-a oară se încarcă din cache (fără request la Open Food Facts)
- [ ] Pe dispozitive fără cameră sau cu permisiune refuzată — mesaj de eroare clar, tab-ul rămâne dezactivat
- [ ] Produsul adăugat apare în tab „Recent" și „Frecvente" la fel ca orice alt aliment

## Design / UX Notes

- Tab nou „Scanează" (cu iconiță cameră) ca al 4-lea tab în `FoodSearchModal`, după „Recent"
- La activare: viewport fullscreen cu overlay de vizare (dreptunghi ghid centrat)
- Text sub cadru: „Îndreaptă camera spre codul de bare"
- Dacă `BarcodeDetector` API nu e suportat → tab dezactivat vizual cu tooltip „Necesită Chrome / browser modern"
- La scan reușit: feedback haptic (vibration API) + tranziție animată spre ecranul de confirmare cantitate (același UI ca după selectarea din search)
- La produs negăsit: ilustrație simplă + buton „Adaugă manual" care deschide `CustomAlimentPage`
- Buton „Lanternă" (torch) dacă browser-ul suportă `ImageCapture.setOptions({ torch: true })`

## Metrici de succes

- ≥ 20% din sesiunile de adăugare aliment folosesc tab-ul Scanează după lansare
- Rată de succes scan ≥ 85% (produs identificat din toate încercările de scan)
- Cache hit rate ≥ 50% după prima săptămână (produse repetate)
- Zero crash-uri pe iOS Safari și Android Chrome (cele mai populare browsere în România)
