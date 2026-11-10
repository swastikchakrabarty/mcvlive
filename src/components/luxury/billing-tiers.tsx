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
      "Cross-border multi-region failover (London · Zurich · New York · Singapore)",
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
        <div className="inline-flex items-center gap-2 rounded-full border border-[#E6C594]/40 bg-[#121216]/90 px-4 py-1.5 text-[11px] uppercase tracking-[0.25em] font-semibold text-[#F3D5A0] shadow-[0_0_20px_rgba(230,197,148,0.15)]">
          <span>Billing Systems & Engagement Models</span>
        </div>
        <h2
          id="billing-heading"
          className="text-3xl sm:text-5xl font-light tracking-tight text-white uppercase"
        >
          Predictable Capital Allocation
        </h2>
        <p className="text-sm sm:text-base text-[#A0A0B0] font-light max-w-2xl mx-auto leading-relaxed">
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
                  ? "backdrop-blur-2xl bg-[#16161D]/90 border-2 border-[#E6C594] shadow-[0_0_50px_rgba(230,197,148,0.22)] lg:-translate-y-2 ring-1 ring-[#F3D5A0]/40"
                  : isSelected
                    ? "backdrop-blur-xl bg-[#14141A]/90 border border-[#E6C594]/80 shadow-[0_0_40px_rgba(230,197,148,0.18)]"
                    : "backdrop-blur-xl bg-[#121216]/80 border border-[#E6C594]/30 shadow-[0_0_30px_rgba(230,197,148,0.08)] hover:border-[#E6C594]/70 hover:shadow-[0_0_40px_rgba(230,197,148,0.18)] hover:bg-[#16161D]"
              }`}
            >
              {/* Optional Priority Badge */}
              {tier.badge && (
                <div className="absolute -top-3.5 left-8">
                  <span className="rounded-full bg-gradient-to-r from-[#E6C594] via-[#F3D5A0] to-[#E6C594] px-4 py-1 text-[10px] font-sans font-bold uppercase tracking-[0.22em] text-black shadow-[0_0_20px_rgba(230,197,148,0.4)]">
                    {tier.badge}
                  </span>
                </div>
              )}

              <div className="space-y-6">
                {/* Header */}
                <div className="space-y-1.5 border-b border-[#E6C594]/20 pb-5">
                  <span className="text-[10px] uppercase font-mono tracking-[0.22em] text-[#F3D5A0] font-semibold block">
                    {tier.subtitle}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-light tracking-tight text-white">
                    {tier.name}
                  </h3>
                  <div className="pt-2 flex flex-col gap-0.5">
                    <span className="text-xs font-medium text-white">{tier.terms}</span>
                    <span className="text-[11px] text-[#A0A0B0] font-light">{tier.cadence}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-[#A0A0B0] font-light leading-relaxed min-h-[56px]">
                  {tier.description}
                </p>

                {/* Checklist with sophisticated gold checkmarks */}
                <div className="space-y-3 pt-2">
                  <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#E6C594]/80 block font-semibold">
                    Inclusions & Guarantees
                  </span>
                  <ul className="space-y-3">
                    {tier.highlights.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 text-xs font-light text-white"
                      >
                        <span className="shrink-0 mt-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#E6C594]/15 border border-[#E6C594]/60 text-[#F3D5A0]">
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
                  className={`w-full py-3.5 px-6 rounded-full text-xs font-semibold uppercase tracking-[0.22em] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F3D5A0] ${
                    tier.isPriority
                      ? "bg-gradient-to-r from-[#E6C594] via-[#F3D5A0] to-[#E6C594] text-black shadow-[0_0_25px_rgba(230,197,148,0.35)] hover:shadow-[0_0_40px_rgba(230,197,148,0.55)] hover:scale-[1.02]"
                      : isSelected
                        ? "bg-[#E6C594] text-black shadow-[0_0_20px_rgba(230,197,148,0.3)]"
                        : "bg-[#0A0A0C]/90 text-[#F3D5A0] border border-[#E6C594]/50 hover:bg-[#E6C594] hover:text-black shadow-[0_0_15px_rgba(230,197,148,0.1)]"
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
