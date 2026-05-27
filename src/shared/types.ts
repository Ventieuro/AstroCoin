export type TransactionType = 'entrata' | 'uscita'

export interface ReceiptDetailItem {
  name: string
  price: number
  grossPrice?: number
  discountAmount?: number
  discountType?: string
}

export interface ProductPriceEntry {
  price: number
  date: string // ISO yyyy-mm-dd
  grossPrice?: number
  discountAmount?: number
  discountType?: string
}

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

export interface ProductEntry {
  id: string
  name: string               // nome canonico (scelto dall'utente o dal primo OCR)
  aliases: string[]          // varianti OCR conosciute
  priceHistory: ProductPriceEntry[]
  category?: string
  reparto?: RepartoId        // reparto/corsia del supermercato
  lastSeen: string           // ISO yyyy-mm-dd ultima lettura
}

export interface Transaction {
  id: string
  syncId?: string
  createdAt?: string // ISO timestamp
  updatedAt?: string // ISO timestamp
  type: TransactionType
  description: string
  amount: number
  date: string // ISO yyyy-mm-dd
  recurring: boolean
  recurringMonths: number    // 0 = non ricorrente, N = quante volte si ripete
  recurringFrequency?: number // ogni quanti mesi (default 1)
  recurringGroupId?: string  // ID condiviso fra le occorrenze della stessa serie
  category: string
  important?: boolean
  isReceipt?: boolean
  receiptItems?: ReceiptDetailItem[]
  goalId?: string
  goalDeductNow?: boolean  // true = sottrai dalla bandiera obiettivo questo mese
}

export interface AppSettings {
  payDay: number
  userName: string
}

export interface SavingsGoal {
  id: string
  name: string
  emoji: string
  /** Totale da raggiungere (opzionale) */
  targetAmount?: number
  /** Data obiettivo ISO yyyy-mm-dd (opzionale) */
  targetDate?: string
  /** Risparmio mensile fisso impostato dall'utente */
  monthlyAmount?: number
  /** Quanto già messo da parte */
  savedAmount: number
  createdAt: string
  updatedAt: string
}


// Le categorie sono ora in src/shared/labels.ts → CATEGORIES
export { CATEGORIES } from './labels'
