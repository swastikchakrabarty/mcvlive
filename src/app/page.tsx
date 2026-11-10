import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ServerIcon,
  ShieldCheckIcon,
  CpuIcon,
  ZapIcon,
  TerminalIcon,
  DatabaseIcon,
  ArrowRightIcon,
  CheckIcon,
  ActivityIcon,
  LockIcon,
} from "@/components/ui/icons";
import { TelemetryRadar } from "@/components/home/telemetry-radar";
import { PricingSection } from "@/components/home/pricing-section";
import { CorporateContactForm } from "@/components/home/contact-form";

export default function CorporateHomePage() {
  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* 1. Global Corporate Header */}
      <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-[#090D16]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Monogram */}
          <Link
            href="/"
            className="flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg p-1"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-mono font-extrabold text-white text-base shadow-lg shadow-indigo-950/80 border border-indigo-400/40">
              MCV
            </div>
            <div>
              <span className="block font-bold tracking-tight text-slate-100 text-sm sm:text-base">
                Morland Chambers Vector
              </span>
              <span className="block text-[11px] font-mono uppercase tracking-wider text-slate-400">
                Institutional Web Architectures
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav
            aria-label="Corporate Navigation"
            className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider text-slate-300"
          >
            <a href="#services" className="hover:text-indigo-400 transition-colors">
              Capabilities
            </a>
            <a href="#blueprints" className="hover:text-indigo-400 transition-colors">
              Architectures
            </a>
            <a href="#pricing" className="hover:text-indigo-400 transition-colors">
              Licensing
            </a>
            <Link href="/design" className="hover:text-indigo-400 transition-colors">
              Design System
            </Link>
            <Link href="/dashboard" className="hover:text-indigo-400 transition-colors">
              Client Console
            </Link>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="hidden sm:inline-flex">
              <Button variant="secondary" size="sm">
                Client Sign In
              </Button>
            </Link>
            <a href="#contact">
              <Button
                variant="primary"
                size="sm"
                iconRight={<ArrowRightIcon className="w-4 h-4" />}
              >
                Engage MCV
              </Button>
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-20 space-y-28">
        {/* 2. Technical Hero Section */}
        <section aria-labelledby="hero-heading" className="space-y-12">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            {/* Telemetry pill */}
            <div className="inline-flex items-center gap-2.5 rounded-full bg-slate-900 border border-slate-700/80 px-4 py-1.5 text-xs text-slate-300 shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-slate-400 uppercase tracking-wider">
                Status: Global Ingress Clusters Nominal
              </span>
              <span className="text-slate-600">|</span>
              <span className="font-mono text-emerald-400 font-medium">3.8ms P99</span>
            </div>

            {/* Headline */}
            <h1
              id="hero-heading"
              className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-100 leading-[1.08]"
            >
              Institutional Vector Systems &{" "}
              <span className="bg-gradient-to-r from-indigo-400 via-indigo-300 to-indigo-500 bg-clip-text text-transparent">
                Sovereign Architectures
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="text-base sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-normal">
              Morland Chambers Vector designs, engineers, and operates mission-critical corporate
              web platforms, sub-millisecond vector indexing engines, and cryptographic multi-tenant
              foundations for global financial institutions and sovereign enterprises.
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <a href="#contact">
                <Button
                  variant="primary"
                  size="lg"
                  iconRight={<ArrowRightIcon className="w-5 h-5" />}
                >
                  Initialize Sovereign Infrastructure
                </Button>
              </a>
              <Link href="/dashboard">
                <Button
                  variant="secondary"
                  size="lg"
                  iconLeft={<TerminalIcon className="w-5 h-5 text-indigo-400" />}
                >
                  Launch Client Console
                </Button>
              </Link>
            </div>

            {/* Hero Guarantee Badges */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <ShieldCheckIcon className="w-4 h-4 text-emerald-400" />
                <span>Anti-BOLA Authorization Locked</span>
              </div>
              <div className="flex items-center gap-1.5">
                <DatabaseIcon className="w-4 h-4 text-indigo-400" />
                <span>Postgres Row-Level Security</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ZapIcon className="w-4 h-4 text-amber-400" />
                <span>Sub-5ms Vector Ingress</span>
              </div>
            </div>
          </div>

          {/* Interactive Telemetry Cluster Preview */}
          <div className="max-w-5xl mx-auto">
            <TelemetryRadar />
          </div>
        </section>

        {/* 3. Core Capabilities & Services Grid */}
        <section id="services" aria-labelledby="services-heading" className="space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-950/80 border border-indigo-800/60 px-3.5 py-1 text-xs font-mono font-medium text-indigo-300">
              <CpuIcon className="w-3.5 h-3.5" />
              <span>Institutional Core Capabilities</span>
            </div>
            <h2
              id="services-heading"
              className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight"
            >
              Engineered for Zero Failure Tolerances
            </h2>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              Every system deployed by Morland Chambers Vector is built upon strict architectural
              boundaries, zero-trust secrets management, and mathematical data isolation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Service 1 */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 shadow-md hover:border-slate-700 transition-colors">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-950/80 border border-indigo-800/60 text-indigo-400">
                <ServerIcon className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-100">Sovereign Web Architectures</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Modern Next.js React Server Components with streaming SSR, edge delivery, and zero
                cold-start serverless runtimes optimized for sub-100ms global FCP.
              </p>
              <ul className="text-xs text-slate-300 space-y-1 pt-1 font-mono">
                <li className="flex items-center gap-1.5">
                  <CheckIcon className="w-3.5 h-3.5 text-emerald-400" />
                  <span>RSC Streaming Core</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckIcon className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Edge CDN Caching</span>
                </li>
              </ul>
            </div>

            {/* Service 2 */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 shadow-md hover:border-slate-700 transition-colors">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-950/80 border border-indigo-800/60 text-indigo-400">
                <ZapIcon className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-100">Bespoke Vector Engines</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                High-throughput vector indexing using HNSW and IVF-PQ quantization algorithms.
                Bespoke Python microservices delivering sub-5ms semantic retrieval at scale.
              </p>
              <ul className="text-xs text-slate-300 space-y-1 pt-1 font-mono">
                <li className="flex items-center gap-1.5">
                  <CheckIcon className="w-3.5 h-3.5 text-emerald-400" />
                  <span>HNSW & IVF-PQ Support</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckIcon className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Billion-Scale Quantization</span>
                </li>
              </ul>
            </div>

            {/* Service 3 */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 shadow-md hover:border-slate-700 transition-colors">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-950/80 border border-indigo-800/60 text-indigo-400">
                <ShieldCheckIcon className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-100">Multi-Tenant Isolation</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Absolute tenant segregation enforced at both database (PostgreSQL RLS) and
                application layers. Centralized Anti-BOLA authorization preventing enumeration.
              </p>
              <ul className="text-xs text-slate-300 space-y-1 pt-1 font-mono">
                <li className="flex items-center gap-1.5">
                  <CheckIcon className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Strict Row-Level Security</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckIcon className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Anti-BOLA/IDOR Shields</span>
                </li>
              </ul>
            </div>

            {/* Service 4 */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 shadow-md hover:border-slate-700 transition-colors">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-950/80 border border-indigo-800/60 text-indigo-400">
                <ActivityIcon className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-100">Autonomous Agent Queues</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Asynchronous job queues with idempotency keys, exponential backoff retries, and
                cryptographic Stripe webhook ingestion with zero duplicate replay risks.
              </p>
              <ul className="text-xs text-slate-300 space-y-1 pt-1 font-mono">
                <li className="flex items-center gap-1.5">
                  <CheckIcon className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Idempotent Worker Queue</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckIcon className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Webhook Cryptography</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 4. High-End Case Studies & Deployed Blueprints */}
        <section id="blueprints" aria-labelledby="blueprints-heading" className="space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-950/80 border border-indigo-800/60 px-3.5 py-1 text-xs font-mono font-medium text-indigo-300">
              <TerminalIcon className="w-3.5 h-3.5" />
              <span>Proven Production Architectures</span>
            </div>
            <h2
              id="blueprints-heading"
              className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight"
            >
              Enterprise Case Studies & Blueprints
            </h2>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              Institutional implementations operating live vector workloads under strict global
              jurisdictional oversight.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Case Study 1 */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 space-y-5 hover:border-indigo-500/50 transition-all duration-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-indigo-400">
                  Case Study 01
                </span>
                <span className="rounded bg-slate-800 px-2 py-0.5 text-[11px] font-mono text-slate-300">
                  FCA Regulated
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-100">Apex Sovereign Systems Ltd</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Engineered a distributed vector pipeline indexing 450M legal artifacts with sub-4ms
                hybrid lexical-dense retrieval, enforcing strict multi-tenant boundary checks across
                3 sovereign entities.
              </p>
              <div className="border-t border-slate-800 pt-4 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Daily Query Volume:</span>
                  <span className="font-mono text-slate-200 font-semibold">450 Million QPS</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Uptime Reliability:</span>
                  <span className="font-mono text-emerald-400 font-semibold">99.999% SLA</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Jurisdiction:</span>
                  <span className="font-mono text-indigo-300">London (UK-01)</span>
                </div>
              </div>
            </div>

            {/* Case Study 2 */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 space-y-5 hover:border-indigo-500/50 transition-all duration-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-indigo-400">
                  Case Study 02
                </span>
                <span className="rounded bg-slate-800 px-2 py-0.5 text-[11px] font-mono text-slate-300">
                  BaFin Compliant
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-100">Helios Global Vector Inc</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Deployed cross-border EU GDPR compliance vaults with automated zero-knowledge cold
                storage synchronization and pre-signed cryptographic client uploads.
              </p>
              <div className="border-t border-slate-800 pt-4 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Storage Protection:</span>
                  <span className="font-mono text-slate-200 font-semibold">Private By Default</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Cross-Tenant Leakage:</span>
                  <span className="font-mono text-emerald-400 font-semibold">
                    0.00% (Mathematically Verified)
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Jurisdiction:</span>
                  <span className="font-mono text-indigo-300">Frankfurt (DE-01)</span>
                </div>
              </div>
            </div>

            {/* Case Study 3 */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 space-y-5 hover:border-indigo-500/50 transition-all duration-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-indigo-400">
                  Case Study 03
                </span>
                <span className="rounded bg-slate-800 px-2 py-0.5 text-[11px] font-mono text-slate-300">
                  SEC Ready
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-100">Vanguard Enterprise Blueprints</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                One-click sovereign tenancy provisioning for rapid institutional onboarding,
                featuring automated background invoicing and 7-day cryptographically expiring team
                invitations.
              </p>
              <div className="border-t border-slate-800 pt-4 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Provisioning Time:</span>
                  <span className="font-mono text-slate-200 font-semibold">
                    &lt; 350 Milliseconds
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">RBAC Role Enforcement:</span>
                  <span className="font-mono text-emerald-400 font-semibold">
                    Owner / Admin / Member / Viewer
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Jurisdiction:</span>
                  <span className="font-mono text-indigo-300">New York (US-01)</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Transparent Pricing & Feature Gates */}
        <PricingSection />

        {/* 6. Direct Contact & Corporate Inquiry */}
        <section id="contact" aria-labelledby="contact-heading" className="space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-950/80 border border-indigo-800/60 px-3.5 py-1 text-xs font-mono font-medium text-indigo-300">
              <LockIcon className="w-3.5 h-3.5" />
              <span>Sovereign Engagement Channel</span>
            </div>
            <h2
              id="contact-heading"
              className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight"
            >
              Direct Corporate Engagement
            </h2>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              Initiate a confidential architecture consultation or license procurement directly with
              our Senior Systems Engineers.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <CorporateContactForm />
          </div>
        </section>
      </main>

      {/* 7. Institutional Footer */}
      <footer className="mt-28 border-t border-slate-800 bg-[#070B13] text-slate-400 text-xs py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-mono font-bold text-white text-xs">
                MCV
              </div>
              <span className="font-bold text-slate-200 text-sm">
                Morland Chambers Vector Systems
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-6 font-mono text-slate-400 text-xs">
              <span>Jurisdictions: London · Frankfurt · Singapore · New York</span>
              <span className="text-emerald-400">● Systems Operational</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500">
            <p>
              © 2026 Morland Chambers Vector. All corporate rights reserved. Institutional web
              architecture sales platform.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/design" className="hover:text-slate-300 transition-colors">
                Design System (/design)
              </Link>
              <Link href="/dashboard" className="hover:text-slate-300 transition-colors">
                Client Console
              </Link>
              <a
                href="mailto:info@morelandchambers.com"
                className="hover:text-indigo-400 transition-colors font-mono"
              >
                info@morelandchambers.com
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
