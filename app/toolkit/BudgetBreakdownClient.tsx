'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  BUDGET_TIERS,
  BUDGET_CATEGORIES,
  USD_TO_INR_RATE,
  type BudgetTierOption,
} from '@/lib/toolkit/budget-breakdown-data'

type Currency = 'usd' | 'inr'

interface BudgetBreakdownClientProps {
  defaultCurrency: Currency
}

const MAX_BUDGET = 1e12

function formatNumber(amount: number, currency: Currency): string {
  return Math.round(amount).toLocaleString(currency === 'inr' ? 'en-IN' : 'en-US')
}

function formatAmount(amount: number, currency: Currency): string {
  return `${currency === 'inr' ? '₹' : '$'}${formatNumber(amount, currency)}`
}

// 5000 -> "$5K", 1_000_000 -> "$1M"; INR uses lakh/crore (4.35L, 4.35Cr).
function formatCompact(usd: number, currency: Currency): string {
  const amount = currency === 'inr' ? usd * USD_TO_INR_RATE : usd
  const units =
    currency === 'inr'
      ? [[1e7, 'Cr'], [1e5, 'L'], [1e3, 'K']]
      : [[1e9, 'B'], [1e6, 'M'], [1e3, 'K']]
  const symbol = currency === 'inr' ? '₹' : '$'
  for (const [size, suffix] of units as [number, string][]) {
    if (amount >= size) return `${symbol}${Number((amount / size).toFixed(2))}${suffix}`
  }
  return `${symbol}${Math.round(amount)}`
}

function tierLabel(tier: BudgetTierOption, currency: Currency): string {
  if (tier.maxUsd === null) return `${formatCompact(tier.minUsd, currency)}+`
  if (tier.minUsd === 0) return `Under ${formatCompact(tier.maxUsd, currency)}`
  return `${formatCompact(tier.minUsd, currency)} – ${formatCompact(tier.maxUsd, currency)}`
}

function parseBudget(input: string): number | null {
  const parsed = parseFloat(input.replace(/,/g, ''))
  return Number.isFinite(parsed) && parsed > 0 ? Math.min(parsed, MAX_BUDGET) : null
}

export function BudgetBreakdownClient({ defaultCurrency }: BudgetBreakdownClientProps) {
  const [currency, setCurrency] = useState<Currency>(defaultCurrency)
  const [tierIndex, setTierIndex] = useState(0)
  const [customBudget, setCustomBudget] = useState('')

  const tier = BUDGET_TIERS[tierIndex]

  const totalUsd = useMemo(() => {
    const parsed = parseBudget(customBudget)
    if (parsed !== null) return currency === 'inr' ? parsed / USD_TO_INR_RATE : parsed
    return tier.representativeUsd
  }, [customBudget, currency, tier])

  const totalDisplay = currency === 'inr' ? totalUsd * USD_TO_INR_RATE : totalUsd

  // Convert (not reinterpret) a typed budget when the currency changes.
  function toggleCurrency() {
    const next: Currency = currency === 'inr' ? 'usd' : 'inr'
    const parsed = parseBudget(customBudget)
    if (parsed !== null) {
      const converted = next === 'inr' ? parsed * USD_TO_INR_RATE : parsed / USD_TO_INR_RATE
      setCustomBudget(formatNumber(converted, next))
    }
    setCurrency(next)
  }

  // Picking a tier shows that tier's figure, so a typed budget is cleared.
  function selectTier(index: number) {
    setTierIndex(index)
    setCustomBudget('')
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Minimal wordmark nav */}
      <header className="px-[24px] md:px-[48px] py-[20px] border-b border-border flex items-center justify-between">
        <Link href="/" className="font-heading font-bold text-[18px] tracking-tight text-text-primary hover:text-pop transition-colors duration-[200ms]">
          Pitchcraft
        </Link>
        <Link href="/dashboard" className="font-mono text-[12px] text-text-secondary hover:text-text-primary transition-colors duration-[200ms]">
          Dashboard
        </Link>
      </header>

      <main className="flex-1 px-[24px] md:px-[48px] py-[80px] md:py-[120px]">
        <div className="max-w-[680px] mx-auto">
          <div className="text-center mb-[48px]">
            <h1 className="font-heading text-[36px] md:text-[48px] font-light leading-[1.1] tracking-[-0.03em] text-text-primary mb-[16px]">
              Budget breakdown template
            </h1>
            <p className="font-[var(--font-body)] text-[18px] leading-[28px] text-text-secondary max-w-[480px] mx-auto mb-[32px]">
              A general reference for how indie budgets typically split across categories. Free, no account needed.
            </p>

            {/* Currency toggle */}
            <div className="flex items-center justify-center gap-[8px]">
              <button
                onClick={toggleCurrency}
                className="font-mono text-[11px] text-text-disabled hover:text-text-secondary transition-colors duration-[150ms]"
              >
                {currency === 'inr' ? 'Switch to USD ($)' : 'Switch to INR (₹)'}
              </button>
            </div>
          </div>

          {/* Tier tabs */}
          <div className="flex flex-wrap items-center justify-center gap-[0px] bg-surface border border-border rounded-none p-[3px] mb-[24px] mx-auto w-fit">
            {BUDGET_TIERS.map((t, i) => (
              <button
                key={t.value}
                onClick={() => selectTier(i)}
                className={`px-[14px] py-[6px] rounded-none font-mono text-[12px] leading-[20px] transition-colors duration-[150ms] ${
                  i === tierIndex
                    ? 'bg-surface-hover text-text-primary'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {tierLabel(t, currency)}
              </button>
            ))}
          </div>

          {/* Custom budget input */}
          <div className="flex flex-col items-center gap-[8px] mb-[40px]">
            <label htmlFor="custom-budget" className="font-mono text-[11px] leading-[16px] tracking-[0.05em] uppercase text-text-secondary">
              Enter your budget (optional)
            </label>
            <div className="flex items-center gap-[8px] bg-surface border border-border rounded-none px-[12px] py-[8px]">
              <span className="font-mono text-[14px] text-text-disabled">{currency === 'inr' ? '₹' : '$'}</span>
              <input
                id="custom-budget"
                type="text"
                inputMode="numeric"
                placeholder={formatNumber(currency === 'inr' ? tier.representativeUsd * USD_TO_INR_RATE : tier.representativeUsd, currency)}
                value={customBudget}
                onChange={(e) => setCustomBudget(e.target.value)}
                className="font-mono text-[14px] text-text-primary bg-transparent outline-none w-[140px]"
              />
            </div>
          </div>

          {/* Category breakdown */}
          <div className="flex flex-col gap-[10px] mb-[24px]">
            {BUDGET_CATEGORIES.map((cat) => (
              <div
                key={cat.label}
                className="flex items-center justify-between gap-[16px] bg-surface border border-border rounded-none px-[16px] py-[14px]"
              >
                <div className="flex items-baseline gap-[10px]">
                  <span className="font-[var(--font-body)] text-[14px] leading-[20px] text-text-primary">
                    {cat.label}
                  </span>
                  <span className="font-mono text-[11px] text-text-disabled">{cat.percent}%</span>
                </div>
                <span className="font-mono text-[14px] text-text-primary whitespace-nowrap">
                  {formatAmount((totalDisplay * cat.percent) / 100, currency)}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between px-[16px] py-[14px] border-t border-border">
            <span className="font-mono text-[11px] leading-[16px] tracking-[0.05em] uppercase text-text-secondary">
              Total
            </span>
            <span className="font-heading text-[20px] font-bold text-text-primary">
              {formatAmount(totalDisplay, currency)}
            </span>
          </div>

          <p className="font-mono text-[11px] leading-[16px] text-text-disabled text-center mt-[32px]">
            General guidance, not tier- or project-specific — every real production varies. INR figures use an approximate, periodically-updated conversion rate, not a live quote.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-[24px] md:px-[48px] py-[24px] border-t border-border flex items-center justify-between">
        <Link href="/" className="font-mono text-[11px] text-text-disabled hover:text-text-secondary transition-colors duration-[200ms]">
          ← Back to Pitchcraft
        </Link>
        <span className="font-mono text-[11px] text-text-disabled">
          © {new Date().getFullYear()} Pitchcraft
        </span>
      </footer>
    </div>
  )
}
