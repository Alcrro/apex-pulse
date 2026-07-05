# Shared Components

All shared components live in `src/shared/components/` and follow an atoms → molecules → organisms hierarchy.

---

## Atoms

### `Button` (`src/shared/components/atoms/Button.tsx`)
A styled `<button>` element.

**Props:**
- `variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success'` (default: `'primary'`)
- `size?: 'sm' | 'md' | 'lg' | 'icon'` (default: `'md'`)
- All standard `ButtonHTMLAttributes<HTMLButtonElement>` props (e.g. `onClick`, `disabled`, `type`)

**Variants:**
| Variant | Style |
|---------|-------|
| `primary` | `bg-orange-500`, white text, orange shadow |
| `secondary` | `bg-gray-800`, light text, gray border |
| `ghost` | Transparent, `text-gray-300`, hover `bg-gray-800` |
| `danger` | `bg-red-600`, white text |
| `success` | `bg-green-600`, white text |

**Sizes:**
| Size | Padding | Font |
|------|---------|------|
| `sm` | `px-3 py-1.5` | `text-sm` |
| `md` | `px-4 py-2.5` | `text-sm` |
| `lg` | `px-6 py-3` | `text-base` |
| `icon` | `p-2` | — |

All variants apply `disabled:opacity-50 disabled:cursor-not-allowed`.

---

### `Card` (`src/shared/components/atoms/Card.tsx`)
A `<div>` container styled as a dark card.

**Props:**
- `children: ReactNode`
- `className?: string` — appended to the base classes
- `onClick?: () => void` — if provided, adds `cursor-pointer` and `hover:border-gray-700`

**Base style:** `bg-gray-900 border border-gray-800 rounded-2xl`

---

### `Input` (`src/shared/components/atoms/Input.tsx`)
A labeled text input with optional error display.

**Props:**
- `label?: string` — renders a `<label>` above the input
- `error?: string` — renders a red error message below the input and adds `border-red-500` to the input
- All standard `InputHTMLAttributes<HTMLInputElement>` props

**Base style:** `bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-orange-500`

---

## Molecules

### `Modal` (`src/shared/components/molecules/Modal.tsx`)
A dialog overlay with title bar, scrollable content area, and close button.

**Props:**
- `open: boolean` — controls visibility (`return null` when false)
- `onClose: () => void` — called when backdrop or X button is clicked
- `title: string` — displayed in the modal header
- `children: ReactNode` — modal body content
- `size?: 'sm' | 'md' | 'lg' | 'xl'` (default: `'md'`) — maps to `max-w-sm | max-w-lg | max-w-2xl | max-w-4xl`

**Behaviour:**
- Sets `document.body.style.overflow = 'hidden'` while open to prevent background scroll
- On mobile, aligns to the bottom of the screen (`items-end`); on `sm:` breakpoint and above, centers vertically (`sm:items-center`)
- Backdrop click closes the modal; inner panel click stops propagation
- Content area is scrollable (`overflow-y-auto flex-1`)

---

## Organisms

### `Layout` (`src/shared/components/organisms/layout/Layout.tsx`)
The master page shell for all standard routes. Composed of `Header` + `<Outlet>` + `BottomNav`.

Structure:
```
div.min-h-screen.bg-gray-950.flex.flex-col
  Header
  main.flex-1.max-w-2xl.w-full.mx-auto.px-4.pb-24.pt-4
    <Outlet />       ← page content
  BottomNav
```

- `max-w-2xl` constrains content width and centers it on larger screens
- `pb-24` prevents bottom navigation from overlapping page content

---

### `Header` (`src/shared/components/organisms/layout/Header.tsx`)
Sticky top bar showing the "AP" logo (ApexPulse) and the current page title.

- Uses `useLocation()` to look up the title from `PAGE_TITLES` record
- `PAGE_TITLES` maps: `/` → `'Dashboard'`, `/antrenamente` → `'Antrenamente'`, `/progres` → `'Progres'`, `/profil` → `'Profil'`, `/nutritie` → `'Nutriție'`
- Falls back to the app name for paths not in the map (e.g. `/antrenamente/:id`, `/antrenamente/setari`)
- Height: `h-14`; style: `bg-gray-950/90 backdrop-blur-md border-b border-gray-800/50 sticky top-0 z-40`

---

### `BottomNav` (`src/shared/components/organisms/layout/BottomNav.tsx`)
Fixed bottom navigation with 5 tabs using React Router `NavLink`.

| Tab | To | Label | Icon |
|-----|----|-------|------|
| Home | `/` | Home | `Home` |
| Planuri | `/antrenamente` | Planuri | `Dumbbell` |
| Nutriție | `/nutritie` | Nutriție | `Utensils` |
| Progres | `/progres` | Progres | `TrendingUp` |
| Profil | `/profil` | Profil | `User` |

Note: The "Istoric" tab was replaced by the "Nutriție" tab. The `/istoric` route now redirects to `/progres`.

- Active tab: `text-orange-500`; inactive: `text-gray-500 hover:text-gray-300`
- The Home link uses `end` prop so `/antrenamente` doesn't also activate the Home tab
- Style: `fixed bottom-0 left-0 right-0 z-40 bg-gray-950/95 backdrop-blur-md border-t border-gray-800/50`

---

---

## Shared Hooks

### `useInstallPWA` (`src/shared/hooks/useInstallPWA.ts`)
Handles PWA install prompt detection for both Android/desktop (standard `beforeinstallprompt` API) and iOS (manual instructions via Share sheet).

**Returns:**
- `canInstall: boolean` — true when `beforeinstallprompt` was captured and not yet dismissed (non-iOS)
- `isIOS: boolean` — true when user agent matches iPhone/iPad/iPod and the app is not already running as a standalone PWA
- `install: () => Promise<void>` — calls `prompt()` on the captured event; sets `canInstall = false` after

**Usage in `DashboardPage`:**
- `canInstall` → shows an "Instalează aplicația" button with `onClick={install}`
- `isIOS` → shows a static banner with Share → Add to Home Screen instructions

---

## Design tokens

### Tailwind theme extensions (`tailwind.config.js`)

**Orange accent (custom overrides):**
| Token | Hex |
|-------|-----|
| `orange-400` | `#fb923c` |
| `orange-500` | `#f97316` |
| `orange-600` | `#ea580c` |

**Forge palette (used in dashboard/session components):**
| Token | Hex | Usage |
|-------|-----|-------|
| `forge-base` | `#111111` | — |
| `forge-surface` | `#1D1D1D` | Card backgrounds |
| `forge-surface2` | `#272727` | — |
| `forge-gold` | `#D4B96A` | Accent color for stats, dots |
| `forge-text` | `#F0EFEC` | Primary text |
| `forge-muted` | `#616161` | Secondary/muted text |

### Conventions
- Base background: `bg-gray-950` (`#030712`)
- Card background: `bg-gray-900` (`#111827`)
- Border: `border-gray-800` (`#1f2937`)
- Primary accent: `orange-500` (`#f97316`)
- Border radius: `rounded-2xl` (cards/modals), `rounded-xl` (inputs/buttons)
- Dark mode: configured as `media` (system preference) in Tailwind, but all components use dark styles unconditionally
