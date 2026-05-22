"use client";

import Link from "next/link";
import { useState } from "react";
import { LandingPreview } from "@/components/landing/LandingPreview";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { PulseDot } from "@/components/ui/PulseDot";
import { playClick } from "@/lib/sound/click";
import { motion, MotionConfig } from "framer-motion";

const expoOut: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface CalloutDot {
  id: string;
  x: string;
  y: string;
  label: string;
  desc: string;
}

const callouts: CalloutDot[] = [
  {
    id: "status",
    x: "14%",
    y: "32%",
    label: "Live status",
    desc: "Producers see if you're actively raising. The badge breathes — it signals life.",
  },
  {
    id: "link",
    x: "55%",
    y: "8%",
    label: "One link",
    desc: "Public, private, or password-protected. Revoke access any time.",
  },
  {
    id: "funding",
    x: "28%",
    y: "88%",
    label: "Funding built in",
    desc: "Accept investment directly on the pitch page. No redirects, no third-party platform.",
  },
];

function HeroProductMockup() {
  const [activeCallout, setActiveCallout] = useState<string | null>(null);

  return (
    <div className="relative w-full max-w-[560px]" style={{ aspectRatio: "4/3" }}>
      {/* Browser chrome */}
      <div className="bg-surface border border-border border-b-0 px-[12px] py-[8px] flex items-center gap-[8px]">
        <div className="flex gap-[5px]">
          <span className="w-[8px] h-[8px] rounded-full bg-border" />
          <span className="w-[8px] h-[8px] rounded-full bg-border" />
          <span className="w-[8px] h-[8px] rounded-full bg-border" />
        </div>
        <div className="flex-1 bg-background/60 px-[10px] py-[3px] mx-[4px]">
          <span className="font-mono text-[10px] text-text-disabled">
            pitchcraft.app/p/the-uninvited
          </span>
        </div>
      </div>

      {/* Pitch page */}
      <div className="bg-background border border-border border-t-0 overflow-hidden relative" style={{ height: "calc(100% - 32px)" }}>
        {/* TopBar */}
        <div className="px-[16px] py-[8px] border-b border-border flex items-center justify-between bg-surface">
          <span className="font-heading font-bold text-[10px] uppercase tracking-tighter text-text-primary">
            The Uninvited
          </span>
          <span className="bg-pop text-text-on-pop px-[8px] py-[3px] font-mono text-[7px] tracking-[0.15em] uppercase font-bold">
            Get in touch
          </span>
        </div>

        {/* Hero */}
        <div
          className="relative overflow-hidden flex flex-col justify-end"
          style={{
            height: "55%",
            background:
              "linear-gradient(135deg, #1A130E 0%, #2A1A06 40%, #3D2510 60%, #1A130E 100%)",
          }}
        >
          {/* Warm dark texture overlay */}
          <div
            className="absolute inset-0 opacity-40"
            style={{
              background:
                "linear-gradient(to top, #0D0905 0%, rgba(13,9,5,0.7) 30%, transparent 70%)",
            }}
          />
          <div className="relative z-10 px-[16px] pb-[12px] space-y-[8px]">
            <div className="flex items-center gap-[8px]">
              <PulseDot size={5} />
              <span className="font-mono text-[7px] tracking-[0.3em] uppercase text-pop font-bold">
                Looking
              </span>
            </div>
            <h1 className="font-heading font-bold text-[22px] leading-[0.9] tracking-[-0.02em] uppercase text-text-primary">
              The Uninvited
            </h1>
            <p className="font-heading italic text-[10px] leading-[1.4] text-text-primary/60 max-w-[280px]">
              A folklore archivist cataloguing abandoned estates begins finding her own handwriting in century-old journals.
            </p>
          </div>
        </div>

        {/* Metadata strip */}
        <div className="px-[16px] py-[8px] border-b border-border flex gap-[24px]">
          <div>
            <p className="font-mono text-[6px] uppercase tracking-[0.2em] text-text-disabled mb-[2px]">Genre</p>
            <p className="font-mono text-[8px] uppercase text-text-primary">Fiction / Feature</p>
          </div>
          <div>
            <p className="font-mono text-[6px] uppercase tracking-[0.2em] text-text-disabled mb-[2px]">Budget</p>
            <p className="font-mono text-[8px] uppercase text-text-primary">$250K – $1M</p>
          </div>
        </div>

        {/* Funding strip */}
        <div className="px-[16px] py-[10px]">
          <div className="flex justify-between items-baseline mb-[6px]">
            <span className="font-heading text-[13px] tracking-[-0.02em] text-text-primary">$42,000</span>
            <span className="font-mono text-[7px] text-text-disabled">of $80,000</span>
          </div>
          <div className="h-[2px] bg-border overflow-hidden mb-[4px]">
            <div className="h-full bg-pop led-pulse" style={{ width: "52%" }} />
          </div>
          <p className="font-mono text-[7px] text-text-disabled">23 supporters · 52%</p>
        </div>
      </div>

      {/* Callout dots */}
      {callouts.map((dot) => (
        <div
          key={dot.id}
          className="absolute z-20"
          style={{ left: dot.x, top: dot.y }}
          onMouseEnter={() => setActiveCallout(dot.id)}
          onMouseLeave={() => setActiveCallout(null)}
        >
          {/* Dot */}
          <div className="relative">
            <span className="block w-[10px] h-[10px] rounded-full bg-pop led-pulse cursor-pointer border-2 border-background" />
            {/* Ripple ring */}
            <span className="absolute inset-[-4px] rounded-full border border-pop/30 led-pulse" />
          </div>

          {/* Callout card */}
          {activeCallout === dot.id && (
            <div
              className="absolute z-30 w-[160px] bg-surface border border-border p-[10px] shadow-lg"
              style={{
                top: "calc(100% + 8px)",
                left: "-16px",
                boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
              }}
            >
              <p className="font-mono text-[8px] uppercase tracking-[0.15em] text-pop mb-[4px]">
                {dot.label}
              </p>
              <p className="text-[10px] text-text-secondary leading-[1.5]">{dot.desc}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export function LandingHero() {
  return (
    <MotionConfig reducedMotion="user">
      <>
        {/* ── HERO ── */}
        <section className="px-[32px] md:px-[80px] pt-[140px] pb-[100px]">
          <div className="max-w-[1200px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-[64px] items-center">

              {/* Left: Headline + CTA */}
              <div className="md:col-span-5">
                {/* Stamp */}
                <div className="overflow-hidden mb-[24px]">
                  <span
                    className="font-mono text-[9px] uppercase text-text-disabled block animate-stamp-in"
                    style={{ animationDelay: "0.5s" }}
                  >
                    Pitchcraft
                  </span>
                </div>

                {/* Title */}
                <h1 className="font-heading font-light text-[clamp(48px,9vw,120px)] leading-[0.88] tracking-[-0.03em] text-text-primary mb-[8px]">
                  <div className="overflow-hidden">
                    <span className="block animate-text-rise" style={{ animationDelay: "0.55s" }}>
                      The pitch is
                    </span>
                  </div>
                  <div className="overflow-hidden">
                    <span className="block animate-text-rise" style={{ animationDelay: "0.72s" }}>
                      the{" "}
                      <span className="italic">first frame.</span>
                    </span>
                  </div>
                </h1>

                {/* Rule */}
                <div
                  className="h-[1px] bg-border mb-[32px] animate-rule-draw"
                  style={{ animationDelay: "0.9s" }}
                />

                {/* Subtitle */}
                <motion.p
                  className="text-text-secondary font-light leading-relaxed text-[16px] mb-[40px] max-w-[360px]"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease: expoOut, delay: 1.1 }}
                >
                  Pitchcraft builds editorial pitch pages for filmmakers — logline, vision, cast, budget, funding. One link, built to be read.
                </motion.p>

                {/* CTAs */}
                <motion.div
                  className="flex flex-col sm:flex-row gap-[16px] items-start"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease: expoOut, delay: 1.25 }}
                >
                  <MagneticButton>
                    <Link
                      href="/signup"
                      onClick={() => playClick()}
                      className="led-pulse inline-flex items-center gap-[12px] bg-pop text-text-on-pop px-[28px] py-[14px] font-mono text-[11px] uppercase tracking-[0.15em] font-bold hover:bg-pop-hover transition-colors duration-200"
                    >
                      Begin the cut
                      <span>→</span>
                    </Link>
                  </MagneticButton>
                  <Link
                    href="/pricing"
                    className="inline-flex items-center gap-[12px] border border-border text-text-secondary px-[28px] py-[14px] font-mono text-[11px] uppercase tracking-[0.15em] hover:border-border-hover hover:text-text-primary transition-colors duration-200"
                  >
                    See pricing
                  </Link>
                </motion.div>
              </div>

              {/* Right: Product preview */}
              <motion.div
                className="md:col-span-7 flex justify-center md:justify-end"
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: expoOut, delay: 0.8 }}
              >
                <HeroProductMockup />
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── WHAT IT IS ── */}
        <section className="py-[96px] px-[48px] md:px-[80px] bg-background border-t border-border">
          <div className="max-w-[1200px] mx-auto">
            <div className="flex flex-col md:flex-row md:justify-between md:items-baseline border-b border-border pb-[24px] mb-[48px] gap-[12px]">
              <motion.h2
                className="font-heading text-[clamp(36px,5vw,72px)] font-light tracking-tight leading-[1.0]"
                initial={{ opacity: 0, y: 48 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.0, ease: expoOut }}
                viewport={{ once: true, amount: 0.2 }}
              >
                Your project. One page.
              </motion.h2>
              <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-text-disabled flex-shrink-0">
                01 / What it is
              </span>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 48 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, ease: expoOut, delay: 0.12 }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <p className="text-text-secondary mb-[48px] leading-relaxed text-[17px] font-light max-w-[600px]">
                Logline, vision, cast, and budget — assembled once, shared as one link. Reads like the work it&apos;s pitching, not a slide deck.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-[32px] pt-[32px] border-t border-border">
                {[
                  { label: "Build", desc: "Logline, vision, cast, budget, moodboard." },
                  { label: "Share", desc: "One link. Public, private, or password-protected." },
                  { label: "Version", desc: "Every draft saved. Send the right cut to the right person." },
                  { label: "Fund", desc: "Accept investment directly through your pitch page." },
                ].map((item) => (
                  <div key={item.label}>
                    <span className="text-text-disabled text-[9px] tracking-[0.3em] font-bold uppercase block mb-[8px]">{item.label}</span>
                    <p className="text-[13px] font-light text-text-secondary leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── PRODUCT PREVIEW (rotating) ── */}
        <LandingPreview />

        {/* ── HOW IT WORKS (bento) ── */}
        <section className="py-[96px] px-[48px] md:px-[80px] bg-surface border-t border-border">
          <div className="max-w-[1200px] mx-auto">
            <div className="flex flex-col md:flex-row md:justify-between md:items-baseline border-b border-border pb-[24px] mb-[48px] gap-[12px]">
              <motion.h2
                className="font-heading text-[clamp(36px,5vw,72px)] font-light tracking-tight leading-[1.0]"
                initial={{ opacity: 0, y: 48 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.0, ease: expoOut }}
                viewport={{ once: true, amount: 0.2 }}
              >
                How it works.
              </motion.h2>
              <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-text-disabled flex-shrink-0">
                03 / The Product
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-[1px] grid-rows-2 bg-border" style={{ minHeight: 600 }}>
              {/* Tile 1: The Editor — 2-col */}
              <motion.div
                className="md:col-span-2 bg-surface p-[48px] flex flex-col justify-between hover:bg-surface-hover transition-colors"
                initial={{ opacity: 0, y: 56 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.85, ease: expoOut, delay: 0 }}
                viewport={{ once: true, amount: 0.2 }}
              >
                <div>
                  <span className="font-mono text-[9px] tracking-[0.25em] font-bold text-text-disabled uppercase block mb-[24px]">Editor</span>
                  <h3 className="font-heading text-[36px] mb-[16px] font-light">The Editor</h3>
                  <p className="max-w-[480px] text-text-secondary text-[14px] font-light leading-relaxed">
                    Build your project: logline, vision, cast, and budget in one place.
                  </p>
                </div>
                <div className="flex items-center gap-[8px] mt-[32px]">
                  <PulseDot size={6} active={false} />
                  <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-text-disabled">01</span>
                </div>
              </motion.div>

              {/* Tile 2: Dashboard — 1-col, 2-row */}
              <motion.div
                className="row-span-2 bg-surface p-[48px] flex flex-col justify-between hover:bg-surface-hover transition-colors"
                initial={{ opacity: 0, y: 56 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.85, ease: expoOut, delay: 0.1 }}
                viewport={{ once: true, amount: 0.2 }}
              >
                <div>
                  <span className="font-mono text-[9px] tracking-[0.25em] font-bold text-text-disabled uppercase block mb-[24px]">Dashboard</span>
                  <h3 className="font-heading text-[36px] mb-[16px] font-light leading-[1.1]">Your<br />Projects</h3>
                  <p className="text-text-secondary text-[14px] font-light leading-relaxed">
                    Every project. Every version. One dashboard.
                  </p>
                  <div className="mt-[40px] space-y-[16px]">
                    {["Project List", "Share Controls", "Funding Tracker"].map((item) => (
                      <div key={item} className="py-[8px] border-b border-border">
                        <span className="font-mono text-[10px] tracking-[0.1em] uppercase text-text-secondary">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-[8px] mt-[32px]">
                  <PulseDot size={6} active={false} />
                  <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-text-disabled">02</span>
                </div>
              </motion.div>

              {/* Tile 3: Distribution — 2-col */}
              <motion.div
                className="md:col-span-2 bg-surface p-[48px] flex flex-col justify-between hover:bg-surface-hover transition-colors"
                initial={{ opacity: 0, y: 56 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.85, ease: expoOut, delay: 0.2 }}
                viewport={{ once: true, amount: 0.2 }}
              >
                <div>
                  <span className="font-mono text-[9px] tracking-[0.25em] font-bold text-text-disabled uppercase block mb-[24px]">Distribution</span>
                  <h3 className="font-heading text-[36px] mb-[16px] font-light">The Premiere</h3>
                  <p className="max-w-[480px] text-text-secondary text-[14px] font-light leading-relaxed">
                    Private, password-protected exhibition links for investors and crew. One link for the entire world of your project.
                  </p>
                </div>
                <div className="flex items-center gap-[8px] mt-[32px]">
                  <PulseDot size={6} active={false} />
                  <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-text-disabled">03</span>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── FEATURES CHESS ── */}
        <section className="px-[48px] md:px-[80px] py-[96px] border-t border-border bg-background">
          <div className="max-w-[1200px] mx-auto">
            <div className="flex flex-col md:flex-row md:justify-between md:items-baseline border-b border-border pb-[24px] mb-[96px] gap-[12px]">
              <motion.h2
                className="font-heading text-[clamp(36px,5vw,72px)] font-light tracking-tight leading-[1.0]"
                initial={{ opacity: 0, y: 48 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.0, ease: expoOut }}
                viewport={{ once: true, amount: 0.2 }}
              >
                Every tool a filmmaker needs.
              </motion.h2>
              <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-text-disabled flex-shrink-0">
                04 / Features
              </span>
            </div>

            {/* Row 1 — Build */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-[64px] items-center mb-[120px]"
              initial={{ opacity: 0, y: 48 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, ease: expoOut }}
              viewport={{ once: true, amount: 0.15 }}
            >
              <div>
                <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-text-disabled font-bold block mb-[24px]">01 / Build</span>
                <h3 className="font-heading text-[clamp(28px,4vw,56px)] font-light tracking-[-0.02em] leading-[1.0] mb-[24px]">
                  Built in an afternoon.<br />
                  <span className="italic">Not a weekend.</span>
                </h3>
                <p className="text-text-secondary text-[15px] leading-relaxed font-light mb-[32px] max-w-[440px]">
                  Logline, vision, cast, budget, moodboard — assembled in one place. The editor enforces nothing. It doesn&apos;t suggest tone, impose templates, or generate your copy. It gets out of the way.
                </p>
                <div className="space-y-[12px]">
                  {["Logline + Synopsis", "Director's Vision", "Cast & Characters", "Budget Range", "Moodboard Gallery"].map((item) => (
                    <div key={item} className="flex items-center gap-[12px]">
                      <span className="w-[16px] h-[1px] bg-pop flex-shrink-0" />
                      <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-text-secondary">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Editor mock */}
              <div className="bg-surface border border-border p-[32px] space-y-[20px]">
                <div className="flex items-center justify-between mb-[8px]">
                  <span className="font-mono text-[8px] uppercase tracking-[0.25em] text-text-disabled">Draft — The Weight of Water</span>
                  <span className="font-mono text-[8px] uppercase tracking-[0.15em] text-pop border border-pop/40 px-[6px] py-[2px]">Saved</span>
                </div>
                {[
                  { label: "Logline", value: "A marine biologist discovers the ocean she's spent her life studying is keeping a secret — one that could redefine memory itself.", tall: true },
                  { label: "Genre", value: "Fiction / Short Film", tall: false },
                  { label: "Status", value: "Looking", tall: false },
                ].map((field) => (
                  <div key={field.label} className="border-b border-border pb-[16px]">
                    <p className="font-mono text-[7px] uppercase tracking-[0.2em] text-text-disabled mb-[6px]">{field.label}</p>
                    <p className={`text-[12px] leading-[1.6] text-text-secondary font-light ${field.tall ? "line-clamp-3" : ""}`}>{field.value}</p>
                  </div>
                ))}
                <div className="pt-[8px]">
                  <span className="font-mono text-[8px] uppercase tracking-[0.15em] text-text-disabled">+ Add Vision</span>
                </div>
              </div>
            </motion.div>

            {/* Row 2 — Share */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-[64px] items-center mb-[120px]"
              initial={{ opacity: 0, y: 48 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, ease: expoOut }}
              viewport={{ once: true, amount: 0.15 }}
            >
              {/* Share mock */}
              <div className="bg-surface border border-border p-[32px] order-2 md:order-1">
                <p className="font-mono text-[8px] uppercase tracking-[0.25em] text-text-disabled mb-[20px]">Share Controls</p>
                <div className="space-y-[1px] mb-[24px]">
                  {[
                    { label: "Public", sub: "Anyone with the link", active: false },
                    { label: "Private", sub: "Only you", active: false },
                    { label: "Password Protected", sub: "Set a passphrase", active: true },
                  ].map((opt) => (
                    <div key={opt.label} className={`flex items-center justify-between p-[12px] ${opt.active ? "bg-surface-hover border border-border" : ""}`}>
                      <div>
                        <p className={`font-mono text-[10px] uppercase tracking-[0.1em] ${opt.active ? "text-text-primary" : "text-text-disabled"}`}>{opt.label}</p>
                        <p className="font-mono text-[8px] text-text-disabled mt-[2px]">{opt.sub}</p>
                      </div>
                      {opt.active && <PulseDot size={6} />}
                    </div>
                  ))}
                </div>
                <div className="border-t border-border pt-[16px]">
                  <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-text-disabled mb-[6px]">Your link</p>
                  <p className="font-mono text-[11px] text-text-secondary">pitchcraft.app/p/the-weight-of-water</p>
                </div>
              </div>

              <div className="order-1 md:order-2">
                <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-text-disabled font-bold block mb-[24px]">02 / Share</span>
                <h3 className="font-heading text-[clamp(28px,4vw,56px)] font-light tracking-[-0.02em] leading-[1.0] mb-[24px]">
                  One link.<br />
                  <span className="italic">Full control.</span>
                </h3>
                <p className="text-text-secondary text-[15px] leading-relaxed font-light mb-[32px] max-w-[440px]">
                  Public, private, or password-protected. Send the right cut to the right person. Every version is retrievable — the early draft doesn&apos;t disappear when you update the project.
                </p>
                <div className="space-y-[12px]">
                  {["Public / Private / Password-protected", "Revoke access instantly", "Custom slug (Pro / Studio)", "Password-protected links (Pro / Studio)"].map((item) => (
                    <div key={item} className="flex items-center gap-[12px]">
                      <span className="w-[16px] h-[1px] bg-pop flex-shrink-0" />
                      <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-text-secondary">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Row 3 — Fund */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-[64px] items-center"
              initial={{ opacity: 0, y: 48 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, ease: expoOut }}
              viewport={{ once: true, amount: 0.15 }}
            >
              <div>
                <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-text-disabled font-bold block mb-[24px]">03 / Fund</span>
                <h3 className="font-heading text-[clamp(28px,4vw,56px)] font-light tracking-[-0.02em] leading-[1.0] mb-[24px]">
                  Funding lives<br />
                  <span className="italic">on the page.</span>
                </h3>
                <p className="text-text-secondary text-[15px] leading-relaxed font-light mb-[32px] max-w-[440px]">
                  No redirects. No third-party crowdfunding platform. Accept investment directly alongside the logline, the vision, the cast. The project and the fund are the same page.
                </p>
                <div className="space-y-[12px]">
                  {["Razorpay-secured payments", "Stretch goals + backer rewards", "Funding progress visible to viewers", "Direct payout — no intermediary"].map((item) => (
                    <div key={item} className="flex items-center gap-[12px]">
                      <span className="w-[16px] h-[1px] bg-pop flex-shrink-0" />
                      <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-text-secondary">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Funding mock */}
              <div className="bg-surface border border-border p-[32px]">
                <p className="font-mono text-[8px] uppercase tracking-[0.25em] text-text-disabled mb-[20px]">Funding — The Weight of Water</p>
                <div className="mb-[20px]">
                  <div className="flex justify-between items-baseline mb-[8px]">
                    <span className="font-heading text-[28px] font-light tracking-[-0.02em] text-text-primary">$42,000</span>
                    <span className="font-mono text-[10px] text-text-disabled">of $80,000</span>
                  </div>
                  <div className="h-[3px] bg-border overflow-hidden mb-[6px]">
                    <div className="h-full bg-pop led-pulse" style={{ width: "52%" }} />
                  </div>
                  <div className="flex justify-between">
                    <span className="font-mono text-[9px] text-text-disabled">23 supporters</span>
                    <span className="font-mono text-[9px] text-text-disabled">52%</span>
                  </div>
                </div>
                <div className="space-y-[8px] mb-[16px]">
                  {[
                    { amount: "$10,000", desc: "Post-production begins", reached: true },
                    { amount: "$50,000", desc: "Festival submission run", reached: false },
                    { amount: "$80,000", desc: "Full theatrical distribution", reached: false },
                  ].map((goal) => (
                    <div key={goal.amount} className={`flex items-start gap-[8px] px-[10px] py-[7px] border-l-2 ${goal.reached ? "border-pop/60 bg-surface-hover" : "border-transparent"}`}>
                      <span className="font-mono text-[9px] text-text-disabled whitespace-nowrap">{goal.amount}</span>
                      <span className={`font-mono text-[9px] ${goal.reached ? "text-text-secondary" : "text-text-disabled"}`}>{goal.desc}{goal.reached ? " ✓" : ""}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-[12px] border-t border-border">
                  <div className="bg-pop text-text-on-pop px-[16px] py-[9px] inline-block font-mono text-[9px] uppercase tracking-[0.15em] font-bold">
                    Support this project
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── STATS ── */}
        <section className="px-[48px] md:px-[80px] py-[96px] border-t border-border bg-surface">
          <div className="max-w-[1200px] mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-[1px] bg-border">
              {[
                { number: "3", unit: "min", label: "To publish your first project" },
                { number: "1", unit: "link", label: "Logline, cast, moodboard, funding" },
                { number: "0", unit: "decks", label: "Forwarded without context" },
                { number: "8", unit: "fields", label: "To a complete pitch. That's it." },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  className="bg-surface p-[40px] flex flex-col justify-between min-h-[200px]"
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.85, ease: expoOut, delay: i * 0.08 }}
                  viewport={{ once: true, amount: 0.3 }}
                >
                  <div className="flex items-baseline gap-[6px] mb-[16px]">
                    <span className="font-heading text-[clamp(40px,6vw,80px)] font-light tracking-[-0.03em] leading-[1] text-text-primary">
                      {stat.number}
                    </span>
                    <span className="font-mono text-[12px] uppercase tracking-[0.15em] text-text-disabled">
                      {stat.unit}
                    </span>
                  </div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-text-secondary leading-[1.6]">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PRICING ── */}
        <section className="px-[48px] md:px-[80px] py-[96px] border-t border-border bg-background">
          <div className="max-w-[1200px] mx-auto">
            <div className="flex flex-col md:flex-row md:justify-between md:items-baseline border-b border-border pb-[24px] mb-[48px] gap-[12px]">
              <h2 className="font-heading text-[clamp(36px,5vw,72px)] font-light tracking-tight leading-[1.0]">
                What it costs.
              </h2>
              <div className="flex items-baseline gap-[32px] flex-shrink-0">
                <Link
                  href="/pricing"
                  className="font-mono text-[9px] uppercase tracking-[0.15em] text-text-disabled hover:text-text-primary transition-colors"
                >
                  Full comparison →
                </Link>
                <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-text-disabled">
                  05 / Plans
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-[1px] bg-border">
              {[
                { tier: "Free", price: "$0", period: "forever", desc: "One complete project. Share it publicly.", cta: "Start free", href: "/signup", pop: false },
                { tier: "Pro", price: "$12", period: "/mo", desc: "Unlimited projects. AI. Privacy controls.", cta: "Go Pro", href: "/pricing", pop: true },
                { tier: "Studio", price: "$29", period: "/mo", desc: "Teams. Unlimited AI. Lower commission.", cta: "Get Studio", href: "/pricing", pop: false },
              ].map((item) => (
                <div
                  key={item.tier}
                  className={`p-[32px] flex flex-col gap-[16px] ${item.pop ? "bg-surface" : "bg-background"}`}
                  style={item.pop ? { boxShadow: "inset 0 0 0 1px rgba(255,107,26,0.2)" } : undefined}
                >
                  <div className="flex items-center justify-between">
                    <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-text-secondary">{item.tier}</p>
                    {item.pop && (
                      <div className="flex items-center gap-[6px]">
                        <PulseDot size={5} />
                        <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-pop">Popular</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-baseline gap-[4px]">
                    <span className="font-heading text-[40px] font-light leading-[1] tracking-[-0.03em] text-text-primary">{item.price}</span>
                    <span className="font-mono text-[12px] text-text-secondary">{item.period}</span>
                  </div>
                  <p className="text-[13px] leading-[20px] text-text-secondary font-light flex-1">{item.desc}</p>
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
        <section className="py-[160px] px-[48px] md:px-[80px] bg-background border-t border-border">
          <div className="max-w-[1200px] mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: expoOut }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <h2 className="font-heading text-[clamp(48px,9vw,120px)] font-light tracking-[-0.03em] mb-[48px] italic leading-[0.9]">
                Begin the cut.
              </h2>
              <p className="max-w-[480px] mx-auto text-text-secondary mb-[48px] text-[17px] font-light leading-relaxed">
                Your next project. Built to be read, not forwarded as a PDF.
              </p>
              <div className="flex flex-col md:flex-row justify-center gap-[16px] items-center">
                <MagneticButton>
                  <Link
                    href="/signup"
                    onClick={() => playClick()}
                    className="led-pulse inline-flex items-center gap-[12px] bg-pop text-text-on-pop px-[48px] py-[18px] font-mono text-[11px] uppercase tracking-[0.2em] font-bold hover:bg-pop-hover transition-colors duration-200"
                  >
                    Create your first project
                  </Link>
                </MagneticButton>
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-[12px] border border-border text-text-secondary px-[48px] py-[18px] font-mono text-[11px] uppercase tracking-[0.2em] hover:border-border-hover hover:text-text-primary transition-colors duration-200"
                >
                  See pricing
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="w-full px-[48px] md:px-[80px] py-[64px] border-t border-border bg-background">
          <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-end gap-[32px]">
            <div className="space-y-[8px]">
              <div className="font-heading font-bold text-[20px] tracking-tighter text-text-primary">
                Pitchcraft
              </div>
              <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-text-disabled/50">
                © {new Date().getFullYear()} All rights reserved.
              </p>
            </div>
            <div className="flex flex-wrap gap-[32px]">
              {[
                { label: "Toolkit", href: "/toolkit" },
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
