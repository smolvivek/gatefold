import { NextRequest, NextResponse } from 'next/server'
import { getDodo } from '@/lib/dodo/client'
import { createAdminClient } from '@/lib/supabase/admin'
import { effectiveTier } from '@/lib/subscriptions/getTier'
import type { Webhooks } from 'dodopayments/resources/webhooks/webhooks'

export const runtime = 'nodejs'

type SubscriptionStatus = 'active' | 'cancelled' | 'past_due'

// Map DodoPayments subscription status → our status (the DB check constraint
// allows only active / cancelled / past_due / trialing). 'expired' is stored as
// cancelled with tier free. Unknown statuses return null so they are logged
// and skipped rather than silently granting a paid tier.
function mapStatus(dodoStatus: string): SubscriptionStatus | null {
  switch (dodoStatus) {
    case 'active': return 'active'
    case 'cancelled': return 'cancelled'
    case 'expired': return 'cancelled'
    case 'on_hold': return 'past_due'
    case 'failed': return 'past_due'
    default: return null
  }
}

// The tier a Dodo product grants. Checkout metadata records the tier at purchase
// time and goes stale after a plan change, so the event's product wins.
function tierForProduct(productId: string | undefined): 'pro' | 'studio' | null {
  if (!productId) return null
  const pro = [
    process.env.DODO_PRODUCT_ID_PRO,
    process.env.DODO_PRODUCT_ID_PRO_ANNUAL,
    process.env.DODO_PRODUCT_ID_PRO_INR,
    process.env.DODO_PRODUCT_ID_PRO_ANNUAL_INR,
  ]
  const studio = [
    process.env.DODO_PRODUCT_ID_STUDIO,
    process.env.DODO_PRODUCT_ID_STUDIO_ANNUAL,
    process.env.DODO_PRODUCT_ID_STUDIO_INR,
    process.env.DODO_PRODUCT_ID_STUDIO_ANNUAL_INR,
  ]
  if (pro.includes(productId)) return 'pro'
  if (studio.includes(productId)) return 'studio'
  return null
}

export async function POST(request: NextRequest) {
  const body = await request.text()
  const headers = Object.fromEntries(request.headers.entries())

  const webhookSecret = process.env.DODO_WEBHOOK_SECRET
  if (!webhookSecret) {
    console.error('Missing DODO_WEBHOOK_SECRET')
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 })
  }

  let event: Webhooks.UnwrapWebhookEvent
  try {
    const dodo = getDodo()
    event = dodo.webhooks.unwrap(body, { headers, key: webhookSecret })
  } catch (err) {
    console.error('Dodo webhook verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const subscriptionEvents = new Set([
    'subscription.active',
    'subscription.renewed',
    'subscription.cancelled',
    'subscription.failed',
    'subscription.on_hold',
    'subscription.expired',
    'subscription.plan_changed',
  ])

  if (!subscriptionEvents.has(event.type)) {
    return NextResponse.json({ received: true })
  }

  // All subscription events carry a Subscription in data
  const sub = (event as { data: { subscription_id: string; product_id?: string; metadata: Record<string, string>; status: string; next_billing_date?: string; cancel_at_next_billing_date?: boolean; customer?: { customer_id?: string } } }).data

  const userId = sub.metadata?.user_id
  const metadataTier = sub.metadata?.tier === 'pro' || sub.metadata?.tier === 'studio' ? sub.metadata.tier : null
  const tier = tierForProduct(sub.product_id) ?? metadataTier

  if (!userId || !tier) {
    console.error('Dodo webhook: missing user_id or tier', sub.metadata, sub.product_id)
    return NextResponse.json({ error: 'Missing metadata' }, { status: 400 })
  }

  const status = mapStatus(sub.status)
  if (!status) {
    console.error(`Dodo webhook: unhandled subscription status "${sub.status}" for ${sub.subscription_id} — skipped`)
    return NextResponse.json({ received: true })
  }

  const supabase = createAdminClient()

  // A late event from an old subscription (e.g. the expiry of a cancelled plan A
  // arriving after the user bought plan B) must not overwrite the current one.
  // A different subscription only takes over on its own activation, or when the
  // stored one is already finished.
  const { data: existing } = await supabase
    .from('subscriptions')
    .select('tier, status, current_period_end, dodo_subscription_id')
    .eq('user_id', userId)
    .maybeSingle()

  if (
    existing?.dodo_subscription_id &&
    existing.dodo_subscription_id !== sub.subscription_id &&
    event.type !== 'subscription.active' &&
    effectiveTier(existing) !== 'free'
  ) {
    console.warn(
      `Dodo webhook: ignored ${event.type} for ${sub.subscription_id}; user ${userId} is on ${existing.dodo_subscription_id}`
    )
    return NextResponse.json({ received: true })
  }

  // Only revoke tier on expiry, not on cancellation.
  // Cancelled users keep their tier until current_period_end (access until what they paid for).
  // On expiry, DodoPayments fires subscription.expired — that's when we revert to free.
  const isExpired = event.type === 'subscription.expired'
  const effective = isExpired ? 'free' : tier

  const { error } = await supabase
    .from('subscriptions')
    .upsert(
      {
        user_id: userId,
        tier: effective,
        dodo_subscription_id: sub.subscription_id,
        dodo_customer_id: sub.customer?.customer_id ?? null,
        status,
        current_period_end: sub.next_billing_date ?? null,
        cancel_at_period_end: sub.cancel_at_next_billing_date ?? false,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' }
    )

  if (error) {
    // A non-2xx makes Dodo retry; swallowing this would leave a paying user on free.
    console.error('Dodo webhook: subscription upsert failed:', error)
    return NextResponse.json({ error: 'Failed to record subscription' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
