import type { SupabaseClient } from '@supabase/supabase-js'

export type Tier = 'free' | 'pro' | 'studio'

export interface SubscriptionRow {
  tier: string | null
  status: string | null
  current_period_end: string | null
}

/**
 * The tier a subscription row actually entitles. A cancelled subscription
 * keeps its tier until the period it paid for ends; after that it is free.
 * Single source of truth — routes must not re-implement this.
 */
export function effectiveTier(subscription: SubscriptionRow | null | undefined): Tier {
  if (!subscription) return 'free'

  if (
    subscription.status === 'cancelled' &&
    subscription.current_period_end &&
    new Date(subscription.current_period_end) < new Date()
  ) {
    return 'free'
  }

  return subscription.tier === 'pro' || subscription.tier === 'studio' ? subscription.tier : 'free'
}

/**
 * Returns the effective subscription tier for a user.
 * Accepts either a user client or admin client.
 * @param client - any Supabase client
 * @param userId - auth UID (auth.users.id), NOT public.users.id
 */
export async function getUserTier(client: SupabaseClient, userId: string): Promise<Tier> {
  const { data: subscription } = await client
    .from('subscriptions')
    .select('tier, status, current_period_end')
    .eq('user_id', userId)
    .single()

  return effectiveTier(subscription)
}
