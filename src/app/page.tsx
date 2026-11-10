"use client";

import { useState } from "react";
import Image from "next/image";
import { LuxuryNav } from "@/components/luxury/luxury-nav";
import { LuxuryBillingTiers } from "@/components/luxury/billing-tiers";
import { LuxuryContactForm } from "@/components/luxury/luxury-contact-form";
import { ArrowRightIcon } from "@/components/ui/icons";

export default function LuxuryHomePage() {
  const [selectedTier, setSelectedTier] = useState<string>("ecommerce_store");

  return (
    <div className="relative min-h-screen bg-[#070709] text-white overflow-hidden selection:bg-[#D4AF37] selection:text-black">
      {/* Dynamic Luminous Ambient Top Aurora */}
      <div
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[680px] ambient-hero-glow z-0"
        aria-hidden="true"
      />

      {/* Floating Ambient Golden Particle Mesh */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden z-0"
        aria-hidden="true"
      >
        <div className="absolute top-[16%] left-[10%] w-2 h-2 rounded-full bg-[#E5C158]/50 blur-[1px] animate-particle-1" />
        <div className="absolute top-[26%] right-[14%] w-2.5 h-2.5 rounded-full bg-[#D4AF37]/40 blur-[1px] animate-particle-2" />
        <div className="absolute top-[48%] left-[6%] w-1.5 h-1.5 rounded-full bg-[#FFF3D6]/40 blur-[1px] animate-particle-2" />
        <div className="absolute top-[64%] right-[8%] w-2 h-2 rounded-full bg-[#E5C158]/45 blur-[1px] animate-particle-1" />
        <div className="absolute top-[78%] left-[18%] w-2.5 h-2.5 rounded-full bg-[#D4AF37]/35 blur-[1px] animate-particle-2" />
      </div>

      {/* 1. Fear of God Minimalist Navigation */}
      <LuxuryNav />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-32 sm:space-y-40 pt-14 sm:pt-20 pb-28">
        {/* 2. Hero Section: Flashy Ambient Lighting & Powerful Headline */}
        <section
          aria-labelledby="hero-heading"
          className="relative min-h-[72vh] flex flex-col justify-center items-center text-center max-w-5xl mx-auto space-y-8"
        >
          {/* Luminous Ambient Golden Halo Accent */}
          <div
            className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 w-[440px] sm:w-[720px] h-[440px] sm:h-[520px] rounded-full bg-gradient-to-b from-[#D4AF37]/25 via-[#E5C158]/10 to-transparent blur-3xl -z-10"
            aria-hidden="true"
          />

          {/* Centered 3D Metallic Gold Emblem with Subtle Hover Bloom */}
          <div className="pb-1">
            <Image
              src="/mcvlogo.png"
              alt="Morland Chambers Vector 3D Gold Emblem"
              width={90}
              height={70}
              priority
              className="h-16 sm:h-20 w-auto object-contain gold-glow-bloom mx-auto"
            />
          </div>

          {/* Powerful Headline with Crisp White & Shimmering Gold Gradient Highlights */}
          <h1
            id="hero-heading"
            className="text-4xl sm:text-6xl lg:text-7xl xl:text-[5.5rem] font-light sm:font-normal tracking-[-0.03em] sm:tracking-[-0.04em] text-white leading-[1.03] uppercase max-w-5xl drop-shadow-[0_2px_20px_rgba(0,0,0,0.9)]"
          >
            We build software, websites, and web applications for businesses to grow{" "}
            <span className="font-serif italic font-normal tracking-normal bg-gradient-to-r from-[#D4AF37] via-[#FFF3D6] to-[#C5A880] bg-[length:200%_auto] animate-shimmer-gold bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(212,175,55,0.65)]">
              so they never miss another customer.
            </span>
          </h1>

          {/* Refined Luxury Description */}
          <p className="text-base sm:text-xl text-[#B0B0C4] font-light max-w-3xl mx-auto leading-relaxed tracking-wide">
            In an institutional landscape where seconds determine market capture, generic templates
            cost millions. We design and construct bespoke web platforms, conversion-optimized
            architectures, and high-throughput software systems engineered for exponential customer
            acquisition.
          </p>

          {/* Dual Action Triggers */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
            <a
              href="#contact"
              className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#FFF3D6] to-[#D4AF37] px-8 py-4 text-xs uppercase font-bold tracking-[0.24em] text-black shadow-[0_0_35px_rgba(212,175,55,0.4)] hover:shadow-[0_0_55px_rgba(229,193,88,0.7)] hover:scale-[1.02] border border-[#FFF3D6]/80 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5C158]"
            >
              <span>Initiate Engagement</span>
              <ArrowRightIcon className="w-3.5 h-3.5" />
            </a>

            <a
              href="#billing"
              className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/45 bg-[#09090D]/90 backdrop-blur-xl px-8 py-4 text-xs uppercase font-semibold tracking-[0.22em] text-[#E5C158] hover:border-[#D4AF37] hover:bg-[#12121A] shadow-[0_0_25px_rgba(212,175,55,0.12)] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5C158]"
            >
              <span>View Billing Systems</span>
            </a>
          </div>

          {/* Credibility Ribbon */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-6 lg:gap-8 text-[10px] sm:text-[11px] uppercase font-mono tracking-[0.2em] sm:tracking-[0.24em] text-[#D4AF37]/90">
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
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/40 bg-[#09090D]/90 px-4 py-1.5 text-[11px] uppercase tracking-[0.25em] font-semibold text-[#E5C158] shadow-[0_0_20px_rgba(212,175,55,0.15)]">
              <span>Core Philosophy</span>
            </div>
            <h2
              id="philosophy-heading"
              className="text-3xl sm:text-5xl font-light tracking-tight text-white uppercase"
            >
              The Cost of a Missed Customer
            </h2>
            <p className="text-sm sm:text-base text-[#A8A8B8] font-light max-w-2xl mx-auto leading-relaxed">
              Every millisecond of latency, clumsy checkout flow, or server outage is a permanent
              revenue leakage. We build systems that make customer abandonment mathematically
              negligible.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="backdrop-blur-2xl bg-[#09090D]/85 border border-[#D4AF37]/30 rounded-3xl p-6 sm:p-8 space-y-4 shadow-[0_0_35px_rgba(212,175,55,0.08)] hover:border-[#E5C158]/70 hover:shadow-[0_0_45px_rgba(212,175,55,0.22)] hover:-translate-y-1 transition-all duration-300">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#E5C158] font-bold">
                01 / Acquisition
              </span>
              <h3 className="text-xl font-light tracking-tight text-white">
                Instantaneous Ingress
              </h3>
              <p className="text-xs text-[#A8A8B8] font-light leading-relaxed">
                Edge-deployed Next.js streaming architectures rendering interactive pages in under
                80 milliseconds. Your buyers never wait; their interest is captured immediately.
              </p>
            </div>

            {/* Card 2 */}
            <div className="backdrop-blur-2xl bg-[#09090D]/85 border border-[#D4AF37]/30 rounded-3xl p-6 sm:p-8 space-y-4 shadow-[0_0_35px_rgba(212,175,55,0.08)] hover:border-[#E5C158]/70 hover:shadow-[0_0_45px_rgba(212,175,55,0.22)] hover:-translate-y-1 transition-all duration-300">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#E5C158] font-bold">
                02 / Conversion
              </span>
              <h3 className="text-xl font-light tracking-tight text-white">
                Frictionless Transactions
              </h3>
              <p className="text-xs text-[#A8A8B8] font-light leading-relaxed">
                Bespoke user journeys with client-side zero-latency validation, instant payment
                confirmations, and real-time inventory synchronization.
              </p>
            </div>

            {/* Card 3 */}
            <div className="backdrop-blur-2xl bg-[#09090D]/85 border border-[#D4AF37]/30 rounded-3xl p-6 sm:p-8 space-y-4 shadow-[0_0_35px_rgba(212,175,55,0.08)] hover:border-[#E5C158]/70 hover:shadow-[0_0_45px_rgba(212,175,55,0.22)] hover:-translate-y-1 transition-all duration-300">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#E5C158] font-bold">
                03 / Retention
              </span>
              <h3 className="text-xl font-light tracking-tight text-white">
                Sovereign Trust & SLA
              </h3>
              <p className="text-xs text-[#A8A8B8] font-light leading-relaxed">
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
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/40 bg-[#09090D]/90 px-4 py-1.5 text-[11px] uppercase tracking-[0.25em] font-semibold text-[#E5C158] shadow-[0_0_20px_rgba(212,175,55,0.15)]">
              <span>Architectural Scope</span>
            </div>
            <h2
              id="architectures-heading"
              className="text-3xl sm:text-5xl font-light tracking-tight text-white uppercase"
            >
              What We Construct
            </h2>
            <p className="text-sm sm:text-base text-[#A8A8B8] font-light max-w-2xl mx-auto leading-relaxed">
              We specialize in 3 core disciplines of high-growth digital infrastructure:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="backdrop-blur-2xl bg-[#09090D]/85 border border-[#D4AF37]/30 rounded-3xl p-6 sm:p-8 space-y-4 shadow-[0_0_35px_rgba(212,175,55,0.08)] hover:border-[#E5C158]/70 hover:shadow-[0_0_45px_rgba(212,175,55,0.22)] hover:-translate-y-1 transition-all duration-300">
              <h3 className="text-lg font-normal text-white uppercase tracking-wide">
                Bespoke Corporate Websites
              </h3>
              <p className="text-xs text-[#A8A8B8] font-light leading-relaxed">
                High-aesthetic, authoritative flagship websites for investment firms, luxury
                enterprises, and technology leaders. Designed to project power and convert
                high-net-worth clients.
              </p>
              <div className="pt-2 text-[11px] font-mono text-[#E5C158] uppercase tracking-wider">
                Next.js · Tailwind · Edge SSR
              </div>
            </div>

            <div className="backdrop-blur-2xl bg-[#09090D]/85 border border-[#D4AF37]/30 rounded-3xl p-6 sm:p-8 space-y-4 shadow-[0_0_35px_rgba(212,175,55,0.08)] hover:border-[#E5C158]/70 hover:shadow-[0_0_45px_rgba(212,175,55,0.22)] hover:-translate-y-1 transition-all duration-300">
              <h3 className="text-lg font-normal text-white uppercase tracking-wide">
                Mission-Critical Web Applications
              </h3>
              <p className="text-xs text-[#A8A8B8] font-light leading-relaxed">
                Full-stack transactional SaaS, client portals, trading desks, and administrative
                consoles built with absolute data integrity and sub-second reactivity.
              </p>
              <div className="pt-2 text-[11px] font-mono text-[#E5C158] uppercase tracking-wider">
                React 19 · Node.js · Clerk Auth
              </div>
            </div>

            <div className="backdrop-blur-2xl bg-[#09090D]/85 border border-[#D4AF37]/30 rounded-3xl p-6 sm:p-8 space-y-4 shadow-[0_0_35px_rgba(212,175,55,0.08)] hover:border-[#E5C158]/70 hover:shadow-[0_0_45px_rgba(212,175,55,0.22)] hover:-translate-y-1 transition-all duration-300">
              <h3 className="text-lg font-normal text-white uppercase tracking-wide">
                Enterprise Vector Infrastructure
              </h3>
              <p className="text-xs text-[#A8A8B8] font-light leading-relaxed">
                Sub-millisecond vector indexing engines, autonomous background worker queues, and
                sovereign database partitions engineered for enterprise AI scale.
              </p>
              <div className="pt-2 text-[11px] font-mono text-[#E5C158] uppercase tracking-wider">
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
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/40 bg-[#09090D]/90 px-4 py-1.5 text-[11px] uppercase tracking-[0.25em] font-semibold text-[#E5C158] shadow-[0_0_20px_rgba(212,175,55,0.15)]">
              <span>Direct Client Onboarding</span>
            </div>
            <h2
              id="contact-heading"
              className="text-3xl sm:text-5xl font-light tracking-tight text-white uppercase"
            >
              Begin Your Architecture
            </h2>
            <p className="text-sm sm:text-base text-[#A8A8B8] font-light max-w-xl mx-auto leading-relaxed">
              Complete our executive brief below. Our Principal Engineers review each submission and
              respond within 24 hours.
            </p>
          </div>

          <LuxuryContactForm initialTier={selectedTier} />
        </section>
      </main>

      {/* 7. Footer Section: Catchy High-End Copy & Luminous Ambient Glow */}
      <footer className="relative border-t border-[#D4AF37]/25 bg-[#050507] text-white py-20 overflow-hidden">
        {/* Luminous Bottom Ambient Glow */}
        <div
          className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[420px] ambient-footer-glow z-0"
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Emblem & Catchy High-End Statement */}
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="flex justify-center pb-2">
              <Image
                src="/mcvlogo.png"
                alt="Morland Chambers Vector Gold Emblem"
                width={56}
                height={44}
                className="h-10 sm:h-12 w-auto object-contain gold-glow-bloom"
              />
            </div>

            <h2 className="text-2xl sm:text-4xl font-extralight uppercase tracking-tight text-white leading-snug">
              Morland Chambers Vector — We build the software, websites, and web applications that
              empower businesses to scale exponentially.{" "}
              <span className="font-serif italic font-normal tracking-normal bg-gradient-to-r from-[#D4AF37] via-[#FFF3D6] to-[#C5A880] bg-[length:200%_auto] animate-shimmer-gold bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(212,175,55,0.6)]">
                Never miss another customer.
              </span>
            </h2>

            <div className="pt-2">
              <a
                href="mailto:info@morelandchambers.com"
                className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/60 bg-[#09090D] px-6 py-2.5 text-xs font-mono uppercase tracking-[0.22em] text-[#E5C158] shadow-[0_0_25px_rgba(212,175,55,0.25)] hover:border-[#E5C158] hover:bg-[#D4AF37] hover:text-black transition-all duration-200"
              >
                <span>info@morelandchambers.com</span>
                <ArrowRightIcon className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Minimalist Footnote & Global Jurisdictions */}
          <div className="pt-10 border-t border-[#D4AF37]/20 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-[#828292] font-light text-center sm:text-left">
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
