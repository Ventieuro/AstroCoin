# Proxima Centauri — Prompt di Inizializzazione Progetto

> Copia questo file come **primo messaggio** in una nuova sessione Copilot/Claude
> quando la repo `proxima-centauri` è appena stata creata e vuota.
> Contiene tutto il necessario: stack, stile, temi, tipi, pattern di codice.

---

## Identità App

- **Nome**: Proxima Centauri
- **Scopo**: Lista della spesa intelligente — companion app di **Andromeda**
- **Andromeda** è un'app di gestione finanze personali che salva in localStorage
  i prodotti scansionati da scontrini OCR. Proxima Centauri li legge (READ-ONLY)
  per suggerire nomi prodotto in autocomplete.
- Chiave localStorage da leggere: `andromeda-products` (array di `ProductEntry`, definito sotto)

---

## Stack Tecnologico

```
React 19 + TypeScript 5.7 (strict mode)
Vite 6
@vitejs/plugin-react
@tailwindcss/vite  →  Tailwind CSS 4
vite-plugin-qrcode
vite-plugin-pwa    →  PWA installabile su telefono
React Router DOM 7
lucide-react       →  icone
localStorage       →  persistenza (niente backend)
vitest + @testing-library/react  →  test
```

`package.json` di riferimento:
```json
{
  "name": "proxima-centauri",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "test": "vitest run",
    "deploy": "npm run build && gh-pages -d dist"
  },
  "dependencies": {
    "lucide-react": "^1.14.0",
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "react-router-dom": "^7.14.1"
  },
  "devDependencies": {
    "@eslint/js": "^9.22.0",
    "@tailwindcss/vite": "^4.2.2",
    "@testing-library/jest-dom": "^6.9.1",
    "@testing-library/react": "^16.3.2",
    "@types/react": "^19.1.0",
    "@types/react-dom": "^19.1.0",
    "@vitejs/plugin-react": "^4.4.1",
    "eslint": "^9.22.0",
    "eslint-plugin-react-hooks": "^5.2.0",
    "eslint-plugin-react-refresh": "^0.4.19",
    "gh-pages": "^6.3.0",
    "globals": "^16.0.0",
    "jsdom": "^29.0.2",
    "tailwindcss": "^4.2.2",
    "typescript": "~5.7.0",
    "typescript-eslint": "^8.26.0",
    "vite": "^6.3.0",
    "vite-plugin-pwa": "^1.2.0",
    "vite-plugin-qrcode": "^0.4.1",
    "vitest": "^4.1.4"
  }
}
```

---

## Struttura Cartelle

```
src/
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── FAB.tsx
│   │   ├── IconButton.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── SectionHeader.tsx
│   │   ├── AutocompleteInput.tsx   ← nuovo: input + dropdown suggerimenti
│   │   ├── RepartoSelect.tsx       ← nuovo: select con lista fissa reparti
│   │   └── index.ts
│   ├── Layout.tsx
│   ├── BottomNav.tsx
│   └── ThemeSwitcher.tsx
├── pages/
│   ├── Home.tsx           → lista di tutte le ShoppingList
│   ├── ShoppingList.tsx   → lista attiva raggruppata per reparto
│   ├── Settings.tsx
│   └── NotFound.tsx
├── shared/
│   ├── labels.ts          → tutte le stringhe (IT/EN/ES)
│   ├── types.ts           → interfacce TypeScript + REPARTI_SUPERMERCATO
│   ├── storage.ts         → CRUD localStorage
│   ├── andromedaImport.ts → legge andromeda-products read-only
│   └── ThemeContext.tsx   → provider + hook useTheme()
├── index.css              → CSS variables temi + @import tailwindcss
├── main.tsx               → entry point + provider stack
└── App.tsx                → Routes
```

---

## Modello Dati (`src/shared/types.ts`)

```ts
// ─── Reparti supermercato (lista fissa, condivisa con Andromeda) ─────────────
export const REPARTI_SUPERMERCATO = [
  { id: 'ortofrutta',  emoji: '🥦', label: 'Ortofrutta' },
  { id: 'pane',        emoji: '🍞', label: 'Pane & Pasticceria' },
  { id: 'salumi',      emoji: '🥓', label: 'Salumi & Gastronomia' },
  { id: 'carne',       emoji: '🥩', label: 'Carne' },
  { id: 'pesce',       emoji: '🐟', label: 'Pesce' },
  { id: 'latticini',   emoji: '🧀', label: 'Latticini & Uova' },
  { id: 'surgelati',   emoji: '🧊', label: 'Surgelati' },
  { id: 'dispensa',    emoji: '🫙', label: 'Dispensa' },
  { id: 'dolci',       emoji: '🍬', label: 'Dolci & Snack' },
  { id: 'colazione',   emoji: '☕', label: 'Caffè & Colazione' },
  { id: 'bevande',     emoji: '🥤', label: 'Bevande' },
  { id: 'vini',        emoji: '🍷', label: 'Vini & Alcolici' },
  { id: 'igiene',      emoji: '🧴', label: 'Igiene Personale' },
  { id: 'pulizia',     emoji: '🧹', label: 'Pulizia Casa' },
  { id: 'bambini',     emoji: '👶', label: 'Bambini' },
  { id: 'animali',     emoji: '🐾', label: 'Animali' },
  { id: 'farmacia',    emoji: '💊', label: 'Farmacia' },
  { id: 'bio',         emoji: '🌿', label: 'Bio & Naturale' },
] as const

export type RepartoId = typeof REPARTI_SUPERMERCATO[number]['id']

// ─── ProductEntry (shape read-only da Andromeda) ─────────────────────────────
export interface ProductPriceEntry {
  price: number
  date: string // ISO yyyy-mm-dd
}

export interface ProductEntry {
  id: string
  name: string
  aliases: string[]
  priceHistory: ProductPriceEntry[]
  category?: string
  reparto?: RepartoId
  lastSeen: string
}

// ─── Shopping list ────────────────────────────────────────────────────────────
export interface ShoppingItem {
  id: string
  name: string
  quantity: number
  unit: 'pz' | 'kg' | 'g' | 'l' | 'conf' | 'busta'
  repartoId: RepartoId | ''
  checked: boolean
  estimatedPrice?: number
  note?: string
}

export interface ShoppingList {
  id: string
  name: string
  store?: string
  createdAt: string  // ISO timestamp
  updatedAt: string
  items: ShoppingItem[]
  archived: boolean
}

// ─── Prodotto "noto" (da Andromeda + creati localmente) ──────────────────────
export interface KnownProduct {
  id: string
  name: string
  aliases: string[]
  repartoId?: RepartoId
  lastPrice?: number
  source: 'andromeda' | 'local'
}

// ─── Impostazioni app ─────────────────────────────────────────────────────────
export interface ProximaSettings {
  userName: string
  defaultStore?: string
}
```

---

## localStorage Keys

| Chiave | Contenuto |
|--------|-----------|
| `proxima-lists` | `ShoppingList[]` |
| `proxima-known-products` | `KnownProduct[]` |
| `proxima-settings` | `ProximaSettings` |
| `proxima-theme` | `string` nome tema |
| `proxima-lang` | `'it' \| 'en' \| 'es'` |
| `andromeda-products` | **READ-ONLY** — `ProductEntry[]` da Andromeda |

---

## Integrazione con Andromeda (`src/shared/andromedaImport.ts`)

```ts
import type { KnownProduct, ProductEntry, RepartoId } from './types'

export function importFromAndromeda(): KnownProduct[] {
  try {
    const raw = localStorage.getItem('andromeda-products')
    if (!raw) return []
    const entries: ProductEntry[] = JSON.parse(raw)
    return entries.map(e => ({
      id: `andromeda-${e.id}`,
      name: e.name,
      aliases: e.aliases ?? [],
      repartoId: e.reparto as RepartoId | undefined,
      lastPrice: e.priceHistory?.at(-1)?.price,
      source: 'andromeda' as const,
    }))
  } catch {
    return []
  }
}

// Merge: priorità ai prodotti locali, quelli da Andromeda non sovrascrivi
export function mergeKnownProducts(
  local: KnownProduct[],
  fromAndromeda: KnownProduct[]
): KnownProduct[] {
  const localIds = new Set(local.map(p => p.id))
  // Per quelli già presenti come 'local' aggiorna lastPrice se Andromeda ha dati
  return [
    ...local,
    ...fromAndromeda.filter(p => !localIds.has(p.id)),
  ]
}

// Fuzzy autocomplete su name + aliases
export function suggestProducts(query: string, known: KnownProduct[]): KnownProduct[] {
  const q = query.toLowerCase().trim()
  if (q.length < 2) return []
  return known
    .filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.aliases.some(a => a.toLowerCase().includes(q))
    )
    .slice(0, 8)
}
```

---

## Sistema Temi — `src/index.css`

```css
@import "tailwindcss";

/* Samsung Browser oklch fallback */
:root {
  --color-red-500: #ef4444;
  --color-red-600: #dc2626;
  --color-green-400: #4ade80;
  --color-green-600: #16a34a;
  --color-amber-400: #fbbf24;
  --color-amber-500: #f59e0b;
  --color-blue-400: #60a5fa;
}

html {
  color-scheme: only dark;
  forced-color-adjust: none;
  -webkit-forced-color-adjust: none;
  background-color: #0e0814;
}

/* ── Default / Nebula ── */
:root,
[data-theme="nebula"] {
  --bg-primary:    #0e0814;
  --bg-secondary:  #160d24;
  --bg-card:       #1f1238;
  --text-primary:  #fff5e4;
  --text-secondary:#b8a8d0;
  --text-muted:    #6b5a8a;
  --border:        #3b2a4a;
  --accent:        #6ba3d6;
  --accent-hover:  #4a87c5;
  --accent-light:  #1a2a3d;
  --nav-bg:        #080512;
  --nav-text:      #fff5e4;
  --input-bg:      #160d24;
  --input-border:  #3b2a4a;
  --fab-bg:        #6ba3d6;
  --fab-text:      #0e0814;
  --highlight:     #c4507a;
  --gold:          #ffd580;
}

[data-theme="mission"] {
  --bg-primary:    #0d1323;
  --bg-secondary:  #111827;
  --bg-card:       #141c2e;
  --text-primary:  #e2e8f0;
  --text-secondary:#94a3b8;
  --text-muted:    #4a5568;
  --border:        rgba(255,255,255,0.10);
  --accent:        #ff9800;
  --accent-hover:  #f57c00;
  --accent-light:  rgba(255,152,0,0.14);
  --nav-bg:        rgba(10,14,26,0.92);
  --nav-text:      #e2e8f0;
  --input-bg:      rgba(255,255,255,0.06);
  --input-border:  rgba(255,255,255,0.13);
  --fab-bg:        #ff9800;
  --fab-text:      #0d1323;
  --highlight:     #00bcd4;
  --gold:          #ffd740;
}

[data-theme="aurora"] {
  --bg-primary:    #080c1a;
  --bg-secondary:  #0d1228;
  --bg-card:       #101630;
  --text-primary:  #e0f0ff;
  --text-secondary:#7eb8d4;
  --text-muted:    #4a6a80;
  --border:        rgba(100,200,255,0.12);
  --accent:        #00e5b0;
  --accent-hover:  #00c99a;
  --accent-light:  rgba(0,229,176,0.12);
  --nav-bg:        rgba(5,8,20,0.94);
  --nav-text:      #e0f0ff;
  --input-bg:      rgba(100,150,255,0.06);
  --input-border:  rgba(100,150,255,0.20);
  --fab-bg:        #00e5b0;
  --fab-text:      #080c1a;
  --highlight:     #00e5b0;
  --gold:          #ffd740;
}

[data-theme="luna"] {
  --bg-primary:    #F5F4F0;
  --bg-secondary:  #e4e7f4;
  --bg-card:       #f8f9fe;
  --text-primary:  #0e1233;
  --text-secondary:#3a4172;
  --text-muted:    #7c84aa;
  --border:        #d2d6ed;
  --accent:        #7c85c8;
  --accent-hover:  #636cb5;
  --accent-light:  rgba(124,133,200,0.12);
  --nav-bg:        #0e1233;
  --nav-text:      #eef0f8;
  --input-bg:      #f8f9fe;
  --input-border:  #c8ccdf;
  --fab-bg:        #0e1233;
  --fab-text:      #eef0f8;
  --highlight:     #7c85c8;
  --gold:          #b8a060;
}

[data-theme="nasa"] {
  --bg-primary:    #f4f6fc;
  --bg-secondary:  #e8ecf7;
  --bg-card:       #ffffff;
  --text-primary:  #080d1f;
  --text-secondary:#1e305a;
  --text-muted:    #5a6888;
  --border:        #c8d0e8;
  --accent:        #FC3D21;
  --accent-hover:  #d93010;
  --accent-light:  rgba(252,61,33,0.08);
  --nav-bg:        #080d1f;
  --nav-text:      #ffffff;
  --input-bg:      #ffffff;
  --input-border:  #b8c2de;
  --fab-bg:        #FC3D21;
  --fab-text:      #ffffff;
  --highlight:     #FC3D21;
  --gold:          #e87c20;
}

[data-theme="supernova"] {
  --bg-primary:    #070707;
  --bg-secondary:  #111111;
  --bg-card:       #161616;
  --text-primary:  #f5f5f5;
  --text-secondary:#d1d1d1;
  --text-muted:    #8a8a8a;
  --border:        #2b2b2b;
  --accent:        #c91010;
  --accent-hover:  #a80d0d;
  --accent-light:  rgba(201,16,16,0.16);
  --nav-bg:        #050505;
  --nav-text:      #f5f5f5;
  --input-bg:      #111111;
  --input-border:  #353535;
  --fab-bg:        #c91010;
  --fab-text:      #0a0a0a;
  --highlight:     #ff7d7d;
  --gold:          #ffb347;
}

body {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  transition: background-color 0.2s, color 0.2s;
}
```

**Variabili disponibili per ogni tema:**
| Variabile | Uso |
|-----------|-----|
| `--bg-primary`, `--bg-secondary`, `--bg-card` | Sfondi |
| `--text-primary`, `--text-secondary`, `--text-muted` | Testi |
| `--border` | Bordi |
| `--accent`, `--accent-hover`, `--accent-light` | Elementi interattivi |
| `--nav-bg`, `--nav-text` | Header/bottom nav |
| `--input-bg`, `--input-border` | Campi form |
| `--fab-bg`, `--fab-text` | Floating Action Button |
| `--highlight`, `--gold` | Accenti semantici |

---

## ThemeContext (`src/shared/ThemeContext.tsx`)

```tsx
import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'

export type Theme = 'nebula' | 'nasa' | 'mission' | 'aurora' | 'luna' | 'supernova'
const ALL_THEMES: Theme[] = ['nebula', 'nasa', 'mission', 'aurora', 'luna', 'supernova']
const THEME_KEY = 'proxima-theme'

interface ThemeContextValue { theme: Theme; setTheme: (t: Theme) => void }
const ThemeContext = createContext<ThemeContextValue>({ theme: 'mission', setTheme: () => {} })

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const saved = localStorage.getItem(THEME_KEY)
      return ALL_THEMES.includes(saved as Theme) ? (saved as Theme) : 'mission'
    } catch { return 'mission' }
  })
  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme)
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])
  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() { return useContext(ThemeContext) }
```

---

## Sistema i18n (`src/shared/labels.ts`)

```ts
export type Locale = 'it' | 'en' | 'es'
type I18n<V> = Record<Locale, V>
function t(it: string, en: string, es: string): I18n<string> { return { it, en, es } }
function tf<A extends unknown[]>(it: (...a: A) => string, en: (...a: A) => string, es: (...a: A) => string): I18n<(...a: A) => string> { return { it, en, es } }

// Legge la lingua da localStorage
function getLang(): Locale {
  try {
    const l = localStorage.getItem('proxima-lang') as Locale
    return ['it','en','es'].includes(l) ? l : 'it'
  } catch { return 'it' }
}

// Proxy che ritorna sempre la stringa nella lingua corrente
function localize<T extends Record<string, I18n<unknown>>>(section: T) {
  return new Proxy({} as { [K in keyof T]: T[K] extends I18n<infer V> ? V : never }, {
    get: (_, key: string) => {
      const entry = (section as Record<string, I18n<unknown>>)[key]
      return entry ? entry[getLang()] : key
    },
  })
}

const STRINGS = {
  layout: {
    appName:   t('🛒 Proxima Centauri', '🛒 Proxima Centauri', '🛒 Proxima Centauri'),
    navHome:   t('Liste',    'Lists',    'Listas'),
    navSettings: t('Impostazioni', 'Settings', 'Ajustes'),
  },
  home: {
    titolo:       t('Le mie liste',       'My lists',           'Mis listas'),
    nuovaLista:   t('Nuova lista',        'New list',           'Nueva lista'),
    nessuna:      t('Nessuna lista ancora.\nPremi + per iniziare.', 'No lists yet.\nTap + to start.', 'Ninguna lista aún.\nPulsa + para empezar.'),
    articoli:     tf((n: number) => `${n} articol${n===1?'o':'i'}`, (n: number) => `${n} item${n===1?'':'s'}`, (n: number) => `${n} artículo${n===1?'':'s'}`),
    archiviate:   t('Archiviate',         'Archived',           'Archivadas'),
    archivia:     t('Archivia',           'Archive',            'Archivar'),
    elimina:      t('Elimina',            'Delete',             'Eliminar'),
    eliminaConf:  tf((n: string) => `Eliminare "${n}"?`, (n: string) => `Delete "${n}"?`, (n: string) => `¿Eliminar "${n}"?`),
  },
  list: {
    aggiungiItem:    t('Aggiungi prodotto',   'Add item',           'Añadir artículo'),
    nomeProdotto:    t('Nome prodotto…',      'Product name…',      'Nombre del producto…'),
    quantita:        t('Qtà',                 'Qty',                'Cant.'),
    reparto:         t('Reparto',             'Department',         'Departamento'),
    repartoNessuno:  t('— Nessun reparto —',  '— No department —',  '— Sin departamento —'),
    note:            t('Note (opzionale)',     'Notes (optional)',   'Notas (opcional)'),
    salva:           t('Salva',               'Save',               'Guardar'),
    annulla:         t('Annulla',             'Cancel',             'Cancelar'),
    svuotaCompletati: t('Rimuovi completati', 'Remove checked',     'Eliminar completados'),
    daAndromeda:     t('da Andromeda',        'from Andromeda',     'de Andromeda'),
  },
  settings: {
    titolo:     t('Impostazioni', 'Settings',  'Ajustes'),
    nomeUtente: t('Il tuo nome',  'Your name', 'Tu nombre'),
    tema:       t('Tema',         'Theme',     'Tema'),
    lingua:     t('Lingua',       'Language',  'Idioma'),
    sincronizza: t('Sincronizza da Andromeda', 'Sync from Andromeda', 'Sincronizar desde Andromeda'),
    sincronizzaHint: t('Importa i prodotti scansionati con Andromeda', 'Import products scanned with Andromeda', 'Importar productos escaneados con Andromeda'),
  },
}

export const LAYOUT   = localize(STRINGS.layout)
export const HOME     = localize(STRINGS.home)
export const LIST     = localize(STRINGS.list)
export const SETTINGS = localize(STRINGS.settings)
```

---

## Componenti UI (`src/components/ui/`)

**Regola: Tailwind per layout/spacing, `style` inline per CSS variables del tema.**

### Card
```tsx
function Card({ children, padding = 'md', style, onClick, className = '' }) {
  const p = { sm: 'p-2', md: 'p-4', lg: 'p-6' }[padding]
  return (
    <div
      className={`rounded-2xl transition-colors duration-300 ${p} ${className}`}
      style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', ...style }}
      onClick={onClick}
    >{children}</div>
  )
}
```

### Button
```tsx
// variant: 'primary' | 'secondary' | 'danger' | 'ghost'
// Usa: backgroundColor: 'var(--accent)' per primary
//      backgroundColor: 'var(--bg-secondary)' per secondary
//      bg-red-500 per danger (Tailwind diretto)
```

### FAB
```tsx
function FAB({ onClick, ariaLabel, children }) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className="fixed bottom-20 right-4 w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-2xl active:scale-95 transition z-50"
      style={{ backgroundColor: 'var(--fab-bg)', color: 'var(--fab-text)' }}
    >{children}</button>
  )
}
```

### AutocompleteInput
```tsx
// Input testo + dropdown sotto con suggerimenti da suggestProducts()
// Mostra badge "da Andromeda" se source === 'andromeda'
// Chiude dropdown su click fuori o ESC
// Selezionando un suggerimento: pre-compila repartoId se il KnownProduct ce l'ha
```

### RepartoSelect
```tsx
// <select> con le 18 opzioni da REPARTI_SUPERMERCATO
// Prima opzione: value="" → LIST.repartoNessuno
// Ogni opzione: `${r.emoji} ${r.label}`
import { REPARTI_SUPERMERCATO } from '../../shared/types'
```

---

## Provider Stack (`src/main.tsx`)

```tsx
// StrictMode → HashRouter → ThemeProvider → App
// (HashRouter perché gh-pages non gestisce SPA routing con BrowserRouter)
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </HashRouter>
  </StrictMode>
)
```

---

## Routing (`src/App.tsx`)

```tsx
<Routes>
  <Route element={<Layout />}>
    <Route path="/"           element={<Home />} />
    <Route path="/list/:id"   element={<ShoppingList />} />
    <Route path="/settings"   element={<Settings />} />
    <Route path="*"           element={<NotFound />} />
  </Route>
</Routes>
```

---

## Regole Stile

1. **Function component** con `export default`
2. **Props** con `interface` nello stesso file
3. **Mai stringhe hardcoded** — importare da `labels.ts`
4. **Tailwind** per layout, spacing, responsive (`md:`), animazioni
5. **`style` inline** per colori da CSS variables: `style={{ color: 'var(--text-primary)' }}`
6. **`transition-colors duration-300`** su ogni elemento che cambia colore col tema
7. **Commenti sezione**: `// ─── Nome Sezione ───`
8. **Mobile-first**: touch target ≥ 44px, bottom nav fisso, FAB sopra nav
9. **App sempre dark** tranne tema `luna` e `nasa` (che gestiscono il proprio `color-scheme`)

---

## UX ShoppingList Page

- Items raggruppati per reparto (ordine fisso da `REPARTI_SUPERMERCATO`)
- Reparto senza items non viene mostrato
- Items non-checked prima, checked dopo (dentro ogni reparto)
- Tap checkbox: toggle checked → crossed-out + opacity 0.45
- Header: nome lista + progress `3/12` + pulsante "Rimuovi completati"
- FAB `+` apre modal per aggiungere item
  - `AutocompleteInput` per il nome → suggerisce da `andromeda-products`
  - Se viene selezionato un suggerimento con `repartoId`, pre-compila la select
  - `RepartoSelect` per il reparto
  - Input quantità (number) + select unità (`pz|kg|g|l|conf|busta`)
  - Campo note opzionale

---

## UX Home Page

- Cards delle ShoppingList attive: nome, store, progress bar checked/total, data
- Sezione "Archiviate" collassabile in fondo
- FAB `+` → modal crea nuova lista (nome + store opzionale)
- Swipe right → archivia; long press → menu contestuale (archivia/elimina)
- Banner "Connetti Andromeda" se `andromeda-products` è vuoto in localStorage

---

## Comandi

```bash
npm run dev -- --host   # SEMPRE con --host per test da telefono
npm run build           # type-check + build
npm run deploy          # build + gh-pages publish
```

---

## Primo Task da Eseguire

Scaffold completo in questo ordine:

1. `package.json`
2. `vite.config.ts` (plugin: react, tailwind, qrcode, pwa)
3. `tsconfig.json` + `tsconfig.app.json` (strict)
4. `index.html`
5. `src/index.css` (temi completi come sopra)
6. `src/shared/types.ts`
7. `src/shared/storage.ts` (CRUD ShoppingList, KnownProduct, ProximaSettings)
8. `src/shared/andromedaImport.ts`
9. `src/shared/labels.ts`
10. `src/shared/ThemeContext.tsx`
11. `src/components/ui/` (tutti i componenti: Card, Button, Input, IconButton, Modal, FAB, SectionHeader, AutocompleteInput, RepartoSelect + `index.ts` barrel)
12. `src/components/Layout.tsx` + `BottomNav.tsx`
13. `src/pages/Home.tsx`
14. `src/pages/ShoppingList.tsx`
15. `src/pages/Settings.tsx`
16. `src/pages/NotFound.tsx`
17. `src/App.tsx`
18. `src/main.tsx`
