"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import { CheckIcon, ZapIcon } from "@/components/ui/icons";

interface PricingTier {
  id: "starter" | "professional" | "enterprise";
  name: string;
  badge?: string;
  price: string;
  cadence: string;
  description: string;
  features: { name: string; included: boolean }[];
  ctaText: string;
  isPopular?: boolean;
}

const TIERS: PricingTier[] = [
  {
    id: "starter",
    name: "Vector Core Starter",
    price: "$2,500",
    cadence: "per month / billed annually",
    description:
      "Essential high-performance vector infrastructure for pilot production and sovereign application prototyping.",
    features: [
      { name: "Single isolated tenant partition", included: true },
      { name: "10 Million dense vectors (1536-dim)", included: true },
      { name: "Sub-15ms P99 semantic search latency", included: true },
      { name: "Standard REST API & Next.js RSC Client", included: true },
      { name: "Anti-BOLA / IDOR security enforcement", included: true },
      { name: "High-throughput inference microservice", included: false },
      { name: "Custom vector blueprints", included: false },
      { name: "Dedicated sovereign VPC cluster", included: false },
      { name: "1-hour priority engineering SLA", included: false },
    ],
    ctaText: "Initialize Starter Runtime",
  },
  {
    id: "professional",
    name: "Professional Architecture",
    badge: "Institutional Standard",
    isPopular: true,
    price: "$8,500",
    cadence: "per month / billed annually",
    description:
      "Enterprise vector pipeline with high-throughput inference microservices and custom vector blueprints.",
    features: [
      { name: "Multi-workspace tenant routing (Up to 10)", included: true },
      { name: "75 Million dense vectors (HNSW / IVF-PQ)", included: true },
      { name: "Sub-5ms P99 semantic search latency", included: true },
      { name: "High-throughput FastAPI inference engine", included: true },
      { name: "Custom vector blueprints & schema migration", included: true },
      { name: "1-Hour priority engineering SLA", included: true },
      { name: "Cryptographic audit trail logging", included: true },
      { name: "Dedicated sovereign VPC cluster", included: false },
      { name: "Unlimited workspaces & custom weights", included: false },
    ],
    ctaText: "Deploy Professional Stack",
  },
  {
    id: "enterprise",
    name: "Enterprise Sovereign Blueprints",
    badge: "Mission Critical",
    price: "Bespoke",
    cadence: "contact for institutional terms",
    description:
      "Dedicated multi-region active-active clusters with custom neural weights, zero-knowledge vaults, and 24/7 dedicated teams.",
    features: [
      { name: "Unlimited sovereign workspace partitions", included: true },
      { name: "Billion-scale distributed vector storage", included: true },
      { name: "Sub-3ms P99 latency with dedicated L2 caches", included: true },
      { name: "Dedicated private VPC / Bare-Metal edge", included: true },
      { name: "Custom fine-tuned vector embeddings", included: true },
      { name: "Multi-jurisdiction GDPR / FCA / MAS compliance", included: true },
      { name: "24/7/365 Dedicated Principal Architect line", included: true },
      { name: "15-Minute emergency incident SLA", included: true },
      { name: "Continuous penetration audits & RLS proofs", included: true },
    ],
    ctaText: "Consult Principal Engineers",
  },
];

export function PricingSection() {
  const [selectedTier, setSelectedTier] = useState<"starter" | "professional" | "enterprise">(
    "professional",
  );

  return (
    <section id="pricing" aria-labelledby="pricing-heading" className="space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full bg-indigo-950/80 border border-indigo-800/60 px-3.5 py-1 text-xs font-mono font-medium text-indigo-300">
          <ZapIcon className="w-3.5 h-3.5" />
          <span>Tiered Architecture Licensing</span>
        </div>
        <h2
          id="pricing-heading"
          className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight"
        >
          Transparent Licensing & Sovereign Infrastructure
        </h2>
        <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
          Predictable enterprise contracts with zero hidden query surcharges. Every tier is
          cryptographically isolated with hardened Row-Level Security.
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        {TIERS.map((tier) => {
          const isSelected = selectedTier === tier.id;
          return (
            <div
              key={tier.id}
              onClick={() => setSelectedTier(tier.id)}
              className={`relative flex flex-col justify-between rounded-3xl p-8 transition-all duration-200 cursor-pointer ${
                isSelected
                  ? "border-2 border-indigo-500 bg-[#0E1528] shadow-2xl shadow-indigo-950/60 lg:-translate-y-2 ring-1 ring-indigo-500/50"
                  : tier.isPopular
                    ? "border-2 border-indigo-500/60 bg-[#0E1528] shadow-xl shadow-indigo-950/40"
                    : "border border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900"
              }`}
            >
              {tier.badge && (
                <div className="absolute -top-3.5 left-8">
                  <span className="rounded-full bg-indigo-600 px-3.5 py-1 text-[11px] font-mono font-bold uppercase tracking-wider text-white shadow-md shadow-indigo-950">
                    {tier.badge}
                  </span>
                </div>
              )}

              <div className="space-y-5">
                <div>
                  <h3 className="text-lg font-bold text-slate-100">{tier.name}</h3>
                  <p className="text-xs text-slate-400 mt-1 min-h-[36px]">{tier.description}</p>
                </div>

                <div className="border-t border-b border-slate-800/80 py-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
                      {tier.price}
                    </span>
                    {tier.price !== "Bespoke" && (
                      <span className="text-xs font-mono text-slate-400">/ mo</span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-500 block mt-1">{tier.cadence}</span>
                </div>

                <div className="space-y-3">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block font-semibold">
                    Architectural Inclusions
                  </span>
                  <ul className="space-y-2.5">
                    {tier.features.map((feat) => (
                      <li key={feat.name} className="flex items-start gap-2.5 text-xs">
                        {feat.included ? (
                          <CheckIcon className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        ) : (
                          <span className="w-4 h-4 rounded-full border border-slate-700 text-slate-600 flex items-center justify-center shrink-0 mt-0.5 text-[10px]">
                            ✕
                          </span>
                        )}
                        <span
                          className={
                            feat.included ? "text-slate-200" : "text-slate-500 line-through"
                          }
                        >
                          {feat.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-8">
                <a href="#contact">
                  <Button
                    variant={tier.isPopular ? "primary" : "secondary"}
                    className="w-full"
                    size="md"
                  >
                    {tier.ctaText}
                  </Button>
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
