import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getDodo } from '@/lib/dodo/client'

export async function POST() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const adminClient = createAdminClient()
    const { data: subscription } = await adminClient
      .from('subscriptions')
      .select('dodo_subscription_id, status, tier')
      .eq('user_id', user.id)
      .single()

    if (!subscription?.dodo_subscription_id) {
      return NextResponse.json({ error: 'No active subscription found' }, { status: 404 })
    }

    if (subscription.status === 'cancelled') {
      return NextResponse.json({ error: 'Subscription is already cancelled' }, { status: 400 })
    }

    const dodo = getDodo()
    await dodo.subscriptions.update(subscription.dodo_subscription_id, { cancel_at_next_billing_date: true })

    // Update DB immediately so router.refresh() reflects the change.
    // Webhook will reconfirm on subscription.cancelled / subscription.expired.
    const { error: updateError } = await adminClient
      .from('subscriptions')
      .update({
        status: 'cancelled',
        cancel_at_period_end: true,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id)

    if (updateError) {
      // Dodo already has the cancellation; the webhook will sync the status, and a
      // retry here is safe (the already-cancelled check keys off our DB row).
      console.error('Subscription cancel: DB update failed after Dodo cancel:', updateError)
      return NextResponse.json(
        { error: 'Your cancellation was received but we could not update your account yet. Please refresh in a minute.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Subscription cancel error:', error)
    return NextResponse.json({ error: 'Failed to cancel subscription' }, { status: 500 })
  }
}
