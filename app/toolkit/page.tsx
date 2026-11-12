import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { BudgetBreakdownClient } from './BudgetBreakdownClient'

export const metadata: Metadata = {
  title: 'Budget Breakdown Template — Pitchcraft',
  description:
    'A free reference for how indie film and video budgets typically split across cast, production, post, and marketing.',
}

export default async function ToolkitPage() {
  const headersList = await headers()
  const country = headersList.get('x-vercel-ip-country') ?? ''
  const defaultCurrency = country === 'IN' ? 'inr' : 'usd'

  return <BudgetBreakdownClient defaultCurrency={defaultCurrency} />
}
