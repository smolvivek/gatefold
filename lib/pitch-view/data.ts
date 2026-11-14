import { cookies } from 'next/headers'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { getFundingTotals } from '@/lib/funding/totals'
import type { Pitch, PitchSection, MediaRecord } from '@/lib/types/pitch'
import { OPTIONAL_SECTIONS } from '@/lib/sections'
import { accessCookieName, verifyAccessToken } from './access'

/** True when the request carries a valid, unexpired password-gate cookie for this pitch. */
export async function isPasswordVerified(pitchId: string): Promise<boolean> {
  const cookieStore = await cookies()
  const accessCookie = cookieStore.get(accessCookieName(pitchId))
  if (!accessCookie) return false

  const { data: shareLink } = await createAdminClient()
    .from('share_links')
    .select('password_hash')
    .eq('pitch_id', pitchId)
    .is('deleted_at', null)
    .single()
  if (!shareLink?.password_hash) return false

  return verifyAccessToken(pitchId, shareLink.password_hash, accessCookie.value)
}

/**
 * Whether the signed-in viewer owns the pitch. Non-critical: on any error the
 * viewer is treated as a non-owner so the page still renders.
 */
export async function isPitchOwner(pitchOwnerId: string): Promise<boolean> {
  try {
    const userSupabase = await createClient()
    const { data: { user } } = await userSupabase.auth.getUser()
    if (!user) return false
    const { data: profile } = await createAdminClient()
      .from('users')
      .select('id')
      .eq('auth_id', user.id)
      .single()
    return profile?.id === pitchOwnerId
  } catch (err) {
    console.error('Owner check failed (treated as non-owner):', err)
    return false
  }
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function resolveIdOrSlug(idOrSlug: string): Promise<string | null> {
  if (UUID_REGEX.test(idOrSlug)) return idOrSlug

  const supabase = createAdminClient()
  const { data } = await supabase
    .from('pitches')
    .select('id')
    .eq('slug', idOrSlug)
    .is('deleted_at', null)
    .single()

  return data?.id ?? null
}

export type ShareLinkInfo = {
  visibility: string
  hasPassword: boolean
}

export async function getShareLinkInfo(pitchId: string): Promise<ShareLinkInfo | null> {
  const supabase = createAdminClient()

  const { data: shareLink } = await supabase
    .from('share_links')
    .select('visibility, password_hash')
    .eq('pitch_id', pitchId)
    .is('deleted_at', null)
    .single()

  if (!shareLink) return null

  return {
    visibility: shareLink.visibility,
    hasPassword: !!shareLink.password_hash,
  }
}

export async function fetchPitchData(pitchId: string, { includeFunding = false } = {}) {
  const supabase = createAdminClient()

  const { data: pitch } = await supabase
    .from('pitches')
    .select('*')
    .eq('id', pitchId)
    .is('deleted_at', null)
    .single()

  if (!pitch) return null

  const fetchFunding = async (): Promise<{ goal: number; raised: number } | null> => {
    const { data: fundingRow } = await supabase
      .from('funding')
      .select('id, funding_goal')
      .eq('pitch_id', pitchId)
      .maybeSingle()
    if (!fundingRow) return null
    let raised = 0
    try {
      raised = (await getFundingTotals(supabase, fundingRow.id)).raised
    } catch (err) {
      // Hide the funding widget rather than show a wrong total
      console.error('Funding totals failed:', err)
      return null
    }
    return { goal: fundingRow.funding_goal, raised }
  }

  // Funding summary is opt-in: only the public view renders it (and only for
  // public links), so metadata and presentation mode skip those two queries.
  const [{ data: sections }, { data: media }, funding] = await Promise.all([
    supabase
      .from('pitch_sections')
      .select('*')
      .eq('pitch_id', pitchId)
      .order('order_index', { ascending: true }),
    supabase
      .from('media')
      .select('*')
      .eq('pitch_id', pitchId)
      .order('order_index', { ascending: true }),
    includeFunding ? fetchFunding() : Promise.resolve(null),
  ])

  const mediaWithUrls: (MediaRecord & { signedUrl: string })[] = []
  if (media && media.length > 0) {
    const urlPromises = media.map(async (m: MediaRecord) => {
      const { data } = await supabase.storage
        .from('pitch-assets')
        .createSignedUrl(m.storage_path, 604800) // 7 days
      return { ...m, signedUrl: data?.signedUrl ?? '' }
    })
    const resolved = await Promise.all(urlPromises)
    mediaWithUrls.push(...resolved.filter((m) => m.signedUrl))
  }

  return {
    pitch: pitch as Pitch,
    sections: (sections ?? []) as PitchSection[],
    media: mediaWithUrls,
    funding,
  }
}

export function parseCardItems(text: string): { name: string; role: string; detail?: string }[] {
  try {
    const parsed = JSON.parse(text)
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter((item: Record<string, unknown>) => item.name && item.role)
      .map((item: Record<string, string>) => ({
        name: item.name,
        role: item.role,
        detail: item.description || item.bio,
      }))
  } catch {
    return []
  }
}

type MediaWithUrl = MediaRecord & { signedUrl: string }

/**
 * Shapes raw pitch/sections/media rows into the lookups every pitch-content
 * renderer needs (the public view and presentation mode both consume this,
 * so the two stay in sync by construction rather than by copy-paste).
 */
export function buildPitchViewModel(pitch: Pitch, sections: PitchSection[], media: MediaWithUrl[]) {
  const castItems = parseCardItems(pitch.cast_and_characters)
  const teamItems = parseCardItems(pitch.team)

  const directorMember = teamItems.find((t) =>
    t.role.toLowerCase().includes('director')
  )

  const mediaBySectionMap = new Map<string, MediaWithUrl[]>()
  const mediaById = new Map<string, string>()
  for (const m of media) {
    mediaById.set(m.id, m.signedUrl)
    const key = m.section_name ?? '__none__'
    if (!mediaBySectionMap.has(key)) mediaBySectionMap.set(key, [])
    mediaBySectionMap.get(key)!.push(m)
  }

  const posterMedia = media.find(
    (m) => m.section_name === 'poster' || (!m.section_name && m.file_type === 'image')
  )

  const sectionLabels = new Map<string, string>()
  for (const def of OPTIONAL_SECTIONS) {
    sectionLabels.set(def.key, def.label)
  }

  return {
    castItems,
    teamItems,
    directorMember,
    mediaBySectionMap,
    mediaById,
    posterMedia,
    sectionLabels,
  }
}
