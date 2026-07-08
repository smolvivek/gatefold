"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

import { PulseDot } from "@/components/ui/PulseDot";
import { playClick } from "@/lib/sound/click";
import { motion, MotionConfig, AnimatePresence } from "framer-motion";

// ── Demo project data ────────────────────────────────────────────────────────

interface DemoProject {
  slug: string; title: string; director: string; logline: string;
  genre: string; genreShort: string; status: string; budget: string;
  posterImg: string; posterFallback: string;
  cast: { role: string; name: string }[];
}

const demoProjects: DemoProject[] = [
  {
    slug: "the-uninvited", title: "The Uninvited", director: "Mara Holst",
    logline: "A folklore archivist cataloguing abandoned estates begins finding her own handwriting in century-old journals she has never seen before.",
    genre: "Fiction / Feature", genreShort: "Fiction", status: "Development", budget: "$250K–$1M",
    posterImg: "https://cdn2.picryl.com/photo/1921/12/31/nosferatu-original-poster-1921-325722-1024.jpg",
    posterFallback: "linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 40%, #262626 60%, #0A0A0A 100%)",
    cast: [
      { role: "Elin Voss", name: "Ingrid Sørensen" },
      { role: "Aksel Voss", name: "Mikael Berg" },
      { role: "The Keeper", name: "Liv Andersen" },
    ],
  },
  {
    slug: "white-silence", title: "White Silence", director: "Anika Strand",
    logline: "A glaciologist documents the final winter before the Antarctic shelf she's studied for a decade breaks off into the sea.",
    genre: "Documentary / Feature", genreShort: "Documentary", status: "In Production", budget: "$50K–$250K",
    posterImg: "https://upload.wikimedia.org/wikipedia/commons/0/05/Antarctic_Sound-2016-Iceberg_02.jpg",
    posterFallback: "linear-gradient(145deg, #0A1C2E 0%, #0D2B40 30%, #1A4A6B 55%, #0A1C2E 100%)",
    cast: [
      { role: "Subject", name: "Dr. Anika Strand" },
      { role: "Narrator", name: "Elias Krogh" },
      { role: "Field Team", name: "Nordkapp Unit" },
    ],
  },
  {
    slug: "monsoon-estrella", title: "Monsoon", director: "Kiran Patel",
    logline: "A 60-second spot — one continuous shot following a bottle of cold beer through a monsoon street party in Mumbai.",
    genre: "Ad Film / Campaign", genreShort: "Ad Film", status: "Development", budget: "$5K–$50K",
    posterImg: "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&w=800&q=80",
    posterFallback: "linear-gradient(150deg, #0A1628 0%, #0D3B66 35%, #1B6B93 55%, #0A1628 100%)",
    cast: [
      { role: "Talent", name: "Rohan Iyer" },
      { role: "Voiceover", name: "Priya Nair" },
      { role: "Choreography", name: "Studio Varsha" },
    ],
  },
]

// ── Hero pitch preview ────────────────────────────────────────────────────────
// Renders the real pitch-view visual language scaled down via CSS transform.
// The inner div is written at 1280px wide and scaled to fill the column —
// so the poster fills its background, the title is large, nothing is cropped.

// Each project holds until its full-page scroll completes, then advances.
const DEMO_CYCLE_MS = 15000

function HeroPitchDemo() {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => setActiveIndex((p) => (p + 1) % demoProjects.length), DEMO_CYCLE_MS)
    return () => clearTimeout(t)
  }, [activeIndex])

  const p = demoProjects[activeIndex]
  // Higher scale (0.52) so content is legible — container clips and scrolls to reveal all sections
  const scale = 0.52
  const INNER_W = 1280
  const INNER_H = 1750
  const containerH = 390
  const scaledH = Math.round(INNER_H * scale)
  const scrollAmount = scaledH - containerH

  return (
    <div className="w-full">
      {/* Genre tabs */}
      <div className="flex items-center gap-[20px] mb-[12px]">
        {demoProjects.map((proj, i) => (
          <button
            key={proj.slug}
            onClick={() => setActiveIndex(i)}
            className="font-mono text-[9px] tracking-[0.12em] uppercase transition-colors duration-[200ms] pb-[3px]"
            style={{
              color: i === activeIndex ? "var(--color-text-primary)" : "var(--color-text-disabled)",
              borderBottom: i === activeIndex ? "1px solid var(--color-text-primary)" : "1px solid transparent",
            }}
          >
            {proj.genreShort}
          </button>
        ))}
      </div>

      {/* Browser chrome */}
      <div className="flex items-center gap-[6px] border border-border border-b-0 bg-surface px-[12px] h-[32px]">
        <span className="w-[7px] h-[7px] rounded-full bg-border" aria-hidden="true" />
        <span className="w-[7px] h-[7px] rounded-full bg-border" aria-hidden="true" />
        <span className="w-[7px] h-[7px] rounded-full bg-border" aria-hidden="true" />
        <span className="ml-[10px] flex-1 min-w-0 truncate bg-background px-[10px] py-[3px] font-mono text-[9px] text-text-disabled">
          pitchcraft.app/p/{p.slug}
        </span>
      </div>

      {/* Full-page pitch preview — clips content and auto-scrolls to reveal all sections */}
      <div
        className="border border-border bg-background overflow-hidden"
        style={{ position: 'relative', height: `${containerH}px` }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%' }}
          >
            {/* Scroll animation — one full pass per project: hold on hero,
                scroll through every section, hold on funding, then crossfade */}
            <motion.div
              animate={{ y: [0, 0, -scrollAmount, -scrollAmount] }}
              transition={{ duration: 14.2, times: [0, 0.09, 0.87, 1], ease: 'easeInOut' }}
            >
              <div
                style={{
                  width: `${INNER_W}px`,
                  height: `${INNER_H}px`,
                  transform: `scale(${scale})`,
                  transformOrigin: 'top left',
                }}
              >
            {/* ── TopBar ── */}
            <header style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '20px 96px', height: '64px',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
              background: 'var(--color-background)',
            }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontStyle: 'italic', fontSize: 18, letterSpacing: '-0.02em', color: 'var(--color-text-primary)' }}>
                {p.title}
              </span>
              <nav style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
                <span style={{ fontFamily: 'monospace', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-text-disabled)' }}>Funding</span>
                <span style={{ fontFamily: 'monospace', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-text-disabled)' }}>V3</span>
              </nav>
            </header>

            {/* ── Hero ── */}
            <div style={{ position: 'relative', height: '380px', background: p.posterFallback }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.posterImg}
                alt=""
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%', opacity: 0.6 }}
                loading="lazy"
              />
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, #0A0A0A 0%, rgba(10,10,10,0.55) 45%, rgba(10,10,10,0.1) 100%)',
              }} />
              <div style={{ position: 'absolute', top: 24, right: 96, display: 'flex', alignItems: 'center', gap: 8, border: '1px solid var(--color-pop)', padding: '6px 10px' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-pop)', display: 'block' }} />
                <span style={{ fontFamily: 'monospace', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-pop)' }}>{p.status}</span>
              </div>
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 96px 48px' }}>
                <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 96, lineHeight: 0.87, letterSpacing: '-0.03em', textTransform: 'uppercase', color: 'var(--color-text-primary)', marginBottom: 28 }}>
                  {p.title}
                </h1>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 28, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <div>
                    <p style={{ fontFamily: 'monospace', fontSize: 8, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--color-text-disabled)', marginBottom: 6 }}>Director</p>
                    <p style={{ fontFamily: 'var(--font-heading)', fontSize: 20, lineHeight: 1.1, color: 'var(--color-text-primary)' }}>{p.director}</p>
                  </div>
                  <div style={{ borderLeft: '1px solid rgba(245,200,48,0.3)', paddingLeft: 20 }}>
                    <p style={{ fontFamily: 'var(--font-heading)', fontSize: 18, lineHeight: 1.55, fontStyle: 'italic', color: 'rgba(240,237,232,0.75)' }}>{p.logline}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Metadata strip ── */}
            <div style={{ display: 'flex', gap: 64, padding: '24px 96px', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'var(--color-surface)' }}>
              {[['Genre', p.genre], ['Budget', p.budget], ['Status', p.status]].map(([label, val], i) => (
                <div key={label}>
                  <p style={{ fontFamily: 'monospace', fontSize: 8, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-text-disabled)', marginBottom: 5 }}>{label}</p>
                  <p style={{ fontFamily: 'monospace', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: i === 2 ? 'var(--color-pop)' : 'var(--color-text-primary)' }}>{val}</p>
                </div>
              ))}
            </div>

            {/* ── Synopsis section ── */}
            <div style={{ padding: '72px 96px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 48 }}>
                <div>
                  <p style={{ fontFamily: 'monospace', fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--color-pop)', fontWeight: 700 }}>01</p>
                </div>
                <div>
                  <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 52, lineHeight: 1.0, letterSpacing: '-0.02em', color: 'var(--color-text-primary)', marginBottom: 20, fontWeight: 400 }}>Synopsis</h2>
                  <p style={{ fontSize: 17, lineHeight: 1.8, color: 'var(--color-text-secondary)', maxWidth: 640 }}>{p.logline} A project built to be presented, not forwarded as a PDF.</p>
                </div>
              </div>
            </div>

            {/* ── Vision section ── */}
            <div style={{ padding: '72px 96px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 48 }}>
                <div>
                  <p style={{ fontFamily: 'monospace', fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--color-pop)', fontWeight: 700 }}>02</p>
                </div>
                <div>
                  <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 52, lineHeight: 1.0, letterSpacing: '-0.02em', color: 'var(--color-text-primary)', marginBottom: 20, fontWeight: 400 }}>Director&apos;s Vision</h2>
                  <p style={{ fontSize: 17, lineHeight: 1.8, color: 'var(--color-text-secondary)', maxWidth: 640 }}>
                    Restraint as the primary technique. Every frame deliberate. Every silence earned. Shot in natural light with a single camera position per scene.
                  </p>
                </div>
              </div>
            </div>

            {/* ── Cast section ── */}
            <div style={{ padding: '72px 96px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 48 }}>
                <div>
                  <p style={{ fontFamily: 'monospace', fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--color-pop)', fontWeight: 700 }}>03</p>
                </div>
                <div>
                  <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 52, lineHeight: 1.0, letterSpacing: '-0.02em', color: 'var(--color-text-primary)', marginBottom: 28, fontWeight: 400 }}>Cast &amp; Characters</h2>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, maxWidth: 720 }}>
                    {p.cast.map((c) => (
                      <div key={c.name}>
                        <div style={{ height: 150, background: 'var(--color-surface-hover)', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'flex-end', padding: 12, marginBottom: 12 }}>
                          <span style={{ fontFamily: 'var(--font-heading)', fontSize: 48, lineHeight: 1, letterSpacing: '-0.04em', color: 'rgba(84,82,80,0.35)' }}>{c.name.charAt(0)}</span>
                        </div>
                        <p style={{ fontFamily: 'monospace', fontSize: 8, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-pop)', fontWeight: 700, marginBottom: 6 }}>{c.role}</p>
                        <p style={{ fontFamily: 'var(--font-heading)', fontSize: 18, lineHeight: 1.1, color: 'var(--color-text-primary)' }}>{c.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Funding widget ── */}
            <div style={{ padding: '64px 96px', background: 'var(--color-surface)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 48 }}>
                <div>
                  <p style={{ fontFamily: 'monospace', fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--color-pop)', fontWeight: 700 }}>Fund</p>
                </div>
                <div>
                  <p style={{ fontFamily: 'var(--font-heading)', fontSize: 48, lineHeight: 1.0, letterSpacing: '-0.02em', color: 'var(--color-text-primary)', marginBottom: 6, fontWeight: 700 }}>$42,000</p>
                  <p style={{ fontFamily: 'monospace', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-text-disabled)', marginBottom: 20 }}>Raised of $80,000 · 23 backers</p>
                  <div style={{ height: 4, background: 'rgba(255,255,255,0.07)', marginBottom: 8 }}>
                    <div style={{ height: '100%', width: '52%', background: 'var(--color-pop)' }} />
                  </div>
                </div>
              </div>
            </div>

              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

// ── Feature UI mocks ─────────────────────────────────────────────────────────
// Real product interface recreations, not icons or illustrations.

function EditorMock() {
  const sections = [
    { n: "01", label: "Logline", active: false },
    { n: "02", label: "Synopsis", active: true },
    { n: "03", label: "Vision", active: false },
    { n: "04", label: "Cast", active: false },
    { n: "05", label: "Budget", active: false },
  ]
  return (
    <div className="border border-border bg-background flex" aria-hidden="true">
      {/* Sidebar — editorial step sequencer */}
      <div className="w-[150px] md:w-[168px] shrink-0 bg-surface border-r border-hairline py-[16px]">
        {sections.map((s) => (
          <div
            key={s.n}
            className={`flex items-baseline gap-[6px] px-[16px] py-[12px] border-l-2 ${s.active ? "border-pop" : "border-transparent"}`}
          >
            <span className={`font-mono text-[10px] font-bold uppercase tracking-[0.15em] ${s.active ? "text-pop led-pulse" : "text-text-disabled"}`}>
              {s.n}
            </span>
            <span className={`font-mono text-[10px] font-bold uppercase tracking-[0.15em] ${s.active ? "text-pop" : "text-text-disabled"}`}>
              / {s.label}
            </span>
          </div>
        ))}
      </div>
      {/* Writing surface */}
      <div className="flex-1 min-w-0 p-[24px] md:p-[32px]">
        <p className="font-heading text-[24px] text-text-primary leading-[1.1] mb-[20px]">The Weight of Water</p>
        <div className="space-y-[10px] mb-[28px]">
          <div className="h-[7px] bg-text-primary/10 w-full" />
          <div className="h-[7px] bg-text-primary/10 w-[92%]" />
          <div className="h-[7px] bg-text-primary/10 w-[97%]" />
          <div className="h-[7px] bg-text-primary/10 w-[58%]" />
        </div>
        <p className="font-mono text-[10px] text-text-disabled">Saved — looks good.</p>
      </div>
    </div>
  )
}

function ShareMock() {
  const options = [
    { label: "Public", note: "Anyone with the link", selected: true },
    { label: "Private", note: "Only you", selected: false },
    { label: "Password", note: "Pro / Studio", selected: false },
  ]
  return (
    <div className="border border-border bg-surface p-[24px] md:p-[32px] space-y-[24px]" aria-hidden="true">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-text-secondary font-bold">Share this draft</p>
        <span className="border border-accent px-[8px] py-[3px] font-mono text-[9px] uppercase tracking-[0.15em] text-accent-hover">V3</span>
      </div>
      <div className="flex items-stretch border border-border bg-background">
        <span className="flex-1 min-w-0 truncate px-[14px] py-[12px] font-mono text-[11px] text-text-primary">
          pitchcraft.app/p/the-weight-of-water
        </span>
        <span className="flex items-center border-l border-border px-[14px] font-mono text-[9px] uppercase tracking-[0.15em] text-text-secondary">
          Copy
        </span>
      </div>
      <div>
        {options.map((o) => (
          <div
            key={o.label}
            className={`flex items-center justify-between px-[14px] py-[12px] ${o.selected ? "bg-background border border-border" : ""}`}
          >
            <span className="flex items-center gap-[10px]">
              <span className={`w-[6px] h-[6px] rounded-full ${o.selected ? "bg-pop" : "bg-border"}`} />
              <span className={`font-mono text-[10px] uppercase tracking-[0.15em] ${o.selected ? "text-text-primary" : "text-text-disabled"}`}>
                {o.label}
              </span>
            </span>
            <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-text-disabled">{o.note}</span>
          </div>
        ))}
      </div>
      <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-text-disabled">Revoke access</p>
    </div>
  )
}

function FundMock() {
  const goals = [
    { amt: "$10K", label: "Principal photography", reached: true },
    { amt: "$50K", label: "Festival run", reached: false },
    { amt: "$80K", label: "Final mix", reached: false },
  ]
  return (
    <div className="border border-border bg-surface p-[24px] md:p-[32px]" aria-hidden="true">
      <p className="font-heading italic font-bold text-[16px] tracking-tighter text-text-primary mb-[24px]">
        The Weight of Water
      </p>
      <p className="font-heading font-bold text-[48px] leading-[1] tracking-[-0.02em] text-text-primary">$42,000</p>
      <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-text-disabled mt-[8px] mb-[16px]">
        Raised of $80,000 · 23 backers
      </p>
      <div className="h-[4px] bg-text-primary/10 mb-[28px]">
        <div className="h-full w-[52%] bg-pop led-pulse" />
      </div>
      <div className="space-y-[10px]">
        {goals.map((g) => (
          <div key={g.amt} className="flex items-baseline gap-[16px]">
            <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-text-secondary w-[40px] shrink-0">
              {g.amt}
            </span>
            <span className={`font-mono text-[10px] uppercase tracking-[0.1em] ${g.reached ? "text-text-primary" : "text-text-disabled"}`}>
              {g.label}
              {g.reached && <span className="text-pop"> ✓</span>}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Main component ───────────────────────────────────────────────────────────

const primaryCta =
  "inline-flex items-center gap-[12px] bg-pop text-background px-[32px] py-[16px] font-heading text-[14px] font-bold uppercase tracking-tighter hover:bg-pop-hover active:scale-[0.98] transition-all duration-200 led-pulse-subtle"
const secondaryCta =
  "inline-flex items-center gap-[12px] border border-border text-text-primary px-[32px] py-[16px] font-heading text-[14px] font-bold uppercase tracking-tighter hover:border-pop transition-colors duration-200"

export function LandingHero() {
  return (
    <MotionConfig reducedMotion="user">
      <>
        {/* ── HERO ── */}
        <section className="relative overflow-hidden px-[24px] md:px-[48px] pt-[152px] pb-[100px]">
          <div className="max-w-[1200px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-[64px] items-start">

              {/* Left: Headline + CTA */}
              <div className="md:col-span-5">
                <div className="animate-fade-up opacity-0 [animation-fill-mode:forwards]">
                  <h1 className="font-heading text-[clamp(40px,7vw,96px)] leading-[0.92] tracking-[-0.03em] text-text-primary mb-[8px]">
                    <span className="block">Present your work.</span>
                    <span className="block">Fund your vision.</span>
                    <span className="block italic text-pop">Properly.</span>
                  </h1>
                </div>

                <div
                  className="animate-fade-up opacity-0 [animation-fill-mode:forwards]"
                  style={{ animationDelay: "80ms" }}
                >
                  <div className="h-[1px] bg-hairline mb-[32px]" />
                  <p className="text-text-secondary leading-[26px] text-[16px] mb-[40px] max-w-[380px]">
                    One link for your entire project — logline, cast, budget,
                    and funding. Share it with producers. Version it. Fund through it.
                  </p>
                </div>

                <div
                  className="flex flex-col sm:flex-row gap-[16px] items-start animate-fade-up opacity-0 [animation-fill-mode:forwards]"
                  style={{ animationDelay: "160ms" }}
                >
                  <Link href="/signup" onClick={() => playClick()} className={primaryCta}>
                    Create your first project
                    <span aria-hidden="true">→</span>
                  </Link>
                  <Link href="/pricing" className={secondaryCta}>
                    See pricing
                  </Link>
                </div>
              </div>

              {/* Right: Live pitch page demo */}
              <div
                className="md:col-span-7 min-w-0 animate-fade-up opacity-0 [animation-fill-mode:forwards]"
                style={{ animationDelay: "240ms" }}
              >
                <HeroPitchDemo />
              </div>
            </div>
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section className="px-[24px] md:px-[48px] py-[96px] border-t border-hairline bg-background">
          <div className="max-w-[1200px] mx-auto">
            <div className="flex justify-end border-b border-hairline pb-[24px] mb-[96px]">
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-pop font-bold">
                01 / Features
              </span>
            </div>

            {/* Row 1 — Build */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[64px] items-center mb-[120px]">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-pop font-bold block mb-[24px]">
                  01 / Build
                </span>
                <h3 className="font-heading text-[clamp(28px,4vw,56px)] tracking-[-0.02em] leading-[1.0] mb-[24px]">
                  Built in an afternoon.
                  <br />
                  <span className="italic">Not a weekend.</span>
                </h3>
                <p className="text-text-secondary text-[16px] leading-[26px] mb-[32px] max-w-[440px]">
                  Logline, vision, cast, budget, moodboard — assembled in one
                  place. The editor enforces nothing. It doesn&apos;t suggest
                  tone, impose templates, or generate your copy. It gets out of
                  the way.
                </p>
                <div className="space-y-[12px]">
                  {[
                    "Logline + Synopsis",
                    "Director's Vision",
                    "Cast & Characters",
                    "Budget Range",
                    "Moodboard Gallery",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-[12px]">
                      <span className="w-[16px] h-[1px] bg-text-disabled flex-shrink-0" />
                      <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-text-secondary">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <EditorMock />
            </div>

            {/* Row 2 — Share */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[64px] items-center mb-[120px]">
              <div className="order-2 md:order-1">
                <ShareMock />
              </div>

              <div className="order-1 md:order-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-pop font-bold block mb-[24px]">
                  02 / Share
                </span>
                <h3 className="font-heading text-[clamp(28px,4vw,56px)] tracking-[-0.02em] leading-[1.0] mb-[24px]">
                  One link.
                  <br />
                  <span className="italic">Full control.</span>
                </h3>
                <p className="text-text-secondary text-[16px] leading-[26px] mb-[32px] max-w-[440px]">
                  Public, private, or password-protected. Send the right cut to
                  the right person. Every version is retrievable — the early
                  draft doesn&apos;t disappear when you update the project.
                </p>
                <div className="space-y-[12px]">
                  {[
                    "Public / Private / Password-protected",
                    "Revoke access instantly",
                    "Custom slug (Pro / Studio)",
                    "Password-protected links (Pro / Studio)",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-[12px]">
                      <span className="w-[16px] h-[1px] bg-text-disabled flex-shrink-0" />
                      <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-text-secondary">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Row 3 — Fund */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[64px] items-center">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-pop font-bold block mb-[24px]">
                  03 / Fund
                </span>
                <h3 className="font-heading text-[clamp(28px,4vw,56px)] tracking-[-0.02em] leading-[1.0] mb-[24px]">
                  Funding lives
                  <br />
                  <span className="italic">on the page.</span>
                </h3>
                <p className="text-text-secondary text-[16px] leading-[26px] mb-[32px] max-w-[440px]">
                  No redirects. No third-party platform. Accept investment
                  directly alongside the logline, the vision, the cast. The
                  project and the fund are the same page.
                </p>
                <div className="space-y-[12px]">
                  {[
                    "Razorpay-secured payments",
                    "Stretch goals + backer rewards",
                    "Funding progress visible to viewers",
                    "Direct payout — no intermediary",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-[12px]">
                      <span className="w-[16px] h-[1px] bg-text-disabled flex-shrink-0" />
                      <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-text-secondary">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <FundMock />
            </div>
          </div>
        </section>

        {/* ── PRICING ── */}
        <section className="px-[24px] md:px-[48px] py-[96px] border-t border-hairline bg-background">
          <div className="max-w-[1200px] mx-auto">
            <div className="flex flex-col md:flex-row md:justify-between md:items-baseline border-b border-hairline pb-[24px] mb-[48px] gap-[12px]">
              <h2 className="font-heading text-[clamp(36px,5vw,72px)] tracking-tight leading-[1.0]">
                What it costs.
              </h2>
              <div className="flex items-baseline gap-[32px] flex-shrink-0">
                <Link
                  href="/pricing"
                  className="font-mono text-[9px] uppercase tracking-[0.15em] text-text-disabled hover:text-text-primary transition-colors"
                >
                  Full comparison →
                </Link>
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-pop font-bold">
                  02 / Plans
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-[1px] bg-border">
              {[
                {
                  tier: "Free",
                  price: "$0",
                  period: "forever",
                  desc: "One complete project. Share it publicly.",
                  cta: "Start free",
                  href: "/signup",
                  pop: false,
                },
                {
                  tier: "Pro",
                  price: "$12",
                  period: "/mo",
                  desc: "Unlimited projects. AI. Privacy controls.",
                  cta: "Go Pro",
                  href: "/pricing",
                  pop: true,
                },
                {
                  tier: "Studio",
                  price: "$29",
                  period: "/mo",
                  desc: "Teams. Unlimited AI. Lower commission.",
                  cta: "Get Studio",
                  href: "/pricing",
                  pop: false,
                },
              ].map((item) => (
                <div
                  key={item.tier}
                  className={`p-[32px] flex flex-col gap-[16px] ${item.pop ? "bg-surface" : "bg-background"}`}
                  style={
                    item.pop
                      ? { boxShadow: "inset 0 0 0 1px rgba(245,200,48,0.25)" }
                      : undefined
                  }
                >
                  <div className="flex items-center justify-between">
                    <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-text-secondary">
                      {item.tier}
                    </p>
                    {item.pop && (
                      <div className="flex items-center gap-[6px]">
                        <PulseDot size={5} />
                        <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-pop">
                          Popular
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-baseline gap-[4px]">
                    <span className="font-heading text-[40px] leading-[1] tracking-[-0.03em] text-text-primary">
                      {item.price}
                    </span>
                    <span className="font-mono text-[12px] text-text-secondary">
                      {item.period}
                    </span>
                  </div>
                  <p className="text-[13px] leading-[20px] text-text-secondary flex-1">
                    {item.desc}
                  </p>
                  <Link
                    href={item.href}
                    className={`font-mono text-[11px] uppercase tracking-[0.15em] transition-colors ${item.pop ? "text-pop hover:text-pop-hover" : "text-text-secondary hover:text-text-primary"}`}
                  >
                    {item.cta} →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section className="bg-background border-t border-hairline overflow-hidden">
          <div className="max-w-[1200px] mx-auto">
            {/* Top rule + label */}
            <div className="flex items-center justify-between px-[24px] md:px-[48px] pt-[80px] pb-[64px]">
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-pop font-bold">03 / Start</span>
              <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-text-disabled/40">pitchcraft.app/p/your-project</span>
            </div>

            {/* Massive left headline, right column with action */}
            <div className="grid grid-cols-12 items-end pb-[96px] px-[24px] md:px-[48px]">
              {/* Left: full-width editorial heading */}
              <div className="col-span-12 md:col-span-8">
                <h2 className="font-heading tracking-[-0.04em] leading-[0.85]"
                  style={{ fontSize: 'clamp(64px, 11vw, 156px)' }}>
                  Your project.
                  <br />
                  <span className="italic text-pop">One page.</span>
                </h2>
              </div>

              {/* Right: compact editorial column — copy + link */}
              <div className="col-span-12 md:col-span-4 md:pl-[48px] pt-[48px] md:pt-0 pb-[8px]">
                <p className="text-[15px] leading-[26px] text-text-secondary mb-[32px]">
                  One link for your logline,<br />
                  cast, budget, and funding.<br />
                  Built to be read — not<br />
                  forwarded as a PDF.
                </p>
                <Link href="/signup" onClick={() => playClick()} className={primaryCta}>
                  Create your first project
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>

            {/* Bottom: full-width rule */}
            <div className="h-[1px] bg-hairline" />
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="w-full px-[24px] md:px-[48px] py-[64px] border-t border-hairline bg-background">
          <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-end gap-[32px]">
            <div className="space-y-[8px]">
              <div className="font-heading font-bold text-[20px] uppercase tracking-tighter text-text-primary">
                Pitchcraft
              </div>
              <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-text-disabled/50">
                © {new Date().getFullYear()} All rights reserved.
              </p>
            </div>
            <div className="flex flex-wrap gap-[32px]">
              {[
                { label: "Pricing", href: "/pricing" },
                { label: "Privacy", href: "/privacy" },
                { label: "Terms", href: "/terms" },
                { label: "Log in", href: "/login" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-mono text-[9px] uppercase tracking-[0.2em] text-text-disabled hover:text-text-primary transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </footer>
      </>
    </MotionConfig>
  );
}
