import type { BudgetRange } from '@/lib/types/pitch'

export interface BudgetTierOption {
  value: BudgetRange
  // Range bounds in USD (maxUsd null = open-ended). Labels are derived from
  // these so they follow the selected currency.
  minUsd: number
  maxUsd: number | null
  // Representative figure (USD) used when the visitor hasn't typed their own budget.
  representativeUsd: number
}

export const BUDGET_TIERS: BudgetTierOption[] = [
  { value: 'under-5k', minUsd: 0, maxUsd: 5_000, representativeUsd: 2_500 },
  { value: '5k-50k', minUsd: 5_000, maxUsd: 50_000, representativeUsd: 25_000 },
  { value: '50k-250k', minUsd: 50_000, maxUsd: 250_000, representativeUsd: 100_000 },
  { value: '250k-1m', minUsd: 250_000, maxUsd: 1_000_000, representativeUsd: 500_000 },
  { value: '1m-plus', minUsd: 1_000_000, maxUsd: null, representativeUsd: 2_000_000 },
]

export interface BudgetCategory {
  label: string
  percent: number
}

// General indie-production guidance, not tier-specific research — the same
// split is shown at every budget size. Percentages sum to 100.
export const BUDGET_CATEGORIES: BudgetCategory[] = [
  { label: 'Cast & Key Creatives', percent: 20 },
  { label: 'Production (Crew, Locations, Equipment)', percent: 40 },
  { label: 'Post-Production', percent: 20 },
  { label: 'Music & Sound', percent: 5 },
  { label: 'Marketing & Festival Submissions', percent: 5 },
  { label: 'Contingency', percent: 10 },
]

// Static, approximate — not a live exchange rate. Update manually when it drifts.
export const USD_TO_INR_RATE = 87
