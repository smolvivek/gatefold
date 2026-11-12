'use client'

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'

export interface PresentSlide {
  id: string
  node: ReactNode
}

interface PitchViewPresentProps {
  slides: PresentSlide[]
  exitHref: string
  projectName: string
}

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function PitchViewPresent({ slides, exitHref, projectName }: PitchViewPresentProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const slideRefs = useRef<(HTMLDivElement | null)[]>([])
  const [current, setCurrent] = useState(0)
  const router = useRouter()

  const scrollToSlide = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(slides.length - 1, index))
      const target = slideRefs.current[clamped]
      if (!target) return
      target.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' })
    },
    [slides.length]
  )

  // Tracks which slide is on screen so the counter and arrow-key navigation
  // stay correct even when a viewer scrolls with a trackpad instead of the
  // provided controls. Ratios are kept per slide: an observer callback only
  // reports slides whose ratio changed, so choosing among a single batch can
  // pick a slide that is leaving.
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const ratios = new Map<Element, number>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) ratios.set(entry.target, entry.intersectionRatio)
        let best = -1
        let bestRatio = 0
        slideRefs.current.forEach((el, i) => {
          const ratio = el ? ratios.get(el) ?? 0 : 0
          if (ratio > bestRatio) {
            best = i
            bestRatio = ratio
          }
        })
        if (best !== -1) setCurrent(best)
      },
      { root: container, threshold: [0, 0.25, 0.5, 0.6, 0.75, 1] }
    )
    slideRefs.current.forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [slides.length])

  useEffect(() => {
    // Moves within the current slide first when its content is taller than the
    // screen, and only changes slide once the edge is reached.
    function step(direction: 1 | -1) {
      const slide = slideRefs.current[current]
      if (slide) {
        const maxScroll = slide.scrollHeight - slide.clientHeight
        const canScroll = direction === 1 ? slide.scrollTop < maxScroll - 2 : slide.scrollTop > 2
        if (canScroll) {
          slide.scrollBy({
            top: direction * slide.clientHeight * 0.8,
            behavior: prefersReducedMotion() ? 'auto' : 'smooth',
          })
          return
        }
      }
      scrollToSlide(current + direction)
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (e.key === 'Escape') {
        router.push(exitHref)
        return
      }
      // Text fields and media controls own their keys. A focused button or
      // link only owns Space (activation), so arrows still navigate after a
      // viewer clicks Next/Previous or Exit.
      const target = e.target as HTMLElement | null
      if (target?.closest('input, textarea, select, video, audio, [contenteditable="true"]')) return
      if (e.key === ' ' && target?.closest('button, a')) return

      if (e.key === 'ArrowRight') {
        e.preventDefault()
        scrollToSlide(current + 1)
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        scrollToSlide(current - 1)
      } else if (e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault()
        step(1)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        step(-1)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [current, scrollToSlide, router, exitHref])

  return (
    <div className="fixed inset-0 bg-background z-[100]">
      <div
        ref={containerRef}
        className="h-full w-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: 'none' }}
      >
        {slides.map((slide, i) => (
          <div
            key={slide.id}
            ref={(el) => {
              slideRefs.current[i] = el
            }}
            className="h-screen w-full snap-start snap-always overflow-y-auto scrollbar-hide"
          >
            {slide.node}
          </div>
        ))}
      </div>

      <div className="fixed top-0 inset-x-0 flex justify-between items-center px-[24px] md:px-[48px] h-[56px] pointer-events-none z-[110]">
        <span className="font-heading font-bold italic text-[16px] text-text-primary/70 truncate pointer-events-auto">
          {projectName}
        </span>
        <a
          href={exitHref}
          className="font-mono text-[10px] tracking-[0.2em] uppercase text-text-disabled hover:text-text-primary transition-colors duration-[200ms] pointer-events-auto"
        >
          Esc · Exit
        </a>
      </div>

      <div className="fixed bottom-[24px] inset-x-0 flex flex-col items-center gap-[12px] z-[110] pointer-events-none">
        <span className="font-mono text-[10px] tracking-[0.2em] text-text-disabled pointer-events-auto">
          {String(current + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
        </span>
        <div className="flex items-center gap-[16px] pointer-events-auto">
          <button
            type="button"
            onClick={() => scrollToSlide(current - 1)}
            disabled={current === 0}
            aria-label="Previous section"
            className="w-[36px] h-[36px] border border-border flex items-center justify-center text-text-secondary disabled:opacity-20 hover:border-border-hover hover:text-text-primary transition-colors duration-[200ms]"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => scrollToSlide(current + 1)}
            disabled={current === slides.length - 1}
            aria-label="Next section"
            className="w-[36px] h-[36px] border border-border flex items-center justify-center text-text-secondary disabled:opacity-20 hover:border-border-hover hover:text-text-primary transition-colors duration-[200ms]"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M5 2L10 7L5 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
