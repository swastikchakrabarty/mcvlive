"use client";

import { useState } from "react";
import { LuxuryNav } from "@/components/luxury/luxury-nav";
import { LuxuryBillingTiers } from "@/components/luxury/billing-tiers";
import { LuxuryContactForm } from "@/components/luxury/luxury-contact-form";
import { ArrowRightIcon } from "@/components/ui/icons";

export default function LuxuryHomePage() {
  const [selectedTier, setSelectedTier] = useState<string>("ecommerce_store");

  return (
    <div className="relative min-h-screen bg-[#0A0A0C] text-white overflow-hidden selection:bg-[#E6C594] selection:text-black">
      {/* Dynamic Luminous Ambient Top Aurora */}
      <div
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[680px] ambient-hero-glow z-0"
        aria-hidden="true"
      />

      {/* 1. Fear of God Minimalist Navigation */}
      <LuxuryNav />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-32 sm:space-y-40 pt-16 sm:pt-24 pb-28">
        {/* 2. Hero Section: Flashy Ambient Lighting & Powerful Headline */}
        <section
          aria-labelledby="hero-heading"
          className="relative min-h-[72vh] flex flex-col justify-center items-center text-center max-w-5xl mx-auto space-y-10"
        >
          {/* Luminous Ambient Golden Halo Accent */}
          <div
            className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 w-[400px] sm:w-[680px] h-[400px] sm:h-[480px] rounded-full bg-gradient-to-b from-[#E6C594]/25 via-[#F3D5A0]/10 to-transparent blur-3xl -z-10"
            aria-hidden="true"
          />

          {/* Powerful Headline with Crisp White & Shimmering Gold Gradient Highlights */}
          <h1
            id="hero-heading"
            className="text-4xl sm:text-6xl lg:text-7xl xl:text-[5.5rem] font-light sm:font-normal tracking-[-0.03em] sm:tracking-[-0.04em] text-white leading-[1.03] uppercase max-w-5xl drop-shadow-[0_2px_15px_rgba(0,0,0,0.8)]"
          >
            We build software, websites, and web applications for businesses to grow{" "}
            <span className="font-serif italic font-normal tracking-normal bg-gradient-to-r from-[#F3D5A0] via-[#FFF3DC] to-[#E6C594] bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(243,213,160,0.6)]">
              so they never miss another customer.
            </span>
          </h1>

          {/* Refined Luxury Description */}
          <p className="text-base sm:text-xl text-[#B4B4C8] font-light max-w-3xl mx-auto leading-relaxed tracking-wide">
            In an institutional landscape where seconds determine market capture, generic templates
            cost millions. We design and construct bespoke web platforms, conversion-optimized
            architectures, and high-throughput software systems engineered for exponential customer
            acquisition.
          </p>

          {/* Dual Action Triggers */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <a
              href="#contact"
              className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#E6C594] via-[#F3D5A0] to-[#E6C594] px-8 py-4 text-xs uppercase font-bold tracking-[0.24em] text-black shadow-[0_0_30px_rgba(230,197,148,0.4)] hover:shadow-[0_0_45px_rgba(230,197,148,0.65)] hover:scale-[1.02] border border-[#FFF0D4]/80 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F3D5A0]"
            >
              <span>Initiate Engagement</span>
              <ArrowRightIcon className="w-3.5 h-3.5" />
            </a>

            <a
              href="#billing"
              className="inline-flex items-center gap-2 rounded-full border border-[#E6C594]/40 bg-[#121216]/90 backdrop-blur-xl px-8 py-4 text-xs uppercase font-semibold tracking-[0.22em] text-[#F3D5A0] hover:border-[#E6C594] hover:bg-[#181822] shadow-[0_0_20px_rgba(230,197,148,0.12)] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F3D5A0]"
            >
              <span>View Billing Systems</span>
            </a>
          </div>

          {/* Credibility Ribbon */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-8 text-[11px] uppercase font-mono tracking-[0.24em] text-[#E6C594]/80">
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
            <div className="inline-flex items-center gap-2 rounded-full border border-[#E6C594]/40 bg-[#121216]/90 px-4 py-1.5 text-[11px] uppercase tracking-[0.25em] font-semibold text-[#F3D5A0] shadow-[0_0_20px_rgba(230,197,148,0.15)]">
              <span>Core Philosophy</span>
            </div>
            <h2
              id="philosophy-heading"
              className="text-3xl sm:text-5xl font-light tracking-tight text-white uppercase"
            >
              The Cost of a Missed Customer
            </h2>
            <p className="text-sm sm:text-base text-[#A0A0B0] font-light max-w-2xl mx-auto leading-relaxed">
              Every millisecond of latency, clumsy checkout flow, or server outage is a permanent
              revenue leakage. We build systems that make customer abandonment mathematically
              negligible.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="backdrop-blur-2xl bg-[#121216]/80 border border-[#E6C594]/30 rounded-3xl p-8 space-y-4 shadow-[0_0_30px_rgba(230,197,148,0.08)] hover:border-[#E6C594]/70 hover:shadow-[0_0_40px_rgba(230,197,148,0.2)] hover:-translate-y-1 transition-all duration-300">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#F3D5A0] font-bold">
                01 / Acquisition
              </span>
              <h3 className="text-xl font-light tracking-tight text-white">
                Instantaneous Ingress
              </h3>
              <p className="text-xs text-[#A0A0B0] font-light leading-relaxed">
                Edge-deployed Next.js streaming architectures rendering interactive pages in under
                80 milliseconds. Your buyers never wait; their interest is captured immediately.
              </p>
            </div>

            {/* Card 2 */}
            <div className="backdrop-blur-2xl bg-[#121216]/80 border border-[#E6C594]/30 rounded-3xl p-8 space-y-4 shadow-[0_0_30px_rgba(230,197,148,0.08)] hover:border-[#E6C594]/70 hover:shadow-[0_0_40px_rgba(230,197,148,0.2)] hover:-translate-y-1 transition-all duration-300">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#F3D5A0] font-bold">
                02 / Conversion
              </span>
              <h3 className="text-xl font-light tracking-tight text-white">
                Frictionless Transactions
              </h3>
              <p className="text-xs text-[#A0A0B0] font-light leading-relaxed">
                Bespoke user journeys with client-side zero-latency validation, instant payment
                confirmations, and real-time inventory synchronization.
              </p>
            </div>

            {/* Card 3 */}
            <div className="backdrop-blur-2xl bg-[#121216]/80 border border-[#E6C594]/30 rounded-3xl p-8 space-y-4 shadow-[0_0_30px_rgba(230,197,148,0.08)] hover:border-[#E6C594]/70 hover:shadow-[0_0_40px_rgba(230,197,148,0.2)] hover:-translate-y-1 transition-all duration-300">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#F3D5A0] font-bold">
                03 / Retention
              </span>
              <h3 className="text-xl font-light tracking-tight text-white">
                Sovereign Trust & SLA
              </h3>
              <p className="text-xs text-[#A0A0B0] font-light leading-relaxed">
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
            <div className="inline-flex items-center gap-2 rounded-full border border-[#E6C594]/40 bg-[#121216]/90 px-4 py-1.5 text-[11px] uppercase tracking-[0.25em] font-semibold text-[#F3D5A0] shadow-[0_0_20px_rgba(230,197,148,0.15)]">
              <span>Architectural Scope</span>
            </div>
            <h2
              id="architectures-heading"
              className="text-3xl sm:text-5xl font-light tracking-tight text-white uppercase"
            >
              What We Construct
            </h2>
            <p className="text-sm sm:text-base text-[#A0A0B0] font-light max-w-2xl mx-auto leading-relaxed">
              We specialize in 3 core disciplines of high-growth digital infrastructure:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="backdrop-blur-2xl bg-[#121216]/80 border border-[#E6C594]/30 rounded-3xl p-8 space-y-4 shadow-[0_0_30px_rgba(230,197,148,0.08)] hover:border-[#E6C594]/70 hover:shadow-[0_0_40px_rgba(230,197,148,0.2)] hover:-translate-y-1 transition-all duration-300">
              <h3 className="text-lg font-normal text-white uppercase tracking-wide">
                Bespoke Corporate Websites
              </h3>
              <p className="text-xs text-[#A0A0B0] font-light leading-relaxed">
                High-aesthetic, authoritative flagship websites for investment firms, luxury
                enterprises, and technology leaders. Designed to project power and convert
                high-net-worth clients.
              </p>
              <div className="pt-2 text-[11px] font-mono text-[#F3D5A0] uppercase tracking-wider">
                Next.js · Tailwind · Edge SSR
              </div>
            </div>

            <div className="backdrop-blur-2xl bg-[#121216]/80 border border-[#E6C594]/30 rounded-3xl p-8 space-y-4 shadow-[0_0_30px_rgba(230,197,148,0.08)] hover:border-[#E6C594]/70 hover:shadow-[0_0_40px_rgba(230,197,148,0.2)] hover:-translate-y-1 transition-all duration-300">
              <h3 className="text-lg font-normal text-white uppercase tracking-wide">
                Mission-Critical Web Applications
              </h3>
              <p className="text-xs text-[#A0A0B0] font-light leading-relaxed">
                Full-stack transactional SaaS, client portals, trading desks, and administrative
                consoles built with absolute data integrity and sub-second reactivity.
              </p>
              <div className="pt-2 text-[11px] font-mono text-[#F3D5A0] uppercase tracking-wider">
                React 19 · Node.js · Clerk Auth
              </div>
            </div>

            <div className="backdrop-blur-2xl bg-[#121216]/80 border border-[#E6C594]/30 rounded-3xl p-8 space-y-4 shadow-[0_0_30px_rgba(230,197,148,0.08)] hover:border-[#E6C594]/70 hover:shadow-[0_0_40px_rgba(230,197,148,0.2)] hover:-translate-y-1 transition-all duration-300">
              <h3 className="text-lg font-normal text-white uppercase tracking-wide">
                Enterprise Vector Infrastructure
              </h3>
              <p className="text-xs text-[#A0A0B0] font-light leading-relaxed">
                Sub-millisecond vector indexing engines, autonomous background worker queues, and
                sovereign database partitions engineered for enterprise AI scale.
              </p>
              <div className="pt-2 text-[11px] font-mono text-[#F3D5A0] uppercase tracking-wider">
                PostgreSQL RLS · HNSW · FastAPI
              </div>
            </div>
          </div>
        </section>

        {/* 5. Fixed Market Pricing & Architecture Tiers */}
        <LuxuryBillingTiers
          selectedTierId={selectedTier}
          onSelectTier={(tierId) => setSelectedTier(tierId)}
        />

        {/* 6. Streamlined Contact Form */}
        <section
          id="contact"
          aria-labelledby="contact-heading"
          className="space-y-12 max-w-3xl mx-auto"
        >
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#E6C594]/40 bg-[#121216]/90 px-4 py-1.5 text-[11px] uppercase tracking-[0.25em] font-semibold text-[#F3D5A0] shadow-[0_0_20px_rgba(230,197,148,0.15)]">
              <span>Direct Client Onboarding</span>
            </div>
            <h2
              id="contact-heading"
              className="text-3xl sm:text-5xl font-light tracking-tight text-white uppercase"
            >
              Begin Your Architecture
            </h2>
            <p className="text-sm sm:text-base text-[#A0A0B0] font-light max-w-xl mx-auto leading-relaxed">
              Complete our executive brief below. Our Principal Engineers review each submission and
              respond within 24 hours.
            </p>
          </div>

          <LuxuryContactForm initialTier={selectedTier} />
        </section>
      </main>

      {/* 7. Footer Section: Catchy High-End Copy & Luminous Ambient Glow */}
      <footer className="relative border-t border-[#E6C594]/25 bg-[#070709] text-white py-20 overflow-hidden">
        {/* Luminous Bottom Ambient Glow */}
        <div
          className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[420px] ambient-footer-glow z-0"
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Catchy High-End Statement */}
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h2 className="text-2xl sm:text-4xl font-extralight uppercase tracking-tight text-white leading-snug">
              Morland Chambers Vector — We build the software, websites, and web applications that
              empower businesses to scale exponentially.{" "}
              <span className="font-serif italic font-normal tracking-normal bg-gradient-to-r from-[#F3D5A0] via-[#FFF3DC] to-[#E6C594] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(243,213,160,0.5)]">
                Never miss another customer.
              </span>
            </h2>

            <div className="pt-2">
              <a
                href="mailto:info@morelandchambers.com"
                className="inline-flex items-center gap-2 rounded-full border border-[#E6C594]/60 bg-[#121216] px-6 py-2.5 text-xs font-mono uppercase tracking-[0.22em] text-[#F3D5A0] shadow-[0_0_20px_rgba(230,197,148,0.25)] hover:border-[#F3D5A0] hover:bg-[#E6C594] hover:text-black transition-all duration-200"
              >
                <span>info@morelandchambers.com</span>
                <ArrowRightIcon className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Minimalist Footnote & Global Jurisdictions */}
          <div className="pt-10 border-t border-[#E6C594]/20 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-[#828292] font-light">
            <div className="flex items-center gap-3">
              <span className="font-mono font-medium text-white tracking-wider text-xs">
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
