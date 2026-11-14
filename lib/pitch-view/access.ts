import crypto from 'crypto'

// Any route that issues or checks a password-gate token must share this
// module — a route with its own copy could fall back to a predictable secret
// and let anyone bypass password-protected pitches.
if (process.env.NODE_ENV === 'production' && !process.env.PITCH_ACCESS_SECRET) {
  throw new Error('PITCH_ACCESS_SECRET must be set in production')
}

export const ACCESS_TOKEN_TTL_SECONDS = 24 * 60 * 60

export function accessCookieName(pitchId: string): string {
  return `pitch_access_${pitchId}`
}

function secret(): string {
  return process.env.PITCH_ACCESS_SECRET ?? 'dev-insecure-secret'
}

// Bound to the stored password hash, so changing or removing the password
// invalidates every token issued under the old one.
function sign(pitchId: string, expiresAt: number, passwordHash: string): string {
  const fingerprint = crypto.createHash('sha256').update(passwordHash).digest('hex').slice(0, 16)
  return crypto
    .createHmac('sha256', secret())
    .update(`${pitchId}.${expiresAt}.${fingerprint}`)
    .digest('hex')
}

export function makeAccessToken(pitchId: string, passwordHash: string): string {
  const expiresAt = Date.now() + ACCESS_TOKEN_TTL_SECONDS * 1000
  return `${expiresAt}.${sign(pitchId, expiresAt, passwordHash)}`
}

export function verifyAccessToken(pitchId: string, passwordHash: string, token: string): boolean {
  const [expiresRaw, signature, ...rest] = token.split('.')
  if (!expiresRaw || !signature || rest.length > 0) return false
  const expiresAt = Number(expiresRaw)
  if (!Number.isFinite(expiresAt) || expiresAt < Date.now()) return false

  const expected = Buffer.from(sign(pitchId, expiresAt, passwordHash))
  const actual = Buffer.from(signature)
  return actual.length === expected.length && crypto.timingSafeEqual(actual, expected)
}
