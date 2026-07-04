Creează documentația completă pentru o nouă feature în proiectul ApexPulse.

Numele featurii: $ARGUMENTS

## Instrucțiuni

1. Transformă numele featurii în slug kebab-case (ex: "Active Session Timer" → `active-session-timer`)
2. Creează folderul `docs/features/<slug>/`
3. Creează TOATE fișierele de mai jos cu conținut relevant și specific featurii cerute — nu lăsa secțiuni goale, completează tot ce poți deduce logic
4. Fiecare informație trăiește într-un SINGUR fișier. Dacă un fișier are nevoie de o informație care aparține altui fișier (ex: schema DB), pune doar o referință (`vezi DATABASE.md`), nu duplica conținutul.

---

### Fișierul 1: `PRD.md`

```
# PRD — <Nume Feature>

## Overview
<!-- Ce face această feature și de ce există -->

## Problemă
<!-- Ce problemă rezolvă pentru utilizator -->

## Obiective
- [ ]
- [ ]

## Non-obiective (out of scope)
-

## User Stories
- Ca utilizator, vreau să... astfel încât să...
- Ca utilizator, vreau să... astfel încât să...

## Criterii de acceptanță
- [ ]
- [ ]

## Design / UX Notes
<!-- Comportament vizual, flow, edge cases de UI -->

## Metrici de succes
<!-- Cum știm că feature-ul e un succes -->
```

---

### Fișierul 2: `TECH_SPEC.md`

```
# Tech Spec — <Nume Feature>

## Arhitectură generală
<!-- Cum se încadrează în arhitectura feature-based din src/features/ -->

## Rute noi / modificate
| Rută | Tip | Pagină |
|------|-----|--------|
|      |     |        |

## Componente noi
| Componentă | Locație | Responsabilitate |
|-----------|---------|-----------------|
|           |         |                 |

## Hooks noi
| Hook | Locație | Ce face |
|------|---------|---------|
|      |         |         |

## Schema DB
<!-- NU repeta schema aici. Referință: vezi DATABASE.md -->

## Dependențe noi
<!-- Pachete npm necesare, dacă există -->

## Decizii tehnice & trade-offs
<!-- De ce am ales abordarea X față de Y -->

## Riscuri tehnice
<!-- Ce ar putea să nu meargă, ce e incert -->
```

---

### Fișierul 3: `DATABASE.md`

```
# Database — <Nume Feature>

## Tabele noi / coloane adăugate
```sql
-- Schema completă aici, singura sursă de adevăr pentru DB
```

## RLS Policies
```sql
-- SELECT / INSERT / UPDATE / DELETE
```

## Funcții / Triggers (dacă e necesar)
-

## Indexuri pentru performanță
-

## Date inițiale / seed
-

## Decizii de schemă & alternative respinse
<!-- De ce structura X și nu Y — important pentru context viitor -->

## Testare manuală
- [ ] Verifică RLS cu user diferit
- [ ] Verifică cascade delete
- [ ]
```

---

### Fișierul 4: `TODO.md`

```
# TODO — <Nume Feature>

## Frontend

### Pagini
- [ ] Crează `src/features/<slug>/pages/`
  - [ ]

### Componente
- [ ] Crează `src/features/<slug>/components/` (flat, fără atomic design — subfolder per componentă doar dacă are sub-componente proprii)
  - [ ]

### Hooks
- [ ] Crează `src/features/<slug>/hooks/`
  - [ ]

### Routing
- [ ] Adaugă ruta în `src/App.tsx`
  - Path:
  - Element:

### Navigare
- [ ] Actualizează `BottomNav` dacă e necesar

### Shared components
- [ ] Verifică dacă sunt necesare componente noi în `src/shared/components/`

### State & date
- [ ]

### UX / Edge cases
- [ ] Loading states
- [ ] Empty states
- [ ] Error states
- [ ]

### Mobile / responsive
- [ ]

## Backend (Supabase)

- [ ] Migrări DB (vezi DATABASE.md pentru schema exactă)
- [ ] RLS policies aplicate (vezi DATABASE.md)
- [ ] Funcții / triggers dacă e cazul
- [ ] Seed date inițiale

## Progres general
- [ ] PRD aprobat
- [ ] Tech spec finalizat
- [ ] Schema DB migrată
- [ ] RLS policies configurate
- [ ] Frontend implementat
- [ ] Testat manual pe mobile
- [ ] Code review
- [ ] Deploy
```

---

La final, afișează structura folderelor create și un scurt rezumat al ce ai completat automat în fiecare fișier.
