"use client";

import { useState } from "react";
import { ArrowRightIcon } from "@/components/ui/icons";

export interface BillingTier {
  id: string;
  name: string;
  badge?: string;
  subtitle: string;
  terms: string;
  cadence: string;
  description: string;
  highlights: string[];
  ctaLabel: string;
  isPriority?: boolean;
}

const BILLING_TIERS: BillingTier[] = [
  {
    id: "50_advance",
    name: "50% Advance",
    subtitle: "Milestone-Based Execution",
    terms: "50% Upon Mobilization / 50% Upon Acceptance",
    cadence: "Structured Phase Delivery",
    description:
      "A balanced, milestone-governed capital structure. Engineered for established corporate teams requiring phased validation, sequential sprint approvals, and formal acceptance protocols before production deployment.",
    highlights: [
      "50% mobilization retainer to initiate technical architecture sprint",
      "50% upon final acceptance testing & verified production cutover",
      "Bi-weekly sprint demonstrations & architecture governance reviews",
      "Dedicated senior engineering team & direct Slack/Signal bridge",
      "Immutable source code handover & sovereign cloud infrastructure documentation",
      "30-day post-launch warranty, performance optimization & bug-free guarantee",
    ],
    ctaLabel: "Select Milestone Structure",
  },
  {
    id: "100_advance",
    name: "100% Payment in Advance",
    badge: "Instant Priority Deployment",
    subtitle: "Expedited Velocity & Immediate Mobilization",
    terms: "100% Upfront Settlement",
    cadence: "10% Preferred Cash Optimization",
    description:
      "Our most accelerated engagement protocol. Full upfront capital allocation unlocks instantaneous day-one mobilization, dedicated Principal Architect immersion, parallel sprint execution, and priority infrastructure queue placement.",
    highlights: [
      "10% preferred institutional cash discount applied to total contract",
      "Guaranteed day-one mobilization with zero queue lag",
      "Dedicated Principal Systems Architect and senior engineering squad",
      "Continuous live staging environment with daily automated test builds",
      "Accelerated delivery timeline with parallelized full-stack sprints",
      "90-day extended VIP post-launch warranty with 24/7 emergency response SLA",
    ],
    ctaLabel: "Select Priority Deployment",
    isPriority: true,
  },
  {
    id: "phone_discussion",
    name: "Discussed on the Phone",
    subtitle: "Custom Enterprise Scope",
    terms: "Custom Governance & Retainer Terms",
    cadence: "Tailored to Enterprise Scale",
    description:
      "A bespoke contractual framework tailored for complex multi-jurisdiction requirements, high-throughput vector clusters, regulatory compliance vaults, or ongoing enterprise architectural retainers.",
    highlights: [
      "Private executive architecture discovery call with Senior Partners",
      "Custom Master Services Agreement (MSA) & customized SLA covenants",
      "Flexible milestone distributions, equity partnerships, or revenue-share models",
      "Dedicated private VPC, sovereign bare-metal, or on-premise installation",
      "Cross-border multi-region failover (London · Frankfurt · New York · Singapore)",
      "Ongoing long-term retainers & continuous solutions engineering advisory",
    ],
    ctaLabel: "Schedule Executive Call",
  },
];

interface BillingTiersProps {
  onSelectTier?: (tierId: string) => void;
}

export function LuxuryBillingTiers({ onSelectTier }: BillingTiersProps) {
  const [activeTierId, setActiveTierId] = useState<string>("100_advance");

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
        <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/40 bg-white/80 px-4 py-1 text-[11px] uppercase tracking-[0.25em] font-semibold text-[#8C734B] shadow-sm">
          <span>Billing Systems & Engagement Models</span>
        </div>
        <h2
          id="billing-heading"
          className="text-3xl sm:text-5xl font-extralight tracking-tight text-[#171717] uppercase"
        >
          Predictable Capital Allocation
        </h2>
        <p className="text-sm sm:text-base text-[#5A5A5A] font-light max-w-2xl mx-auto leading-relaxed">
          Transparent, institutional billing structures engineered to align velocity, risk
          management, and technical excellence. Select the engagement model suited to your capital
          strategy.
        </p>
      </div>

      {/* 3 Tier Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        {BILLING_TIERS.map((tier) => {
          const isSelected = activeTierId === tier.id;
          return (
            <div
              key={tier.id}
              onClick={() => setActiveTierId(tier.id)}
              className={`relative flex flex-col justify-between rounded-3xl p-8 sm:p-9 transition-all duration-300 cursor-pointer ${
                tier.isPriority
                  ? "bg-white/85 backdrop-blur-xl border-2 border-[#D4AF37] shadow-2xl shadow-amber-950/10 lg:-translate-y-2"
                  : isSelected
                    ? "bg-white/80 backdrop-blur-xl border border-[#D4AF37]/80 shadow-xl shadow-amber-950/5"
                    : "bg-white/65 backdrop-blur-md border border-[#E8E2D8] hover:border-[#D4AF37]/60 shadow-lg shadow-neutral-900/5 hover:bg-white/75"
              }`}
            >
              {/* Optional Priority Badge */}
              {tier.badge && (
                <div className="absolute -top-3.5 left-8">
                  <span className="rounded-full bg-[#171717] px-4 py-1 text-[10px] font-sans font-semibold uppercase tracking-[0.22em] text-[#D4AF37] shadow-md border border-[#D4AF37]/40">
                    {tier.badge}
                  </span>
                </div>
              )}

              <div className="space-y-6">
                {/* Header */}
                <div className="space-y-1.5 border-b border-[#E8E2D8]/80 pb-5">
                  <span className="text-[10px] uppercase font-mono tracking-[0.22em] text-[#8C734B] font-semibold block">
                    {tier.subtitle}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-light tracking-tight text-[#171717]">
                    {tier.name}
                  </h3>
                  <div className="pt-2 flex flex-col gap-0.5">
                    <span className="text-xs font-medium text-[#171717]">{tier.terms}</span>
                    <span className="text-[11px] text-[#8C8C8C] font-light">{tier.cadence}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-[#5A5A5A] font-light leading-relaxed min-h-[56px]">
                  {tier.description}
                </p>

                {/* Checklist with sophisticated gold checkmarks */}
                <div className="space-y-3 pt-2">
                  <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#8C8C8C] block font-semibold">
                    Inclusions & Guarantees
                  </span>
                  <ul className="space-y-3">
                    {tier.highlights.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 text-xs font-light text-[#262626]"
                      >
                        <span className="shrink-0 mt-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#FAF5EB] border border-[#D4AF37]/50 text-[#8C734B]">
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
                        <span className="leading-snug">{item}</span>
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
                  className={`w-full py-3.5 px-6 rounded-full text-xs font-medium uppercase tracking-[0.22em] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] ${
                    tier.isPriority
                      ? "bg-[#171717] text-white hover:bg-[#2B2B2B] shadow-md border border-[#D4AF37]/40"
                      : isSelected
                        ? "bg-[#171717] text-white hover:bg-[#2B2B2B]"
                        : "bg-white text-[#171717] border border-[#D4AF37]/60 hover:bg-[#171717] hover:text-white hover:border-[#171717]"
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
