"use client";

import { useState } from "react";
import { ArrowRightIcon } from "@/components/ui/icons";

export interface BillingTier {
  id: string;
  name: string;
  price: string;
  currency: string;
  badge?: string;
  subtitle: string;
  terms: string;
  cadence: string;
  description: string;
  highlights: string[];
  ctaLabel: string;
  isPriority?: boolean;
}

export const BILLING_TIERS: BillingTier[] = [
  {
    id: "landing_page",
    name: "Landing Page",
    price: "$200",
    currency: "USD",
    subtitle: "Bespoke Single-Page Storefront",
    terms: "Fixed Investment · Non-Negotiable",
    cadence: "Sub-100ms Edge Ingress",
    description:
      "A high-conversion bespoke single-page storefront engineered to capture customer interest instantly, establish institutional authority, and eliminate bounce rates with sub-100ms global edge delivery.",
    highlights: [
      "High-conversion bespoke single-page storefront",
      "SSL/TLS hardening & advanced security headers",
      "Enterprise DDoS protection & bot mitigation",
      "Sub-100ms global edge delivery (Next.js SSR)",
      "Zod-validated contact acquisition & lead capture",
      "Mobile-first responsive glassmorphic architecture",
    ],
    ctaLabel: "Select Landing Page",
  },
  {
    id: "ecommerce_store",
    name: "E-Commerce Store",
    price: "$800",
    currency: "USD",
    badge: "Most Popular",
    subtitle: "Full Commerce & Inventory Architecture",
    terms: "Fixed Investment · Non-Negotiable",
    cadence: "Turnkey Commercial Engine",
    description:
      "A full-scale transactional digital storefront built for high conversion, frictionless purchasing, automated inventory control, and enterprise payment orchestration across global currencies.",
    highlights: [
      "Full product catalog with instant search & filtering",
      "Secure payment gateways (Stripe & PayPal integrations)",
      "Automated real-time inventory tracking & stock alerts",
      "Robust PostgreSQL database architecture & schema",
      "Ongoing infrastructure maintenance & security patches",
      "Zero-latency cart checkout & transaction state synchronization",
    ],
    ctaLabel: "Select E-Commerce Store",
    isPriority: true,
  },
  {
    id: "complete_enterprise",
    name: "Complete Enterprise System",
    price: "$2,500",
    currency: "USD",
    subtitle: "Mission-Critical Sovereign Architecture",
    terms: "Fixed Investment · Non-Negotiable",
    cadence: "Institutional Production System",
    description:
      "Comprehensive, mission-critical digital infrastructure engineered with military-grade encryption, granular access control, dedicated management modules, and automated compliance auditing.",
    highlights: [
      "Multi-role access control (RBAC: Owner, Admin, Member, Viewer)",
      "Dedicated admin dashboard & administrative portal",
      "Logistics/management modules (e.g. hospital/library systems)",
      "Military-grade data encryption at rest & in transit (AES-256)",
      "Automated immutable audit logs & compliance telemetry",
      "PostgreSQL Row-Level Security (RLS) & Anti-BOLA authorization",
    ],
    ctaLabel: "Select Enterprise System",
  },
];

interface BillingTiersProps {
  onSelectTier?: (tierId: string) => void;
  selectedTierId?: string;
}

export function LuxuryBillingTiers({ onSelectTier, selectedTierId }: BillingTiersProps) {
  const [activeTierId, setActiveTierId] = useState<string>(selectedTierId || "ecommerce_store");

  // Keep internal state aligned if parent passes selectedTierId
  const currentActiveId = selectedTierId || activeTierId;

  const handleSelect = (tierId: string) => {
    setActiveTierId(tierId);
    if (onSelectTier) {
      onSelectTier(tierId);
    }
    const el = document.getElementById("contact");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="billing" aria-labelledby="billing-heading" className="space-y-16">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/40 bg-[#09090D]/90 px-4 py-1.5 text-[11px] uppercase tracking-[0.25em] font-semibold text-[#E5C158] shadow-[0_0_25px_rgba(212,175,55,0.18)]">
          <span>Fixed Market Pricing & Architecture Tiers</span>
        </div>
        <h2
          id="billing-heading"
          className="text-3xl sm:text-5xl font-light tracking-tight text-white uppercase"
        >
          Predictable Capital Allocation
        </h2>
        <p className="text-sm sm:text-base text-[#A8A8B8] font-light max-w-2xl mx-auto leading-relaxed">
          Transparent, non-negotiable capital allocations engineered for maximum conversion,
          sovereign security, and technical excellence. Select the engagement tier tailored to your
          scale.
        </p>
      </div>

      {/* 3 Tier Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        {BILLING_TIERS.map((tier) => {
          const isSelected = currentActiveId === tier.id;
          return (
            <div
              key={tier.id}
              onClick={() => handleSelect(tier.id)}
              className={`relative flex flex-col justify-between rounded-3xl p-6 sm:p-8 lg:p-9 transition-all duration-300 cursor-pointer ${
                tier.isPriority
                  ? "backdrop-blur-2xl bg-[#0D0D14]/95 border-2 border-[#D4AF37] shadow-[0_0_55px_rgba(212,175,55,0.25)] lg:-translate-y-2 ring-1 ring-[#E5C158]/50"
                  : isSelected
                    ? "backdrop-blur-xl bg-[#0B0B10]/95 border border-[#D4AF37]/90 shadow-[0_0_45px_rgba(212,175,55,0.2)]"
                    : "backdrop-blur-xl bg-[#09090D]/85 border border-[#D4AF37]/30 shadow-[0_0_35px_rgba(212,175,55,0.08)] hover:border-[#E5C158]/70 hover:shadow-[0_0_45px_rgba(212,175,55,0.2)] hover:bg-[#0D0D14]"
              }`}
            >
              {/* Optional Priority Badge */}
              {tier.badge && (
                <div className="absolute -top-3.5 left-8">
                  <span className="rounded-full bg-gradient-to-r from-[#D4AF37] via-[#FFF3D6] to-[#D4AF37] px-4 py-1 text-[10px] font-sans font-bold uppercase tracking-[0.22em] text-black shadow-[0_0_25px_rgba(212,175,55,0.45)]">
                    {tier.badge}
                  </span>
                </div>
              )}

              <div className="space-y-6">
                {/* Header with Subtitle, Title & Fixed Investment Amount */}
                <div className="space-y-2 border-b border-[#D4AF37]/20 pb-5">
                  <span className="text-[10px] uppercase font-mono tracking-[0.22em] text-[#E5C158] font-semibold block">
                    {tier.subtitle}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-light tracking-tight text-white">
                    {tier.name}
                  </h3>

                  {/* Prominent Fixed Investment Price Display */}
                  <div className="pt-2 flex items-baseline gap-2">
                    <span className="text-4xl sm:text-5xl font-extralight tracking-tight text-white font-mono">
                      {tier.price}
                    </span>
                    <span className="text-xs font-mono uppercase tracking-widest text-[#D4AF37] font-semibold">
                      {tier.currency}
                    </span>
                    <span className="text-[11px] text-[#A8A8B8] font-light">· Fixed Amount</span>
                  </div>

                  <div className="pt-1 flex flex-col gap-0.5">
                    <span className="text-xs font-medium text-white">{tier.terms}</span>
                    <span className="text-[11px] text-[#A8A8B8] font-light">{tier.cadence}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-[#A8A8B8] font-light leading-relaxed min-h-[56px]">
                  {tier.description}
                </p>

                {/* Checklist with sophisticated gold checkmarks */}
                <div className="space-y-3 pt-2">
                  <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#D4AF37]/90 block font-semibold">
                    Core Architectural Scope
                  </span>
                  <ul className="space-y-3">
                    {tier.highlights.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 text-xs font-light text-white"
                      >
                        <span className="shrink-0 mt-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/60 text-[#E5C158]">
                          <svg
                            className="w-2.5 h-2.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2.5}
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m4.5 12.75 6 6 9-13.5"
                            />
                          </svg>
                        </span>
                        <span className="leading-snug text-[#E2E2E8]">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-8">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(tier.id);
                  }}
                  className={`w-full py-3.5 px-6 rounded-full text-xs font-semibold uppercase tracking-[0.22em] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5C158] ${
                    tier.isPriority
                      ? "bg-gradient-to-r from-[#D4AF37] via-[#FFF3D6] to-[#D4AF37] text-black shadow-[0_0_30px_rgba(212,175,55,0.4)] hover:shadow-[0_0_45px_rgba(229,193,88,0.65)] hover:scale-[1.02]"
                      : isSelected
                        ? "bg-[#D4AF37] text-black shadow-[0_0_25px_rgba(212,175,55,0.35)]"
                        : "bg-[#070709]/90 text-[#E5C158] border border-[#D4AF37]/50 hover:bg-[#D4AF37] hover:text-black shadow-[0_0_20px_rgba(212,175,55,0.12)]"
                  }`}
                >
                  <span>{tier.ctaLabel}</span>
                  <ArrowRightIcon className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
