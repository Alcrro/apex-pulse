Implementează complet feature-ul documentat în `docs/features/$ARGUMENTS/`.

## Instrucțiuni

1. Citește TOATE cele 4 fișiere din `docs/features/$ARGUMENTS/`:
   - `PRD.md` — obiective și user stories
   - `TECH_SPEC.md` — arhitectură, rute, componente, hooks, decizii tehnice
   - `DATABASE.md` — schema DB, RLS, triggers, indexuri
   - `TODO.md` — lista exactă de task-uri frontend + backend

2. Citește codul existent din `src/features/$ARGUMENTS/` pentru a înțelege ce e deja implementat — **nu rescrie ce există deja**.

3. Citește `src/shared/types/index.ts` — adaugă tipuri noi dacă lipsesc.

4. Implementează TOT ce e marcat cu `[ ]` în `TODO.md`, respectând ordinea:
   a. Tipuri (`shared/types/index.ts`)
   b. Utilitare (`shared/lib/` sau `features/$ARGUMENTS/utils/`)
   c. Hooks (`features/$ARGUMENTS/hooks/`)
   d. Componente (`features/$ARGUMENTS/components/`)
   e. Pagini (`features/$ARGUMENTS/pages/`)
   f. Rute (`src/App.tsx`)
   g. Navigare (`BottomNav.tsx` dacă e specificat)

5. Respectă stilul existent:
   - Tailwind dark theme: `bg-gray-950` / `bg-gray-900` / `bg-gray-800`, accent `orange-500`
   - `rounded-2xl` / `rounded-xl`, `shadow-lg`
   - Toate string-urile UI în română
   - Feature-based structure — fiecare feature e izolat
   - Fără comentarii în cod dacă nu e ceva non-obvious

6. Schema DB din `DATABASE.md`:
   - **Nu executa SQL automat** — generează un fișier `docs/features/$ARGUMENTS/MIGRATION.sql` cu tot SQL-ul necesar (tabele, RLS, triggers, indexuri, seed) gata de copiat în Supabase Dashboard → SQL Editor
   - Dacă tabele există deja parțial, scrie doar ALTER TABLE / coloanele lipsă

7. După implementare, rulează `npm run build` și rezolvă orice erori TypeScript.

8. Actualizează `docs/features/$ARGUMENTS/TODO.md` — marchează cu `[x]` tot ce ai implementat.

## Output final

Afișează:
- Lista fișierelor create / modificate
- Instrucțiuni pentru migrarea DB (ce SQL să ruleze și în ce ordine)
- Ce a rămas neimplementat și de ce (dacă există)
