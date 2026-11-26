import { Resend } from 'resend'

let instance: Resend | null = null

export function getResend(): Resend {
  if (instance) return instance

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) throw new Error('Missing RESEND_API_KEY')

  instance = new Resend(apiKey)
  return instance
}

// Donor names, messages and project titles are user-supplied; escape before
// putting them in HTML so they can't inject markup or links into our emails.
function esc(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

// Subjects are plain text but must not carry header-breaking newlines.
function subjectSafe(value: string): string {
  return value.replace(/[\r\n]+/g, ' ').trim()
}

const FROM = process.env.EMAIL_FROM ?? 'Gatefold <noreply@gatefold.app>'

export async function sendDonorConfirmation({
  to,
  donorName,
  projectName,
  amount,
  currency,
  paymentId,
}: {
  to: string
  donorName: string
  projectName: string
  amount: number
  currency: string
  paymentId: string
}) {
  const resend = getResend()
  const formatted = new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount / 100)

  await resend.emails.send({
    from: FROM,
    to,
    subject: `Your support for "${subjectSafe(projectName)}" is confirmed`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1a1a1a">
        <p style="font-size:16px">Hi ${esc(donorName)},</p>
        <p style="font-size:16px">Thank you for supporting <strong>${esc(projectName)}</strong>.</p>
        <table style="width:100%;border-collapse:collapse;margin:24px 0">
          <tr><td style="padding:8px 0;color:#666;font-size:14px">Amount</td><td style="padding:8px 0;font-size:14px;font-weight:600">${formatted}</td></tr>
          <tr><td style="padding:8px 0;color:#666;font-size:14px">Reference</td><td style="padding:8px 0;font-size:14px;font-family:monospace">${esc(paymentId)}</td></tr>
        </table>
        <p style="font-size:14px;color:#666">Your payment was processed securely by Razorpay. Gatefold never stores your card details.</p>
        <p style="font-size:14px;color:#666">Keep this email as your payment record.</p>
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0"/>
        <p style="font-size:12px;color:#999">Gatefold · Secure payments by Razorpay (PCI-DSS Level 1)</p>
      </div>
    `,
  })
}

export async function sendViewNotification({
  to,
  projectName,
  country,
  pitchEditUrl,
}: {
  to: string
  projectName: string
  country: string | null
  pitchEditUrl: string
}) {
  const resend = getResend()
  const location = country ? ` from ${country}` : ''
  const time = new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', timeZoneName: 'short' })

  await resend.emails.send({
    from: FROM,
    to,
    subject: `Someone viewed "${subjectSafe(projectName)}"`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;color:#1a1a1a">
        <p style="font-size:16px">Someone viewed <strong>${esc(projectName)}</strong>${esc(location)}.</p>
        <p style="font-size:14px;color:#666">${time}</p>
        <p style="margin:24px 0">
          <a href="${esc(pitchEditUrl)}" style="background:#0A0A0A;color:#F5F5F5;padding:10px 20px;text-decoration:none;font-size:13px;display:inline-block">Open project →</a>
        </p>
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0"/>
        <p style="font-size:11px;color:#999">Gatefold · You're receiving this because you have view notifications enabled (Pro/Studio).</p>
      </div>
    `,
  })
}

export async function sendCreatorDonationAlert({
  to,
  creatorName,
  projectName,
  donorName,
  amount,
  currency,
  message,
  paymentId,
}: {
  to: string
  creatorName: string
  projectName: string
  donorName: string
  amount: number
  currency: string
  message?: string | null
  paymentId: string
}) {
  const resend = getResend()
  const formatted = new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount / 100)

  await resend.emails.send({
    from: FROM,
    to,
    subject: `${subjectSafe(donorName)} supported "${subjectSafe(projectName)}"`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1a1a1a">
        <p style="font-size:16px">Hi ${esc(creatorName)},</p>
        <p style="font-size:16px">You have a new supporter for <strong>${esc(projectName)}</strong>.</p>
        <table style="width:100%;border-collapse:collapse;margin:24px 0">
          <tr><td style="padding:8px 0;color:#666;font-size:14px">Supporter</td><td style="padding:8px 0;font-size:14px">${esc(donorName)}</td></tr>
          <tr><td style="padding:8px 0;color:#666;font-size:14px">Amount</td><td style="padding:8px 0;font-size:14px;font-weight:600">${formatted}</td></tr>
          ${message ? `<tr><td style="padding:8px 0;color:#666;font-size:14px">Message</td><td style="padding:8px 0;font-size:14px;font-style:italic">"${esc(message)}"</td></tr>` : ''}
          <tr><td style="padding:8px 0;color:#666;font-size:14px">Reference</td><td style="padding:8px 0;font-size:14px;font-family:monospace">${esc(paymentId)}</td></tr>
        </table>
        <p style="font-size:14px;color:#666">Payouts are processed within 7 business days to your registered bank account.</p>
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0"/>
        <p style="font-size:12px;color:#999">Gatefold · Secure payments by Razorpay (PCI-DSS Level 1)</p>
      </div>
    `,
  })
}
