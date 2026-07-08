import type { BudgetRange } from '@/lib/types/pitch'

interface PitchViewMetadataProps {
  genre: string
  budgetRange: BudgetRange
  status?: string
  /** Cents. Shown as a compact progress bar when the pitch is publicly raising. */
  funding?: { goal: number; raised: number }
}

const BUDGET_LABELS: Record<BudgetRange, string> = {
  'under-5k': 'Less than $5K',
  '5k-50k': '$5K–$50K',
  '50k-250k': '$50K–$250K',
  '250k-1m': '$250K–$1M',
  '1m-plus': '$1M+',
}

const STATUS_LABELS: Record<string, string> = {
  development: 'Development',
  production: 'Production',
  completed: 'Completed',
}

export function PitchViewMetadata({ genre, budgetRange, status, funding }: PitchViewMetadataProps) {
  const statusLabel = status ? (STATUS_LABELS[status] ?? status) : null
  const fundingPct = funding && funding.goal > 0
    ? Math.min(100, Math.round((funding.raised / funding.goal) * 100))
    : null

  return (
    <div className="px-[24px] md:px-[96px] py-[24px] border-b border-hairline bg-surface">
      <div className="flex flex-wrap items-end gap-x-[64px] gap-y-[16px]">
        {genre && (
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-text-disabled mb-[4px]">Genre</p>
            <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-text-primary">{genre}</p>
          </div>
        )}
        {budgetRange && (
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-text-disabled mb-[4px]">Budget</p>
            <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-text-primary">
              {BUDGET_LABELS[budgetRange]}
            </p>
          </div>
        )}
        {statusLabel && (
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-text-disabled mb-[4px]">Status</p>
            <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-pop">{statusLabel}</p>
          </div>
        )}
        {fundingPct !== null && (
          <a href="#funding" className="md:ml-auto group">
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-text-disabled mb-[6px]">Funding</p>
            <span className="flex items-center gap-[10px]">
              <span className="block h-[3px] w-[120px] bg-border">
                <span className="block h-full bg-pop" style={{ width: `${fundingPct}%` }} />
              </span>
              <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-text-primary group-hover:text-pop transition-colors duration-[200ms]">
                {fundingPct}%
              </span>
            </span>
          </a>
        )}
      </div>
    </div>
  )
}
