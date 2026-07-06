# PRD — Nutriție / Aliment

## Overview

Sistem de căutare, detaliere și creare alimente. Acoperă: `FoodSearchModal` (search hibrid USDA + cache + custom), `AlimentDetailPage` (macro + micro + aminoacizi), `CustomAlimentPage` (formular creare aliment personalizat). Fundația pe care se construiesc toate celelalte feature-uri de nutriție.

## Problemă

Nu există o bază de date nutrițională în română. Produsele românești tradiționale (mici, cozonac, telemea) lipsesc din USDA. Utilizatorul trebuie să găsească alimentele rapid, în română sau engleză, și să poată adăuga ce nu găsește.

## Obiective

- [ ] Căutare hibridă: Supabase cache (bilingv RO+EN) → USDA FDC API → fallback graceful
- [ ] ~200 alimente românești tradiționale pre-populate în cache (disponibile offline)
- [ ] Creare aliment custom (câmpuri obligatorii: nume, kcal/100g, P/C/G)
- [ ] Pagina de detalii aliment cu micro-nutrienți și aminoacizi (din USDA)
- [ ] Alimente frecvente și recent adăugate ca shortcut-uri în modal de search
- [ ] Unități flexibile la adăugare: grame, ml, pounds, bucată

## Non-obiective (out of scope)

- Scanare cod de bare (feature separat — vezi `scanare-cod-bare/`)
- Editare alimente din baza publică (USDA/manual_ro)
- Fuzzy matching avansat sau NLP pentru căutare

## User Stories

- Ca utilizator, vreau să caut „piept de pui" în română și să găsesc imediat rezultate, astfel încât să nu trebuiască să scriu în engleză
- Ca utilizator, vreau să văd macro-urile recalculate live când schimb cantitatea, astfel încât să știu exact ce adaug
- Ca utilizator, vreau să văd vitaminele și mineralele unui aliment, astfel încât să am o imagine completă nutrițional
- Ca utilizator, vreau să adaug un aliment românesc care nu există în baza de date, astfel încât să pot loga tot ce mănânc
- Ca utilizator, vreau ca alimentele pe care le adaug frecvent să apară ca shortcut, astfel încât adăugarea să dureze sub 10 secunde

## Criterii de acceptanță

- [ ] Search returnează rezultate în <1s din cache; <3s cu fallback USDA
- [ ] Alimentele românești pre-populate (~200) funcționează fără conexiune la USDA
- [ ] `AlimentDetailPage` afișează macro + micro din tab-uri distincte; câmpurile lipsă marcate cu „—"
- [ ] `CustomAlimentPage`: validare client-side, salvare în `food_cache` cu `data_source = 'custom'`
- [ ] Tab „Frecvente" afișează top 5 pe baza frecvenței reale de utilizare
- [ ] Tab „Recent" afișează ultimele 10 alimente distincte adăugate

## Design / UX Notes

- `FoodSearchModal`: full-screen pe mobile; input autofocused la deschidere
- Tab-uri modal: Căutare | Frecvente | Recent (+ Scanează dacă feature activ)
- La tap pe rezultat: ecran confirmare cu selector cantitate + unitate + preview kcal live
- `AlimentDetailPage`: header cu imagine (fallback `Salad` icon), tab-uri Macro/Micro/Aminoacizi
- `CustomAlimentPage`: formular simplu, câmpuri opționale collapsibile
- „0 rezultate" state: mesaj + buton „Adaugă aliment nou" → `CustomAlimentPage`

## Metrici de succes

- Timp mediu adăugare aliment din search <30 secunde
- Rata „aliment negăsit" <10% din căutări (indică că cache-ul e suficient)
- Rata de creare alimente custom >0% (validează că feature-ul e utilizabil)
