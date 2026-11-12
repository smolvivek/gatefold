import { NextRequest, NextResponse, after } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getRazorpay } from '@/lib/razorpay/client'
import { sendDonorConfirmation, sendCreatorDonationAlert } from '@/lib/email/client'
import crypto from 'crypto'

// POST — verify Razorpay signature and record donation
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: fundingId } = await params

    const body = await request.json()
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = body as {
      razorpay_order_id: string
      razorpay_payment_id: string
      razorpay_signature: string
    }

    if (
      typeof razorpay_order_id !== 'string' ||
      typeof razorpay_payment_id !== 'string' ||
      typeof razorpay_signature !== 'string' ||
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return NextResponse.json({ error: 'Missing payment fields' }, { status: 400 })
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET
    if (!keySecret) {
      return NextResponse.json({ error: 'Payment verification not configured' }, { status: 500 })
    }

    // Verify HMAC-SHA256 signature
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex')

    const expectedBuf = Buffer.from(expectedSignature)
    const givenBuf = Buffer.from(razorpay_signature)
    if (expectedBuf.length !== givenBuf.length || !crypto.timingSafeEqual(expectedBuf, givenBuf)) {
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 })
    }

    // Fetch the actual order from Razorpay to get the verified amount.
    // Never trust the client-supplied amount — use what Razorpay actually charged.
    const razorpay = getRazorpay()
    const order = await razorpay.orders.fetch(razorpay_order_id)
    const verifiedAmount = typeof order.amount === 'string' ? parseInt(order.amount, 10) : Number(order.amount)
    const verifiedCurrency = order.currency ?? 'USD'

    // Donor details come from the order notes written server-side when the order
    // was created (same source as the Razorpay webhook), never from this request —
    // otherwise anyone holding a valid payment could redirect the confirmation
    // email or plant text in the creator's alert.
    const notes = (order.notes as Record<string, string> | null) ?? {}
    const name = notes.donor_name || 'Anonymous'
    const email = notes.donor_email || ''
    const message = notes.message || null

    // Cross-check: the order must have been created for this funding campaign.
    // Prevents replaying a payment from campaign A against campaign B. An order
    // with no funding_id note is rejected too, not waved through.
    const orderFundingId = notes.funding_id
    if (orderFundingId !== fundingId) {
      console.error(`fundingId mismatch: URL=${fundingId}, order.notes=${orderFundingId ?? 'missing'}`)
      return NextResponse.json({ error: 'Payment does not match this campaign' }, { status: 400 })
    }

    const supabase = createAdminClient()

    // Prevent duplicate recording
    const { data: existing } = await supabase
      .from('donations')
      .select('id')
      .eq('razorpay_payment_id', razorpay_payment_id)
      .single()

    if (existing) {
      return NextResponse.json({ success: true })
    }

    // Fetch funding + pitch + creator info for emails
    const { data: funding } = await supabase
      .from('funding')
      .select('id, pitch_id')
      .eq('id', fundingId)
      .single()

    if (!funding) {
      return NextResponse.json({ error: 'Funding not found' }, { status: 404 })
    }

    const { data: pitch } = await supabase
      .from('pitches')
      .select('project_name, users(name, email)')
      .eq('id', funding.pitch_id)
      .single()

    const creator = (pitch?.users as unknown) as { name: string; email: string } | null

    if (typeof creator?.email !== 'string' || !creator.email.includes('@')) {
      console.error('Creator email missing or invalid for funding', fundingId)
    }

    // Record donation using Razorpay-verified amount (not client-supplied)
    const donorName = name

    const { error: insertError } = await supabase
      .from('donations')
      .insert({
        funding_id: fundingId,
        amount: verifiedAmount,
        name: donorName,
        email,
        message,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      })

    if (insertError) {
      // Unique violation means the /funding/webhook already recorded this payment concurrently — not an error
      if (insertError.code === '23505') {
        return NextResponse.json({ success: true })
      }
      console.error('Record donation error:', insertError)
      return NextResponse.json({ error: 'Failed to record donation' }, { status: 500 })
    }

    // Send emails — after() keeps the function alive past the response so
    // these sends aren't dropped by a serverless freeze
    const projectName = (pitch as unknown as { project_name?: string })?.project_name ?? 'this project'

    after(async () => {
      const results = await Promise.allSettled([
        email
          ? sendDonorConfirmation({
              to: email,
              donorName,
              projectName,
              amount: verifiedAmount,
              currency: verifiedCurrency,
              paymentId: razorpay_payment_id,
            })
          : Promise.resolve(),
        creator?.email
          ? sendCreatorDonationAlert({
              to: creator.email,
              creatorName: creator.name,
              projectName,
              donorName,
              amount: verifiedAmount,
              currency: verifiedCurrency,
              message,
              paymentId: razorpay_payment_id,
            })
          : Promise.resolve(),
      ])
      results.forEach((r, i) => {
        if (r.status === 'rejected') {
          console.error(`Email ${i === 0 ? 'donor' : 'creator'} send failed for payment ${razorpay_payment_id}:`, r.reason)
        }
      })
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Verify donation error:', error)
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
  }
}
