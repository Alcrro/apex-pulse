Scan the ApexPulse codebase for features that are missing documentation, then generate accurate docs based on the existing source code.

## Docs folder structure

```
docs/
  features/     ← one subfolder per feature from src/features/
  structure/    ← project-wide docs: architecture, routing, shared components, DB schema
```

## Step 1 — Find undocumented features

Check which directories exist under `src/features/` and which ones are missing a corresponding `docs/features/<name>/` folder. Only process features that have NO docs yet. If all features are documented, report that and stop.

Also check if `docs/structure/` exists. If not, generate the structure docs too (see Step 4).

## Step 2 — Read the source code for each undocumented feature

For each undocumented feature, read ALL files inside `src/features/<feature>/` — pages, components, hooks, utils. Understand what it actually does before writing anything. Do not guess or invent — extract the truth from the code.

## Step 3 — Create `docs/features/<feature-name>/` with 4 files

---

### File 1: `PRD.md`
Document what the feature DOES as implemented — not aspirational.

```
# PRD — <Feature Name>

## What it does
<!-- 2-3 clear sentences about the feature's purpose -->

## Who uses it and when
<!-- User context and trigger -->

## Implemented functionality
- ✅ 
- ✅ 

## Known limitations / missing
<!-- What it does NOT do compared to a complete product -->

## Main user flow
<!-- Steps the user takes from entry to result -->
```

---

### File 2: `TECH_SPEC.md`
Document the real architecture — extracted from code, not invented.

```
# Tech Spec — <Feature Name>

## Location
`src/features/<feature>/`

## Pages
| File | Route | Description |
|------|-------|-------------|
|      |       |             |

## Components
| Component | Responsibility |
|-----------|---------------|
|           |               |

## Hooks
| Hook | What it does | Supabase tables |
|------|-------------|-----------------|
|      |             |                 |

## Utils / formatters
| Function | Purpose |
|----------|---------|
|          |         |

## State management
<!-- How state is handled: local useState, context, or combined -->

## Dependencies on other features
<!-- What it imports from shared/ or other features -->

## Notable technical decisions
<!-- Non-obvious patterns, workarounds, or specific choices found in the code -->
```

---

### File 3: `DATABASE.md`
Document the Supabase tables used — extracted from hooks and queries.

```
# Database — <Feature Name>

## Tables used
| Table | Operations (SELECT/INSERT/UPDATE/DELETE) | Relevant fields |
|-------|------------------------------------------|-----------------|
|       |                                          |                 |

## Main queries
```sql
-- Extracted or inferred from hooks
```

## RLS assumptions
<!-- What security policies are assumed to exist -->

## Table relationships used in this feature
<!-- Nested selects or JOINs -->
```

---

### File 4: `TODO.md`
Real status of the feature + gaps compared to a complete product.

```
# TODO — <Feature Name>

## Status: 🟢 Implemented / 🟡 Partial / 🔴 Missing

## What's done
- ✅ 
- ✅ 

## Gaps / possible improvements
<!-- What's missing compared to a complete implementation -->
- [ ] 
- [ ] 

## Known bugs or unhandled edge cases
<!-- Missing loading states, absent error handling, etc. found in the code -->
- [ ] 

## Refactoring / tech debt
<!-- Inconsistent patterns, duplicated code, etc. -->
- [ ] 
```

---

## Rules

1. **Never invent** — if it's not in the code, it's not in the docs. Use "Missing" or "Not implemented" for gaps.
2. **Single source of truth** — DB schema lives in DATABASE.md only, not duplicated in TECH_SPEC.
3. **Be specific** — instead of "handles auth", write "allows email/password login via Supabase Auth, with automatic redirect to `/` after login".
4. **Document what's missing** — unimplemented error states, loading states, and empty states are important to note in TODO.md.
5. **SQL queries** — extract or infer them from hooks (`.from('table').select(...)`) and put them in DATABASE.md.

---

---

## Step 4 — Generate `docs/structure/` (if missing)

Read `src/App.tsx`, `src/shared/`, `src/shared/types/index.ts`, `tailwind.config.js`, `package.json` and generate:

### `docs/structure/ARCHITECTURE.md`
```
# Architecture

## Overview
<!-- Stack, paradigme, decizii majore -->

## Folder structure philosophy
<!-- De ce feature-based, ce trăiește în shared/ vs features/ -->

## Data flow
<!-- Cum circulă datele: Supabase → hook → component -->

## Auth flow
<!-- Cum funcționează autentificarea și protejarea rutelor -->

## Key conventions
<!-- Naming, co-location rules, ce merge în shared vs feature -->
```

### `docs/structure/ROUTING.md`
```
# Routing

## All routes
| Path | Component | Protected | Description |
|------|-----------|-----------|-------------|
|      |           |           |             |

## Route protection mechanism
<!-- Cum funcționează PrivateRoute -->

## Navigation
<!-- BottomNav tabs și ce rute acoperă -->
```

### `docs/structure/DATABASE.md`
```
# Database — Full Schema

## Stack
Supabase (PostgreSQL) with RLS enabled on all tables.

## Tables
### <table_name>
| Column | Type | Notes |
|--------|------|-------|
|        |      |       |

<!-- Repeat for each table -->

## RLS policy pattern
<!-- Cum sunt structurate politicile în general -->

## Cascade deletes
<!-- Ce se șterge automat când se șterge userul -->
```

### `docs/structure/SHARED_COMPONENTS.md`
```
# Shared Components

## Atoms (`src/shared/components/atoms/`)
| Component | Props | Usage |
|-----------|-------|-------|
|           |       |       |

## Molecules (`src/shared/components/molecules/`)
| Component | Props | Usage |
|-----------|-------|-------|
|           |       |       |

## Organisms (`src/shared/components/organisms/`)
| Component | Props | Usage |
|-----------|-------|-------|
|           |       |       |

## Design tokens
<!-- Tailwind palette, dark theme conventions, border-radius standards -->
```

---

## Final output

List every folder generated:
```
docs/
  features/
    <feature>/    PRD.md  TECH_SPEC.md  DATABASE.md  TODO.md
    ...
  structure/
    ARCHITECTURE.md
    ROUTING.md
    DATABASE.md
    SHARED_COMPONENTS.md
```

Then show a 1-sentence summary per feature highlighting the most important gap found.
