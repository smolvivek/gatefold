import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getRazorpay } from '@/lib/razorpay/client'
import { getUserTier } from '@/lib/subscriptions/getTier'
import { rateLimit } from '@/lib/ratelimit'

const COMMISSION_RATES: Record<string, number> = {
  free: 0.08,
  pro: 0.05,
  studio: 0.03,
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
// Razorpay rejects order note values longer than 256 characters.
const MAX_NAME = 100
const MAX_EMAIL = 254
const MAX_MESSAGE = 250

// POST — create a Razorpay order for a donation
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: fundingId } = await params

    // Unauthenticated endpoint that creates real Razorpay orders — cap per IP
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '0.0.0.0'
    const limit = await rateLimit(`rl:donate:${ip}`, 10, 10 * 60 * 1000)
    if (!limit.allowed) {
      return NextResponse.json(
        { error: 'Too many attempts. Please wait a few minutes and try again.' },
        { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } }
      )
    }

    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
    if (!keyId) {
      console.error('NEXT_PUBLIC_RAZORPAY_KEY_ID is not set')
      return NextResponse.json({ error: 'Payment not configured' }, { status: 500 })
    }

    const supabase = createAdminClient()

    // Verify funding exists
    const { data: funding } = await supabase
      .from('funding')
      .select('id, pitch_id, funding_goal, end_date')
      .eq('id', fundingId)
      .single()

    if (!funding) {
      return NextResponse.json({ error: 'Funding not found' }, { status: 404 })
    }

    // Check share link is active (public or password-protected pitches both accept donations)
    const { data: shareLink } = await supabase
      .from('share_links')
      .select('id')
      .eq('pitch_id', funding.pitch_id)
      .in('visibility', ['public', 'password'])
      .is('deleted_at', null)
      .single()

    if (!shareLink) {
      return NextResponse.json({ error: 'Project is not publicly shared' }, { status: 403 })
    }

    if (funding.end_date && new Date(funding.end_date) < new Date()) {
      return NextResponse.json({ error: 'Funding campaign has ended' }, { status: 400 })
    }

    const body = await request.json().catch(() => null)
    const { amount, name, email, message } = (body ?? {}) as {
      amount?: unknown
      name?: unknown
      email?: unknown
      message?: unknown
    }

    // amount in cents (USD). Minimum $1 = 100 cents, maximum $10,000 = 1,000,000 cents
    if (typeof amount !== 'number' || !Number.isInteger(amount) || amount < 100) {
      return NextResponse.json({ error: 'Minimum donation is $1' }, { status: 400 })
    }
    if (amount > 1_000_000) {
      return NextResponse.json({ error: 'Maximum donation is $10,000' }, { status: 400 })
    }
    if (typeof name !== 'string' || typeof email !== 'string' || !name.trim() || !email.trim()) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
    }
    if (name.length > MAX_NAME || email.length > MAX_EMAIL || !EMAIL_RE.test(email.trim())) {
      return NextResponse.json({ error: 'Enter a valid name and email address' }, { status: 400 })
    }
    if (message !== undefined && (typeof message !== 'string' || message.length > MAX_MESSAGE)) {
      return NextResponse.json({ error: `Message must be ${MAX_MESSAGE} characters or fewer` }, { status: 400 })
    }

    // Creator + payout account. subscriptions are keyed by the auth UID, which is
    // users.auth_id — NOT pitches.user_id (that is public.users.id).
    const { data: pitch } = await supabase
      .from('pitches')
      .select('user_id, project_name, users(id, auth_id, razorpay_account_id)')
      .eq('id', funding.pitch_id)
      .single()

    const creator = (pitch?.users as unknown) as {
      id: string
      auth_id: string
      razorpay_account_id: string | null
    } | null

    // Without a linked payout account the charge would sit in the platform
    // account with no route to the creator — refuse before charging anyone.
    if (!creator?.razorpay_account_id) {
      return NextResponse.json(
        { error: 'This project is not set up to receive donations yet.' },
        { status: 409 }
      )
    }

    const tier = creator.auth_id ? await getUserTier(supabase, creator.auth_id) : 'free'

    const commissionRate = COMMISSION_RATES[tier] ?? COMMISSION_RATES.free
    const commissionAmount = Math.round(amount * commissionRate)
    const creatorAmount = amount - commissionAmount

    const razorpay = getRazorpay()

    // Build order with the Route transfer to the creator's linked account
    const orderParams: Parameters<typeof razorpay.orders.create>[0] = {
      amount,
      currency: 'USD',
      notes: {
        funding_id: fundingId,
        donor_name: name.trim(),
        donor_email: email.trim(),
        message: typeof message === 'string' ? message : '',
        creator_amount: String(creatorAmount),
        commission_amount: String(commissionAmount),
        tier,
      },
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(orderParams as any).transfers = [
      {
        account: creator.razorpay_account_id,
        amount: creatorAmount,
        currency: 'USD',
        notes: {
          project: (pitch as unknown as { project_name?: string })?.project_name ?? '',
        },
      },
    ]

    const order = await razorpay.orders.create(orderParams)

    return NextResponse.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: keyId,
      creator_amount: creatorAmount,
      commission_amount: commissionAmount,
      commission_rate: commissionRate,
    })
  } catch (error) {
    console.error('Create donation order error:', error)
    return NextResponse.json({ error: 'Failed to create payment' }, { status: 500 })
  }
}
