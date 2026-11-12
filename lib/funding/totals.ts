import type { SupabaseClient } from '@supabase/supabase-js'

// PostgREST caps a single select at 1000 rows by default, so a plain
// select-and-sum silently stops growing once a campaign passes 1000
// donations. Page through all rows instead.
const PAGE_SIZE = 1000

export async function getFundingTotals(
  client: SupabaseClient,
  fundingId: string
): Promise<{ raised: number; donorCount: number }> {
  let raised = 0
  let donorCount = 0

  for (let from = 0; ; from += PAGE_SIZE) {
    const { data, error } = await client
      .from('donations')
      .select('amount')
      .eq('funding_id', fundingId)
      .order('id', { ascending: true })
      .range(from, from + PAGE_SIZE - 1)

    if (error) throw new Error(`Failed to load donations: ${error.message}`)
    if (!data || data.length === 0) break

    for (const row of data as { amount: number }[]) raised += row.amount
    donorCount += data.length
    if (data.length < PAGE_SIZE) break
  }

  return { raised, donorCount }
}
