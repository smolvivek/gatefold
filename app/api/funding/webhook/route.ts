import { NextRequest, NextResponse, after } from 'next/server'
import { validateWebhookSignature } from 'razorpay/dist/utils/razorpay-utils'
import { createAdminClient } from '@/lib/supabase/admin'
import { getRazorpay } from '@/lib/razorpay/client'
import { sendDonorConfirmation, sendCreatorDonationAlert } from '@/lib/email/client'

export const runtime = 'nodejs'

// Server-side safety net for donations. The client also calls /funding/[id]/verify
// right after checkout, but that depends on the donor's browser staying open and
// online — a closed tab or dropped connection after Razorpay captures the payment
// would otherwise leave a charged donor with no recorded donation. This webhook
// records the same donation independently of the client, deduped by payment ID.
export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('x-razorpay-signature')

    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET
    if (!webhookSecret) {
      console.error('Missing RAZORPAY_WEBHOOK_SECRET')
      return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 })
    }

    if (!signature || !validateWebhookSignature(body, signature, webhookSecret)) {
      console.error('Razorpay webhook signature verification failed')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    let event: { event: string; payload: { payment: { entity: { id: string; order_id: string } } } }
    try {
      event = JSON.parse(body)
    } catch {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    if (event.event !== 'payment.captured') {
      return NextResponse.json({ received: true })
    }

    const paymentId = event.payload.payment.entity.id
    const orderId = event.payload.payment.entity.order_id

    const supabase = createAdminClient()

    // Idempotent — the client's /verify call may have already recorded this payment
    const { data: existing } = await supabase
      .from('donations')
      .select('id')
      .eq('razorpay_payment_id', paymentId)
      .single()

    if (existing) {
      return NextResponse.json({ received: true })
    }

    // Fetch the order for verified amount + notes — never trust webhook payload alone
    const razorpay = getRazorpay()
    const order = await razorpay.orders.fetch(orderId)
    const notes = (order.notes as Record<string, string>) ?? {}
    const fundingId = notes.funding_id

    if (!fundingId) {
      console.error('Razorpay webhook: missing funding_id in order notes', orderId)
      return NextResponse.json({ error: 'Missing funding_id' }, { status: 400 })
    }

    const verifiedAmount = typeof order.amount === 'string' ? parseInt(order.amount, 10) : Number(order.amount)
    const verifiedCurrency = order.currency ?? 'USD'
    const name = notes.donor_name || 'Anonymous'
    const email = notes.donor_email || ''
    const message = notes.message || null

    const { data: funding } = await supabase
      .from('funding')
      .select('id, pitch_id')
      .eq('id', fundingId)
      .single()

    if (!funding) {
      console.error('Razorpay webhook: funding not found', fundingId)
      return NextResponse.json({ error: 'Funding not found' }, { status: 404 })
    }

    const { data: pitch } = await supabase
      .from('pitches')
      .select('project_name, users(name, email)')
      .eq('id', funding.pitch_id)
      .single()

    const creator = (pitch?.users as unknown) as { name: string; email: string } | null

    const { error: insertError } = await supabase
      .from('donations')
      .insert({
        funding_id: fundingId,
        amount: verifiedAmount,
        name,
        email,
        message,
        razorpay_order_id: orderId,
        razorpay_payment_id: paymentId,
        razorpay_signature: signature,
      })

    if (insertError) {
      // Unique violation means /verify already inserted this payment concurrently — not an error
      if (insertError.code === '23505') {
        return NextResponse.json({ received: true })
      }
      console.error('Razorpay webhook: record donation error:', insertError)
      return NextResponse.json({ error: 'Failed to record donation' }, { status: 500 })
    }

    const projectName = (pitch as unknown as { project_name?: string })?.project_name ?? 'this project'

    // after() keeps the function alive past the response so these sends aren't
    // dropped by a serverless freeze the instant NextResponse is returned.
    after(async () => {
      const results = await Promise.allSettled([
        email
          ? sendDonorConfirmation({
              to: email,
              donorName: name,
              projectName,
              amount: verifiedAmount,
              currency: verifiedCurrency,
              paymentId,
            })
          : Promise.resolve(),
        creator?.email
          ? sendCreatorDonationAlert({
              to: creator.email,
              creatorName: creator.name,
              projectName,
              donorName: name,
              amount: verifiedAmount,
              currency: verifiedCurrency,
              message,
              paymentId,
            })
          : Promise.resolve(),
      ])
      results.forEach((r, i) => {
        if (r.status === 'rejected') {
          console.error(`Email ${i === 0 ? 'donor' : 'creator'} send failed for payment ${paymentId}:`, r.reason)
        }
      })
    })

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Razorpay webhook error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
