import Image from 'next/image'
import { Badge, type StatusType } from '@/components/ui/Badge'

const KNOWN_STATUSES: StatusType[] = ['development', 'production', 'completed']

interface PitchViewHeroProps {
  projectName: string
  logline: string
  posterUrl?: string | null
  status?: string
  directorName?: string
}

export function PitchViewHero({ projectName, logline, posterUrl, status, directorName }: PitchViewHeroProps) {
  const knownStatus = KNOWN_STATUSES.find((s) => s === status)

  return (
    <section className="relative min-h-screen flex flex-col justify-end px-[24px] md:px-[96px] pb-[96px] overflow-hidden">
      {/* Background — the poster is the hero; warm, not manipulated */}
      <div className="absolute inset-0 z-0">
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt={`${projectName} poster`}
            fill
            className="object-cover opacity-60"
            sizes="100vw"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-background" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      {/* Status badge — top right, LED pulse when actively looking */}
      {knownStatus && (
        <div className="absolute top-[88px] right-[24px] md:right-[96px] z-10">
          <Badge status={knownStatus} />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 max-w-[1200px] space-y-[32px]">
        {/* Title */}
        <h1 className="font-heading font-bold text-[clamp(64px,14vw,200px)] leading-[0.85] tracking-[-0.03em] uppercase text-text-primary break-words">
          {projectName}
        </h1>

        {/* Director + logline grid */}
        {(directorName || logline) && (
          <div className="grid grid-cols-12 gap-[32px] pt-[48px] border-t border-hairline">
            {/* Left: director */}
            {directorName && (
              <div className="col-span-12 md:col-span-4">
                <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-text-disabled mb-[8px]">
                  Director
                </p>
                <p className="font-heading text-[22px] text-text-primary leading-[1.1]">
                  {directorName}
                </p>
              </div>
            )}

            {/* Right: logline */}
            {logline && (
              <div className={directorName ? 'col-span-12 md:col-span-8' : 'col-span-12'}>
                <p className="border-l border-pop/30 pl-[24px] font-heading italic text-[22px] md:text-[28px] leading-[1.4] text-text-primary/80 max-w-[680px]">
                  {logline}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
