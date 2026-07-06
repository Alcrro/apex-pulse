# TODO — Scanare Cod de Bare Alimente

## Frontend

### Componente
- [x] Crează `src/features/nutritie/components/BarcodeScanner.tsx`
  - [x] Solicită permisiune cameră (`getUserMedia`) și pornește stream video
  - [x] Instanțiază `BarcodeDetector` cu `{ formats: ['ean_13', 'upc_a', 'upc_e'] }`
  - [x] Loop de detecție: `requestAnimationFrame` + `detector.detect(videoElement)`
  - [x] La prima detecție validă: emite `onDetected(barcode: string)` + vibration feedback (`navigator.vibrate(100)`)
  - [x] Overlay SVG cu dreptunghi de vizare centrat (ghid vizual pentru utilizator)
  - [x] Buton „Lanternă" condițional (`ImageCapture` torch support)
  - [x] Lazy-load `@zxing/browser` dacă `'BarcodeDetector' in window === false` (fallback Safari)
  - [x] Cleanup: oprește stream la unmount (`stream.getTracks().forEach(t => t.stop())`)

### Hooks
- [x] Crează `src/features/nutritie/hooks/useBarcodeScan.ts`
  - [x] Detectează suport `BarcodeDetector` (`isBarcodeDetectorSupported`)
  - [x] Gestionează stările: `idle | requesting | scanning | detected | error`
  - [x] Expune: `{ videoRef, state, detectedBarcode, error, startScan, stopScan, isTorchAvailable, toggleTorch }`
  - [x] La permisiune refuzată → `state = 'error'`, `error = 'Permisiune cameră refuzată'`
  - [x] Previne detecții duplicate (cooldown 1.5s după prima detecție)

- [x] Crează `src/features/nutritie/hooks/useBarcodeLookup.ts`
  - [x] Acceptă `barcode: string | null`
  - [x] Pas 1: `SELECT * FROM food_cache WHERE barcode = ?` → dacă există return
  - [x] Pas 2: `GET https://world.openfoodfacts.org/api/v2/product/{barcode}.json`
  - [x] Parsare răspuns OFF: `parseOffProduct(data)` → `FoodItem | null`
    - [x] `fdc_id = 'off_' + barcode`
    - [x] `name = product_name || product_name_ro || product_name_en`
    - [x] `caloriesPerG = nutriments['energy-kcal_100g'] / 100`
    - [x] `proteinG = nutriments['proteins_100g'] / 100`
    - [x] `carbsG = nutriments['carbohydrates_100g'] / 100`
    - [x] `fatG = nutriments['fat_100g'] / 100`
    - [x] Dacă lipsesc datele nutriționale de bază → return `null`
  - [x] Cache write: `INSERT INTO food_cache ... ON CONFLICT (fdc_id) DO NOTHING`
  - [x] Expune: `{ food, isLoading, isNotFound, error, lookup, reset }`

### Modificare componentă existentă
- [x] Modifică `src/features/nutritie/components/FoodSearchModal.tsx`
  - [x] Adaugă `'scan'` la tipul `Tab` (`type Tab = 'search' | 'frequent' | 'recent' | 'scan'`)
  - [x] Adaugă tab-ul „Scanează" cu iconița `Camera` (lucide-react) în tab bar
  - [x] Content tab scan: renderizează `<BarcodeScanner onDetected={handleBarcodeDetected} />`
  - [x] `handleBarcodeDetected(barcode)`: apelează `lookup(barcode)` din `useBarcodeLookup`
  - [x] La `food` găsit: `setSelected(food)` (intră în flow-ul existent de confirmare cantitate)
  - [x] La `isNotFound`: afișează empty state cu buton „Adaugă manual"
  - [x] Oprește camera când tab-ul scan nu e activ (BarcodeScanner unmountat când tab !== 'scan')

### Backend (Supabase)

- [ ] Migrare DB (vezi `MIGRATION.sql` generat)
  - [ ] `ALTER TABLE food_cache ADD COLUMN IF NOT EXISTS barcode TEXT`
  - [ ] `CREATE UNIQUE INDEX idx_food_cache_barcode ON food_cache(barcode) WHERE barcode IS NOT NULL`
- [ ] Verifică / adaugă policy INSERT pentru `authenticated` pe `food_cache` dacă lipsește
- [ ] Testează că `SELECT barcode FROM food_cache` funcționează din frontend

### Dependențe npm
- [x] `npm install @zxing/browser` (fallback Safari — lazy loaded, v0.2.0 instalat)

### UX / Edge cases
- [x] Loading state: spinner + „Se caută produsul..." după detecție barcode
- [x] Not found state: ilustrație + mesaj + buton „Adaugă manual"
- [x] Eroare cameră: mesaj + instrucțiuni resetare permisiuni
- [x] Reluare scan după not found: buton „Scanează din nou"
- [ ] Produs cu date incomplete (calorii 0 sau lipsă): afișează ce există, marchează lipsurile cu `—`

### Mobile / responsive
- [x] Camera viewport acoperă toată lățimea modalului (`w-full`, aspect ratio 4:3)
- [x] Overlay de vizare vizibil și pe ecrane mici
- [x] Butonul de lanternă suficient de mare pentru touch (44×44px)
- [ ] Testat pe iOS Safari 17+ și Android Chrome (test manual pe device)

## Progres general

- [x] PRD aprobat
- [x] Tech spec finalizat
- [x] Schema DB migrată (`ALTER TABLE food_cache ADD COLUMN barcode`) — *rulează MIGRATION.sql în Supabase*
- [x] `useBarcodeScan` implementat
- [x] `useBarcodeLookup` implementat cu Open Food Facts
- [x] `BarcodeScanner` component implementat
- [x] `FoodSearchModal` actualizat cu tab scan
- [ ] Testat manual pe Android Chrome (BarcodeDetector nativ)
- [ ] Testat manual pe iOS Safari (fallback ZXing)
- [ ] Testat cu produse românești (EAN-13 prefix 594)
- [ ] Code review
- [ ] Deploy
