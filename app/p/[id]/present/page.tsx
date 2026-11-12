import { notFound, redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { after } from 'next/server'
import type { ReactNode } from 'react'
import type { FlowBeat } from '@/lib/types/pitch'
import { recordView } from '@/lib/views/record'
import {
  resolveIdOrSlug,
  isPasswordVerified,
  isPitchOwner,
  getShareLinkInfo,
  fetchPitchData,
  buildPitchViewModel,
} from '@/lib/pitch-view/data'
import { PitchViewHero } from '@/components/pitch-view/PitchViewHero'
import { PitchViewSection } from '@/components/pitch-view/PitchViewSection'
import { PitchViewCards } from '@/components/pitch-view/PitchViewCards'
import { PitchViewFlow } from '@/components/pitch-view/PitchViewFlow'
import { PitchViewPresent, type PresentSlide } from '@/components/pitch-view/PitchViewPresent'

interface PageProps {
  params: Promise<{ id: string }>
}

// Same content as /p/[id] — not a distinct page for search purposes.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

// Mirrors the null-check PitchViewSection applies internally (see that
// component) — kept in sync here so an "empty" section never becomes a
// blank full-screen slide instead of just quietly not rendering.
function hasSectionContent(
  content?: string,
  images?: { url: string }[],
  videoUrl?: string,
  pdf?: unknown
): boolean {
  return !!content || (images?.length ?? 0) > 0 || !!videoUrl || !!pdf
}

function slideWrap(node: ReactNode) {
  return <div className="min-h-screen w-full flex items-center justify-center">{node}</div>
}

export default async function PitchPresentPage({ params }: PageProps) {
  const { id: rawId } = await params
  const id = await resolveIdOrSlug(rawId)
  if (!id) notFound()

  const linkInfo = await getShareLinkInfo(id)
  if (!linkInfo) notFound()

  // Presentation mode never shows anything /p/[id] itself wouldn't. Private
  // pitches and unverified password gates redirect back to the normal view,
  // which already owns the access-control UI for both cases — duplicating
  // that UI here would be a second place for an auth bypass to hide.
  if (linkInfo.visibility === 'private') {
    redirect(`/p/${rawId}`)
  }

  if (linkInfo.hasPassword && !(await isPasswordVerified(id))) {
    redirect(`/p/${rawId}`)
  }

  const data = await fetchPitchData(id)
  if (!data) notFound()

  const { pitch, sections, media } = data
  const { castItems, teamItems, directorMember, mediaBySectionMap, mediaById, sectionLabels, posterMedia } =
    buildPitchViewModel(pitch, sections, media)

  // Owner views don't count toward analytics (mirrors /p/[id]).
  const isOwner = await isPitchOwner(pitch.user_id)

  const reqHeaders = await headers()
  const ip = reqHeaders.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '0.0.0.0'
  const country = reqHeaders.get('x-vercel-ip-country') ?? null
  after(() => recordView({ pitchId: id, ownerUserId: pitch.user_id, ip, country, isOwner }))

  const slides: PresentSlide[] = [
    {
      id: 'hero',
      node: (
        <PitchViewHero
          projectName={pitch.project_name}
          logline={pitch.logline}
          posterUrl={posterMedia?.signedUrl}
          status={pitch.status}
          directorName={directorMember?.name}
        />
      ),
    },
  ]

  if (hasSectionContent(pitch.synopsis)) {
    slides.push({
      id: 'synopsis',
      node: slideWrap(<PitchViewSection title="Synopsis" index={1} content={pitch.synopsis} />),
    })
  }

  const visionImages = mediaBySectionMap.get('vision')?.map((m) => ({ url: m.signedUrl, caption: m.caption }))
  if (hasSectionContent(pitch.vision, visionImages)) {
    slides.push({
      id: 'vision',
      node: slideWrap(
        <PitchViewSection title="Director's Vision" index={2} content={pitch.vision} images={visionImages} />
      ),
    })
  }

  if (castItems.length > 0) {
    slides.push({
      id: 'cast',
      node: slideWrap(<PitchViewCards title="Cast & Characters" index={3} items={castItems} variant="cast" />),
    })
  } else if (hasSectionContent(pitch.cast_and_characters)) {
    slides.push({
      id: 'cast',
      node: slideWrap(<PitchViewSection title="Cast & Characters" index={3} content={pitch.cast_and_characters} />),
    })
  }

  if (teamItems.length > 0) {
    slides.push({
      id: 'team',
      node: slideWrap(<PitchViewCards title="Key Team" index={4} items={teamItems} variant="team" />),
    })
  } else if (hasSectionContent(pitch.team)) {
    slides.push({
      id: 'team',
      node: slideWrap(<PitchViewSection title="Key Team" index={4} content={pitch.team} />),
    })
  }

  sections.forEach((section, optIdx) => {
    const title = section.data.title || sectionLabels.get(section.section_name) || section.section_name
    const sectionMedia = mediaBySectionMap.get(section.section_name)

    const pdfMedia = sectionMedia?.find(
      (m) => m.file_type?.startsWith('application/pdf') || m.storage_path?.endsWith('.pdf')
    )
    const imageMedia = sectionMedia?.filter(
      (m) => !(m.file_type?.startsWith('application/pdf') || m.storage_path?.endsWith('.pdf'))
    )

    if (section.section_name === 'flow' && section.data.beats && section.data.beats.length > 0) {
      const flowBeats = (section.data.beats as FlowBeat[]).map((beat) => ({
        id: beat.id,
        caption: beat.caption,
        arcLabel: beat.arcLabel,
        imageUrls: beat.mediaIds.map((mid) => mediaById.get(mid)).filter((url): url is string => !!url),
        videoUrl: beat.videoUrl,
        audioUrl: beat.audioUrl,
      }))
      slides.push({ id: section.id, node: slideWrap(<PitchViewFlow beats={flowBeats} />) })
      return
    }

    const images = imageMedia?.map((m) => ({ url: m.signedUrl, caption: m.caption }))
    if (!hasSectionContent(section.data.content, images, section.data.videoUrl, pdfMedia)) return

    slides.push({
      id: section.id,
      node: slideWrap(
        <PitchViewSection
          title={title}
          index={5 + optIdx}
          content={section.data.content}
          images={images}
          videoUrl={section.data.videoUrl}
          pdf={
            pdfMedia
              ? {
                  url: pdfMedia.signedUrl,
                  label: section.section_name === 'script_documents' ? 'View Screenplay' : 'View PDF',
                }
              : null
          }
        />
      ),
    })
  })

  return <PitchViewPresent slides={slides} exitHref={`/p/${rawId}`} projectName={pitch.project_name} />
}
