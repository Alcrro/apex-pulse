# Tech Spec — Scanare Cod de Bare Alimente

## Arhitectură generală

Feature-ul se integrează în `src/features/nutritie/` existent. Nu adaugă rute noi — totul se desfășoară în interiorul `FoodSearchModal` existent, adăugând un al 4-lea tab `'scan'`. Datele sunt preluate din Open Food Facts REST API și stocate în tabela Supabase `food_cache` existentă (coloană nouă `barcode`).

```
FoodSearchModal (existent)
  └── Tab 'scan' (nou)
        └── BarcodeScanner component
              ├── useBarcodeScan hook — gestionează camera + BarcodeDetector API
              └── useBarcodeLookup hook — Open Food Facts → food_cache → FoodItem
```

### Fluxul de date

```
[Camera stream] → BarcodeDetector API → barcode string (EAN-13)
     → useBarcodeLookup
           ├── 1. CHECK food_cache WHERE barcode = ? → dacă există, return direct
           └── 2. GET https://world.openfoodfacts.org/api/v2/product/{barcode}.json
                     → parseOffProduct() → FoodItem
                     → INSERT INTO food_cache (cu barcode)
                     → return FoodItem
```

## Rute noi / modificate

| Rută | Tip | Pagină |
|------|-----|--------|
| — | — | Nicio rută nouă — totul în FoodSearchModal |

Modificate:
| Fișier | Modificare |
|--------|-----------|
| `features/nutritie/components/FoodSearchModal.tsx` | Adaugă tab `'scan'` și importă `BarcodeScanner` |

## Componente noi

| Componentă | Locație | Responsabilitate |
|-----------|---------|-----------------|
| `BarcodeScanner` | `features/nutritie/components/` | Afișează camera, detectează barcode, afișează overlay vizare, emite `onDetected(barcode)` |

## Hooks noi

| Hook | Locație | Ce face |
|------|---------|---------|
| `useBarcodeScan` | `features/nutritie/hooks/` | Inițializează `BarcodeDetector`, accesează camera, returnează stream + barcode detectat + stare eroare |
| `useBarcodeLookup` | `features/nutritie/hooks/` | Preia barcode → caută în `food_cache` → fallback Open Food Facts → returnează `FoodItem \| null` |

## Schema DB

vezi DATABASE.md

## Dependențe noi

**Runtime (zero pachete noi):**
- `BarcodeDetector` — Web API nativă, disponibilă în Chrome 83+, Android WebView, Edge. **Niciun pachet npm necesar** pentru platforma principală.
- Fallback pentru Safari/Firefox: `@zxing/browser` (~180kB gzip) — lazy-loaded doar dacă `BarcodeDetector` nu e disponibil

```bash
npm install @zxing/browser
```

**API extern:**
- [Open Food Facts API v2](https://openfoodfacts.github.io/openfoodfacts-server/api/) — gratuit, fără API key, rate limit generos (1000 req/min per IP)
- Base URL: `https://world.openfoodfacts.org/api/v2/product/{barcode}.json`

## Decizii tehnice & trade-offs

**`BarcodeDetector` Web API vs `@zxing/browser` vs alte librării:**
- `BarcodeDetector` e nativă în Chrome/Android (cel mai popular browser pe mobile în România) — zero bundle size, performanță nativă
- `@zxing/browser` ca fallback pentru Safari (iOS) — lazy-loaded, nu penalizează utilizatorii Chrome
- Alternativă respinsă: `quagga2` — mai grea, mai puțin întreținută
- Alternativă respinsă: `html5-qrcode` — 200kB+, wrapper mai puțin performant peste ZXing

**Open Food Facts vs USDA pentru lookup barcode:**
- Open Food Facts are produse europene/românești, inclusiv EAN-13 românesc — USDA nu indexează barcodes românești
- USDA FDC are endpoint barcode (`/foods/search?query=<upc>`) dar acoperire slabă pentru EAN-13 non-american
- Decizie: Open Food Facts primar, fără fallback USDA pentru barcode (datele ar fi oricum lipsă)

**Tab în `FoodSearchModal` vs pagină separată:**
- Tab integrat = zero navigare suplimentară, contextul (mealType) e deja disponibil
- Alternativă respinsă: rută `/nutritie/scan` separată — ar necesita să pasăm `mealType` prin state/params

**`food_cache` extinsă cu `barcode` vs tabelă separată `barcode_cache`:**
- `food_cache` e deja sursă de adevăr pentru alimente externe — adăugăm o coloană indexată
- Evitare JOIN suplimentar, DRY față de logica existentă de caching
- Trade-off: coloanele din `food_cache` devin mai late — acceptabil

**Parsare Open Food Facts → `FoodItem`:**
- Campurile nutriționale din OFF sunt în `nutriments` ca valori per 100g (ex: `energy-kcal_100g`, `proteins_100g`)
- `caloriesPerG` = `energy-kcal_100g / 100` (același format ca USDA care folosește per gram)
- Produsele fără date nutriționale complete → ignorate (`null` returnat → „produs negăsit")

## Riscuri tehnice

- **iOS Safari 17+**: `BarcodeDetector` a fost adăugat experimental în Safari 17 — coverage ~60% din iOS. Sub 17: fallback ZXing, dar performanță mai slabă
- **Permisiune cameră refuzată**: dacă userul refuză o dată, browser-ul blochează re-prompting. Afișăm instrucțiuni pentru a reseta permisiunile din setări
- **Iluminare slabă**: coduri de bare citite greșit în lumină insuficientă → detectăm scan-uri duplicate sau invalide prin validare checksum EAN-13 (built-in în `BarcodeDetector`)
- **Open Food Facts downtime**: API extern, fără SLA garantat. La eroare: toast „Produsul nu a putut fi identificat. Încearcă mai târziu." + opțiune adăugare manuală
- **Produse românești cu date incomplete**: multe produse OFF au `energy-kcal_100g` dar lipsesc macro-uri detaliate → afișăm ce avem, marcăm câmpurile lipsă cu `—`
