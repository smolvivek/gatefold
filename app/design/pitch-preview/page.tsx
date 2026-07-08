// Design-review preview of the public pitch view (/p/[id]) with demo data.
// Exists so the redesign can be reviewed without a database connection.
// Dev-only (404s in production). Safe to delete after review.

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PitchViewLayout } from '@/components/pitch-view/PitchViewLayout'
import { PitchViewTopBar } from '@/components/pitch-view/PitchViewTopBar'
import { PitchViewHero } from '@/components/pitch-view/PitchViewHero'
import { PitchViewMetadata } from '@/components/pitch-view/PitchViewMetadata'
import { PitchViewSection } from '@/components/pitch-view/PitchViewSection'
import { PitchViewCards } from '@/components/pitch-view/PitchViewCards'
import { PitchViewFooter } from '@/components/pitch-view/PitchViewFooter'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'Pitch View Preview — Pitchcraft',
  robots: { index: false },
}

const POSTER =
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1600&q=80'

const VISION_IMAGES = [
  {
    url: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=1000&q=80',
    caption: 'Reference — projection, single source light',
  },
  {
    url: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1000&q=80',
    caption: 'Reference — the empty room as character',
  },
]

const LOGLINE =
  'A folklore archivist cataloguing abandoned estates begins finding her own handwriting in century-old journals she has never seen before.'

const SYNOPSIS = `Elin Voss archives what nobody wants: the diaries, letters and land records of estates left to rot. When the National Trust sends her to catalogue Grevlingholm — a manor sealed since 1911 — she finds the journals of the last owner meticulously kept, right up to the day the house was abandoned.

The handwriting is hers.

Word for word, the entries describe her childhood. Her mother's death. The scar on her left hand. As Elin reads deeper, the journals begin describing days that haven't happened yet — and the last entry, dated three weeks from now, is an apology addressed to her by name.`

const VISION = `Restraint as the primary technique. Every frame deliberate. Every silence earned.

Shot in natural light with a single camera position per scene — the camera never searches, it waits. The house is photographed like a portrait subject: frontal, patient, unblinking. Horror arrives by implication, in the corner of a static frame, never by cut.

Sound design carries what the image withholds. No score until the final reel.`

const CAST = [
  { name: 'Ingrid Sørensen', role: 'Elin Voss', detail: 'A archivist who trusts paper more than people — until the paper starts trusting her back.' },
  { name: 'Mikael Berg', role: 'Aksel Voss', detail: "Elin's brother. The only person who remembers their childhood differently." },
  { name: 'Liv Andersen', role: 'The Keeper', detail: 'Caretaker of Grevlingholm for forty years. Knows which rooms to leave locked.' },
]

const TEAM = [
  { name: 'Mara Holst', role: 'Director', detail: 'Two shorts in official selection at Locarno. This is her first feature.' },
  { name: 'Jonas Lindqvist', role: 'Director of Photography', detail: 'Shot the documentary White Silence. Natural-light specialist.' },
  { name: 'Sofia Reyes', role: 'Producer', detail: 'Produced three micro-budget features; two recouped through festival sales.' },
]

export default function PitchPreviewPage() {
  if (process.env.NODE_ENV === 'production') notFound()

  let sectionDelay = 0
  const delay = () => {
    sectionDelay++
    return `${sectionDelay * 80}ms`
  }

  return (
    <PitchViewLayout>
      <PitchViewTopBar projectName="The Uninvited" version={3} hasFunding />

      <div className="animate-fade-up opacity-0 [animation-fill-mode:forwards]" style={{ animationDelay: delay() }}>
        <PitchViewHero
          projectName="The Uninvited"
          logline={LOGLINE}
          posterUrl={POSTER}
          status="development"
          directorName="Mara Holst"
        />
      </div>

      <div className="animate-fade-up-subtle opacity-0 [animation-fill-mode:forwards]" style={{ animationDelay: delay() }}>
        <PitchViewMetadata
          genre="Fiction / Feature"
          budgetRange="250k-1m"
          status="development"
          funding={{ goal: 8000000, raised: 4200000 }}
        />
      </div>

      <div className="animate-fade-up-subtle opacity-0 [animation-fill-mode:forwards]" style={{ animationDelay: delay() }}>
        <PitchViewSection id="synopsis" title="Synopsis" index={1} content={SYNOPSIS} />
      </div>

      <div className="animate-fade-up-subtle opacity-0 [animation-fill-mode:forwards]" style={{ animationDelay: delay() }}>
        <PitchViewSection id="vision" title="Director's Vision" index={2} content={VISION} images={VISION_IMAGES} />
      </div>

      <div className="animate-fade-up-subtle opacity-0 [animation-fill-mode:forwards]" style={{ animationDelay: delay() }}>
        <PitchViewCards id="cast" title="Cast & Characters" index={3} items={CAST} variant="cast" />
      </div>

      <div className="animate-fade-up-subtle opacity-0 [animation-fill-mode:forwards]" style={{ animationDelay: delay() }}>
        <PitchViewCards id="team" title="Key Team" index={4} items={TEAM} variant="team" />
      </div>

      {/* Funding — static recreation of PitchViewFunding's display state.
          The live widget fetches from the funding API, which needs the database. */}
      <section id="funding" className="px-[24px] md:px-[96px] py-[96px] border-b border-hairline">
        <div className="max-w-[1200px] mx-auto grid grid-cols-12 gap-[48px]">
          <div className="col-span-12 md:col-span-2">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-pop font-bold md:sticky md:top-[88px]">
              Funding
            </p>
          </div>
          <div className="col-span-12 md:col-span-10">
            <h2 className="font-heading text-[clamp(40px,6vw,80px)] tracking-[-0.02em] text-text-primary leading-[1.0] mb-[48px]">
              Back this project.
            </h2>
            <div className="mb-[24px]">
              <p className="font-heading font-bold text-[clamp(40px,6vw,72px)] leading-[1] tracking-[-0.02em] text-text-primary">
                $42,000
              </p>
              <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-text-secondary mt-[8px] mb-[16px]">
                Raised of $80,000 · 23 supporters
              </p>
              <div className="h-[4px] bg-border overflow-hidden">
                <div className="h-full w-[52%] bg-pop led-pulse" />
              </div>
            </div>
            <div className="mb-[16px]">
              <Button variant="primary" type="button">
                Support this project
              </Button>
            </div>
            <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-text-disabled">
              Preview only — the live funding widget loads from the database
            </p>
          </div>
        </div>
      </section>

      <PitchViewFooter projectName="The Uninvited" />
    </PitchViewLayout>
  )
}
