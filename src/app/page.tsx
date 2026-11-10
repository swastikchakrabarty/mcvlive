"use client";

import { useState } from "react";
import { LuxuryNav } from "@/components/luxury/luxury-nav";
import { LuxuryBillingTiers } from "@/components/luxury/billing-tiers";
import { LuxuryContactForm } from "@/components/luxury/luxury-contact-form";
import { ArrowRightIcon } from "@/components/ui/icons";

export default function LuxuryHomePage() {
  const [selectedTier, setSelectedTier] = useState<string>("100_advance");

  return (
    <div className="relative min-h-screen bg-[#F4ECE1] text-[#0A0A0A] overflow-hidden selection:bg-[#C5A880] selection:text-white">
      {/* Subtle Top Ambient Lighting Aura */}
      <div
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[640px] ambient-hero-glow z-0"
        aria-hidden="true"
      />

      {/* 1. Fear of God Minimalist Navigation */}
      <LuxuryNav />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-32 sm:space-y-40 pt-16 sm:pt-24 pb-28">
        {/* 2. Hero Section: Flashy Ambient Lighting & Powerful Headline */}
        <section
          aria-labelledby="hero-heading"
          className="relative min-h-[70vh] flex flex-col justify-center items-center text-center max-w-5xl mx-auto space-y-10"
        >
          {/* Subtle Ambient Golden Halo Accent */}
          <div
            className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 w-[380px] sm:w-[600px] h-[380px] sm:h-[440px] rounded-full bg-gradient-to-b from-[#EBDCC5]/60 via-[#E8D6BD]/30 to-transparent blur-3xl -z-10"
            aria-hidden="true"
          />

          {/* Powerful Headline with Exquisite Letter-Spacing & Refined Serif Weight */}
          <h1
            id="hero-heading"
            className="text-4xl sm:text-6xl lg:text-7xl xl:text-[5.25rem] font-light sm:font-normal tracking-[-0.03em] sm:tracking-[-0.04em] text-[#0A0A0A] leading-[1.04] uppercase max-w-5xl"
          >
            We build software, websites, and web applications for businesses to grow{" "}
            <span className="font-serif italic font-normal tracking-normal bg-gradient-to-r from-[#7D633C] via-[#B89758] to-[#6E5530] bg-clip-text text-transparent drop-shadow-[0_1px_2px_rgba(212,175,55,0.25)]">
              so they never miss another customer.
            </span>
          </h1>

          {/* Refined Luxury Description */}
          <p className="text-base sm:text-xl text-[#4A4A4A] font-light max-w-3xl mx-auto leading-relaxed tracking-wide">
            In an institutional landscape where seconds determine market capture, generic templates
            cost millions. We design and construct bespoke web platforms, conversion-optimized
            architectures, and high-throughput software systems engineered for exponential customer
            acquisition.
          </p>

          {/* Dual Action Triggers */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <a
              href="#contact"
              className="inline-flex items-center gap-2.5 rounded-full bg-[#171717] px-8 py-4 text-xs uppercase font-medium tracking-[0.24em] text-white shadow-xl shadow-neutral-900/10 hover:bg-[#2B2B2B] border border-[#D4AF37]/50 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
            >
              <span>Initiate Engagement</span>
              <ArrowRightIcon className="w-3.5 h-3.5" />
            </a>

            <a
              href="#billing"
              className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/40 bg-white/60 backdrop-blur-xl px-8 py-4 text-xs uppercase font-medium tracking-[0.22em] text-[#171717] hover:border-[#D4AF37] hover:bg-white transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
            >
              <span>View Billing Systems</span>
            </a>
          </div>

          {/* Credibility Ribbon */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-8 text-[11px] uppercase font-mono tracking-[0.22em] text-[#7A7A7A]">
            <span>Zero Cold-Starts</span>
            <span>·</span>
            <span>Sub-5ms Execution</span>
            <span>·</span>
            <span>100% Sovereign Tenancy</span>
          </div>
        </section>

        {/* 3. The Philosophy Section: Never Miss Another Customer */}
        <section
          id="philosophy"
          aria-labelledby="philosophy-heading"
          className="space-y-16 max-w-5xl mx-auto"
        >
          <div className="text-center space-y-4">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#8C734B] font-semibold block">
              Core Philosophy
            </span>
            <h2
              id="philosophy-heading"
              className="text-3xl sm:text-5xl font-extralight tracking-tight text-[#0A0A0A] uppercase"
            >
              The Cost of a Missed Customer
            </h2>
            <p className="text-sm sm:text-base text-[#4A4A4A] font-light max-w-2xl mx-auto leading-relaxed">
              Every millisecond of latency, clumsy checkout flow, or server outage is a permanent
              revenue leakage. We build systems that make customer abandonment mathematically
              negligible.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="backdrop-blur-xl bg-white/60 border border-[#D4AF37]/30 rounded-3xl p-8 space-y-4 shadow-sm hover:border-[#D4AF37]/70 hover:bg-white/70 transition-all duration-300">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8C734B] font-bold">
                01 / Acquisition
              </span>
              <h3 className="text-xl font-light tracking-tight text-[#0A0A0A]">
                Instantaneous Ingress
              </h3>
              <p className="text-xs text-[#525252] font-light leading-relaxed">
                Edge-deployed Next.js streaming architectures rendering interactive pages in under
                80 milliseconds. Your buyers never wait; their interest is captured immediately.
              </p>
            </div>

            {/* Card 2 */}
            <div className="backdrop-blur-xl bg-white/60 border border-[#D4AF37]/30 rounded-3xl p-8 space-y-4 shadow-sm hover:border-[#D4AF37]/70 hover:bg-white/70 transition-all duration-300">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8C734B] font-bold">
                02 / Conversion
              </span>
              <h3 className="text-xl font-light tracking-tight text-[#0A0A0A]">
                Frictionless Transactions
              </h3>
              <p className="text-xs text-[#525252] font-light leading-relaxed">
                Bespoke user journeys with client-side zero-latency validation, instant payment
                confirmations, and real-time inventory synchronization.
              </p>
            </div>

            {/* Card 3 */}
            <div className="backdrop-blur-xl bg-white/60 border border-[#D4AF37]/30 rounded-3xl p-8 space-y-4 shadow-sm hover:border-[#D4AF37]/70 hover:bg-white/70 transition-all duration-300">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8C734B] font-bold">
                03 / Retention
              </span>
              <h3 className="text-xl font-light tracking-tight text-[#0A0A0A]">
                Sovereign Trust & SLA
              </h3>
              <p className="text-xs text-[#525252] font-light leading-relaxed">
                Hardened multi-tenant PostgreSQL databases with Row-Level Security, Anti-BOLA
                authorization guards, and 99.999% uptime guarantees.
              </p>
            </div>
          </div>
        </section>

        {/* 4. Engineering Capabilities */}
        <section
          id="architectures"
          aria-labelledby="architectures-heading"
          className="space-y-16 max-w-6xl mx-auto"
        >
          <div className="text-center space-y-4">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#8C734B] font-semibold block">
              Architectural Scope
            </span>
            <h2
              id="architectures-heading"
              className="text-3xl sm:text-5xl font-extralight tracking-tight text-[#0A0A0A] uppercase"
            >
              What We Construct
            </h2>
            <p className="text-sm sm:text-base text-[#4A4A4A] font-light max-w-2xl mx-auto leading-relaxed">
              We specialize in 3 core disciplines of high-growth digital infrastructure:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="backdrop-blur-xl bg-white/60 border border-[#D4AF37]/30 rounded-3xl p-8 space-y-4 shadow-sm hover:border-[#D4AF37]/70 hover:bg-white/70 transition-all duration-300">
              <h3 className="text-lg font-normal text-[#0A0A0A] uppercase tracking-wide">
                Bespoke Corporate Websites
              </h3>
              <p className="text-xs text-[#525252] font-light leading-relaxed">
                High-aesthetic, authoritative flagship websites for investment firms, luxury
                enterprises, and technology leaders. Designed to project power and convert
                high-net-worth clients.
              </p>
              <div className="pt-2 text-[11px] font-mono text-[#8C734B] uppercase tracking-wider">
                Next.js · Tailwind · Edge SSR
              </div>
            </div>

            <div className="backdrop-blur-xl bg-white/60 border border-[#D4AF37]/30 rounded-3xl p-8 space-y-4 shadow-sm hover:border-[#D4AF37]/70 hover:bg-white/70 transition-all duration-300">
              <h3 className="text-lg font-normal text-[#0A0A0A] uppercase tracking-wide">
                Mission-Critical Web Applications
              </h3>
              <p className="text-xs text-[#525252] font-light leading-relaxed">
                Full-stack transactional SaaS, client portals, trading desks, and administrative
                consoles built with absolute data integrity and sub-second reactivity.
              </p>
              <div className="pt-2 text-[11px] font-mono text-[#8C734B] uppercase tracking-wider">
                React 19 · Node.js · Clerk Auth
              </div>
            </div>

            <div className="backdrop-blur-xl bg-white/60 border border-[#D4AF37]/30 rounded-3xl p-8 space-y-4 shadow-sm hover:border-[#D4AF37]/70 hover:bg-white/70 transition-all duration-300">
              <h3 className="text-lg font-normal text-[#0A0A0A] uppercase tracking-wide">
                Enterprise Vector Infrastructure
              </h3>
              <p className="text-xs text-[#525252] font-light leading-relaxed">
                Sub-millisecond vector indexing engines, autonomous background worker queues, and
                sovereign database partitions engineered for enterprise AI scale.
              </p>
              <div className="pt-2 text-[11px] font-mono text-[#8C734B] uppercase tracking-wider">
                PostgreSQL RLS · HNSW · FastAPI
              </div>
            </div>
          </div>
        </section>

        {/* 5. Billing Systems Section (3 Tiers) */}
        <LuxuryBillingTiers onSelectTier={(tierId) => setSelectedTier(tierId)} />

        {/* 6. Streamlined Contact Form */}
        <section
          id="contact"
          aria-labelledby="contact-heading"
          className="space-y-12 max-w-3xl mx-auto"
        >
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/40 bg-white/80 px-4 py-1 text-[11px] uppercase tracking-[0.25em] font-semibold text-[#8C734B] shadow-sm">
              <span>Direct Client Onboarding</span>
            </div>
            <h2
              id="contact-heading"
              className="text-3xl sm:text-5xl font-extralight tracking-tight text-[#0A0A0A] uppercase"
            >
              Begin Your Architecture
            </h2>
            <p className="text-sm sm:text-base text-[#4A4A4A] font-light max-w-xl mx-auto leading-relaxed">
              Complete our executive brief below. Our Principal Engineers review each submission and
              respond within 24 hours.
            </p>
          </div>

          <LuxuryContactForm initialTier={selectedTier} />
        </section>
      </main>

      {/* 7. Footer Section: Catchy High-End Copy & Subtle Ambient Glow */}
      <footer className="relative border-t border-[#D4AF37]/25 bg-[#ECE2D5] text-[#0A0A0A] py-20 overflow-hidden">
        {/* Subtle Bottom Ambient Glow */}
        <div
          className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[420px] ambient-footer-glow z-0"
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Catchy High-End Statement */}
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h2 className="text-2xl sm:text-4xl font-extralight uppercase tracking-tight text-[#0A0A0A] leading-snug">
              Morland Chambers Vector — We build the software, websites, and web applications that
              empower businesses to scale exponentially.{" "}
              <span className="font-serif italic font-normal tracking-normal bg-gradient-to-r from-[#7D633C] via-[#B89758] to-[#6E5530] bg-clip-text text-transparent">
                Never miss another customer.
              </span>
            </h2>

            <div className="pt-2">
              <a
                href="mailto:info@morelandchambers.com"
                className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/50 bg-white/80 px-6 py-2.5 text-xs font-mono uppercase tracking-[0.22em] text-[#0A0A0A] shadow-sm hover:border-[#D4AF37] hover:bg-[#0A0A0A] hover:text-white transition-all duration-200"
              >
                <span>info@morelandchambers.com</span>
                <ArrowRightIcon className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Minimalist Footnote & Global Jurisdictions */}
          <div className="pt-10 border-t border-[#D4AF37]/20 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-[#7A7A7A] font-light">
            <div className="flex items-center gap-3">
              <span className="font-mono font-medium text-[#0A0A0A] tracking-wider text-xs">
                MCV SYSTEMS
              </span>
              <span>·</span>
              <span>London · Zurich · New York · Singapore</span>
            </div>

            <p className="text-[11px] font-mono tracking-wider">
              © 2026 MORLAND CHAMBERS VECTOR. ALL RIGHTS RESERVED.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
