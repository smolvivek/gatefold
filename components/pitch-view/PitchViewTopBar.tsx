// No per-section tabs: pitches carry a variable number of optional sections
// (moodboard, flow, script docs, …) and a tab row can't scale with them.
// The scroll is the navigation; the top bar keeps only the two things a
// reader always needs — where they are (name) and the one terminal action
// (funding, when it exists).

interface PitchViewTopBarProps {
  projectName: string
  version?: number
  hasFunding?: boolean
  topOffset?: string
  presentHref?: string
}

export function PitchViewTopBar({ projectName, version, hasFunding, topOffset, presentHref }: PitchViewTopBarProps) {
  return (
    <header className={`fixed ${topOffset ?? 'top-0'} w-full flex justify-between items-center px-[24px] md:px-[48px] h-[64px] bg-background/90 backdrop-blur-sm z-50 border-b border-hairline`}>
      {/* Project name */}
      <div className="font-heading font-bold italic text-[18px] tracking-tighter text-text-primary truncate">
        {projectName}
      </div>

      <div className="flex items-center gap-[32px]">
        {presentHref && (
          <a
            href={presentHref}
            className="font-mono text-[10px] tracking-[0.2em] uppercase text-text-disabled hover:text-text-primary transition-colors duration-[200ms]"
          >
            Present
          </a>
        )}
        {hasFunding && (
          <a
            href="#funding"
            className="font-mono text-[10px] tracking-[0.2em] uppercase text-text-disabled hover:text-text-primary transition-colors duration-[200ms]"
          >
            Funding
          </a>
        )}
        {version != null && (
          <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-text-disabled">
            V{version}
          </span>
        )}
      </div>
    </header>
  )
}
