"use client";

import React, { useState } from "react";
import { useToast } from "@/components/ui";
import { CheckIcon, SpinnerIcon, ArrowRightIcon } from "@/components/ui/icons";

interface LuxuryContactFormProps {
  initialTier?: string;
}

interface FormState {
  businessName: string;
  ownerName: string;
  companyEmail: string;
  budget: string;
  tierSelected?: string;
  message?: string;
}

interface FormErrors {
  businessName?: string;
  ownerName?: string;
  companyEmail?: string;
  budget?: string;
}

export const TIER_BUDGET_MAP: Record<string, string> = {
  landing_page: "$200 USD (Tier 1: Bespoke Landing Page)",
  ecommerce_store: "$800 USD (Tier 2: E-Commerce Store)",
  complete_enterprise: "$2,500 USD (Tier 3: Complete Enterprise System)",
};

export const BUDGET_OPTIONS = [
  "$200 USD (Tier 1: Bespoke Landing Page)",
  "$800 USD (Tier 2: E-Commerce Store)",
  "$2,500 USD (Tier 3: Complete Enterprise System)",
  "$2,500+ USD (Custom Scaling Infrastructure)",
];

export function LuxuryContactForm({ initialTier }: LuxuryContactFormProps) {
  const { toast } = useToast();
  const [prevTier, setPrevTier] = useState(initialTier);
  const [formData, setFormData] = useState<FormState>({
    businessName: "",
    ownerName: "",
    companyEmail: "",
    budget:
      initialTier && TIER_BUDGET_MAP[initialTier]
        ? TIER_BUDGET_MAP[initialTier]
        : BUDGET_OPTIONS[1]!,
    tierSelected: initialTier || "ecommerce_store",
    message: "",
  });

  // Adjust state during render when initialTier prop changes from parent pricing selection
  if (initialTier !== prevTier) {
    setPrevTier(initialTier);
    if (initialTier) {
      setFormData((prev) => ({
        ...prev,
        tierSelected: initialTier,
        budget: TIER_BUDGET_MAP[initialTier] ?? prev.budget,
      }));
    }
  }

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successResponse, setSuccessResponse] = useState<{
    referenceId: string;
    message: string;
  } | null>(null);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.businessName.trim() || formData.businessName.trim().length < 2) {
      newErrors.businessName = "Please enter your legal business or enterprise name.";
    }

    if (!formData.ownerName.trim() || formData.ownerName.trim().length < 2) {
      newErrors.ownerName = "Please enter the principal owner or signatory's full name.";
    }

    if (!formData.companyEmail.trim()) {
      newErrors.companyEmail = "Corporate domain email is required.";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.companyEmail.trim())) {
        newErrors.companyEmail = "Please enter a valid corporate email address.";
      }
    }

    if (!formData.budget.trim()) {
      newErrors.budget = "Please select an expected budget or price point.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        const errorMsg = json.error?.message || "Failed to submit inquiry. Please try again.";
        toast({
          type: "error",
          title: "Submission Error",
          description: errorMsg,
        });
        setIsSubmitting(false);
        return;
      }

      setSuccessResponse({
        referenceId: json.data.referenceId,
        message: json.data.message,
      });

      toast({
        type: "success",
        title: "Inquiry Cryptographically Registered",
        description: `Reference #${json.data.referenceId} confirmed. Direct notification sent to info@morelandchambers.com.`,
      });
    } catch {
      toast({
        type: "error",
        title: "Network Error",
        description:
          "Unable to connect to the Morland Chambers Vector gateway. Please email info@morelandchambers.com directly.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (successResponse) {
    return (
      <div className="rounded-3xl border border-[#E6C594]/60 bg-[#121216]/95 p-8 sm:p-12 text-center shadow-[0_0_50px_rgba(230,197,148,0.25)] backdrop-blur-2xl space-y-6 text-white animate-in fade-in duration-300">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#E6C594]/15 border border-[#E6C594]/60 text-[#F3D5A0]">
          <CheckIcon className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#F3D5A0] font-semibold">
            Inquiry Protocol Verified
          </span>
          <h3 className="text-2xl sm:text-3xl font-light tracking-tight text-white">
            Engagement Request Logged
          </h3>
          <p className="text-sm text-[#A0A0B0] font-light max-w-lg mx-auto leading-relaxed">
            {successResponse.message} Direct dispatch routed to{" "}
            <span className="font-mono text-[#F3D5A0] font-medium">info@morelandchambers.com</span>.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full border border-[#E6C594]/40 bg-[#0A0A0C] px-5 py-2 text-xs font-mono text-white shadow-md">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
          <span>Tracking Reference: {successResponse.referenceId}</span>
        </div>

        <div className="pt-4">
          <button
            type="button"
            onClick={() => {
              setSuccessResponse(null);
              setFormData({
                businessName: "",
                ownerName: "",
                companyEmail: "",
                budget: BUDGET_OPTIONS[1]!,
                tierSelected: "ecommerce_store",
                message: "",
              });
            }}
            className="text-xs uppercase font-semibold tracking-[0.2em] text-[#E6C594] hover:text-[#F3D5A0] underline underline-offset-4 cursor-pointer"
          >
            Submit Another Project Brief
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      id="contact-form"
      onSubmit={handleSubmit}
      noValidate
      className="rounded-3xl border border-[#E6C594]/35 bg-[#121216]/85 p-8 sm:p-12 shadow-[0_0_40px_rgba(230,197,148,0.12)] backdrop-blur-2xl space-y-8"
    >
      <div className="space-y-2 border-b border-[#E6C594]/20 pb-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#F3D5A0] font-semibold block">
            Direct Acquisition Channel
          </span>
          {formData.tierSelected && (
            <div className="inline-flex items-center gap-2 rounded-full border border-[#E6C594]/40 bg-[#0A0A0C] px-3.5 py-1 text-[11px] font-mono text-[#F3D5A0] shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E6C594] animate-pulse" />
              <span>
                Pre-Selected:{" "}
                <strong className="text-white font-medium">
                  {formData.tierSelected === "landing_page"
                    ? "Tier 1: Landing Page ($200 USD)"
                    : formData.tierSelected === "ecommerce_store"
                      ? "Tier 2: E-Commerce Store ($800 USD)"
                      : formData.tierSelected === "complete_enterprise"
                        ? "Tier 3: Complete Enterprise System ($2,500 USD)"
                        : formData.tierSelected}
                </strong>
              </span>
            </div>
          )}
        </div>
        <h3 className="text-2xl sm:text-3xl font-light tracking-tight text-white">
          Initiate Executive Discussion
        </h3>
        <p className="text-xs text-[#A0A0B0] font-light">
          Inquiries are handled strictly by our Senior Systems Engineering team under mutual
          non-disclosure terms. Contact:{" "}
          <span className="text-[#F3D5A0] font-medium font-mono">info@morelandchambers.com</span>.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Business Name */}
        <div className="space-y-2">
          <label
            htmlFor="businessName"
            className="block text-[11px] uppercase font-mono tracking-[0.2em] text-[#D0D0E0] font-medium"
          >
            Business Name <span className="text-[#F3D5A0]">*</span>
          </label>
          <input
            id="businessName"
            type="text"
            required
            value={formData.businessName}
            onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
            placeholder="e.g. Apex Sovereign Holdings Ltd"
            className={`w-full rounded-xl border bg-[#0A0A0C]/90 px-4 py-3.5 text-sm text-white placeholder:text-[#6A6A7A] transition-all focus:outline-none focus:ring-2 focus:ring-[#F3D5A0]/40 ${
              errors.businessName
                ? "border-rose-500"
                : "border-[#E6C594]/30 hover:border-[#E6C594]/60 focus:border-[#F3D5A0]"
            }`}
          />
          {errors.businessName && (
            <p className="text-[11px] text-rose-400 font-light">{errors.businessName}</p>
          )}
        </div>

        {/* Owner's Name */}
        <div className="space-y-2">
          <label
            htmlFor="ownerName"
            className="block text-[11px] uppercase font-mono tracking-[0.2em] text-[#D0D0E0] font-medium"
          >
            Owner&apos;s / Signatory Name <span className="text-[#F3D5A0]">*</span>
          </label>
          <input
            id="ownerName"
            type="text"
            required
            value={formData.ownerName}
            onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
            placeholder="e.g. Julian Morland"
            className={`w-full rounded-xl border bg-[#0A0A0C]/90 px-4 py-3.5 text-sm text-white placeholder:text-[#6A6A7A] transition-all focus:outline-none focus:ring-2 focus:ring-[#F3D5A0]/40 ${
              errors.ownerName
                ? "border-rose-500"
                : "border-[#E6C594]/30 hover:border-[#E6C594]/60 focus:border-[#F3D5A0]"
            }`}
          />
          {errors.ownerName && (
            <p className="text-[11px] text-rose-400 font-light">{errors.ownerName}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Company Email */}
        <div className="space-y-2">
          <label
            htmlFor="companyEmail"
            className="block text-[11px] uppercase font-mono tracking-[0.2em] text-[#D0D0E0] font-medium"
          >
            Company Email Address <span className="text-[#F3D5A0]">*</span>
          </label>
          <input
            id="companyEmail"
            type="email"
            required
            value={formData.companyEmail}
            onChange={(e) => setFormData({ ...formData, companyEmail: e.target.value })}
            placeholder="julian@apexholdings.com"
            className={`w-full rounded-xl border bg-[#0A0A0C]/90 px-4 py-3.5 text-sm text-white placeholder:text-[#6A6A7A] transition-all focus:outline-none focus:ring-2 focus:ring-[#F3D5A0]/40 ${
              errors.companyEmail
                ? "border-rose-500"
                : "border-[#E6C594]/30 hover:border-[#E6C594]/60 focus:border-[#F3D5A0]"
            }`}
          />
          {errors.companyEmail && (
            <p className="text-[11px] text-rose-400 font-light">{errors.companyEmail}</p>
          )}
        </div>

        {/* Expected Budget / Price Point */}
        <div className="space-y-2">
          <label
            htmlFor="budget"
            className="block text-[11px] uppercase font-mono tracking-[0.2em] text-[#D0D0E0] font-medium"
          >
            Expected Budget / Price Point <span className="text-[#F3D5A0]">*</span>
          </label>
          <select
            id="budget"
            required
            value={formData.budget}
            onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
            className={`w-full appearance-none rounded-xl border bg-[#0A0A0C]/90 px-4 py-3.5 text-sm text-white transition-all focus:outline-none focus:ring-2 focus:ring-[#F3D5A0]/40 ${
              errors.budget
                ? "border-rose-500"
                : "border-[#E6C594]/30 hover:border-[#E6C594]/60 focus:border-[#F3D5A0]"
            }`}
          >
            {BUDGET_OPTIONS.map((opt) => (
              <option key={opt} value={opt} className="bg-[#121216] text-white py-1">
                {opt}
              </option>
            ))}
          </select>
          {errors.budget && <p className="text-[11px] text-rose-400 font-light">{errors.budget}</p>}
        </div>
      </div>

      {/* Scope / Notes */}
      <div className="space-y-2">
        <label
          htmlFor="contact-message"
          className="block text-[11px] uppercase font-mono tracking-[0.2em] text-[#D0D0E0] font-medium"
        >
          Scope Summary / Architecture Requirements (Optional)
        </label>
        <textarea
          id="contact-message"
          rows={3}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="Briefly describe your current platform, customer scaling bottlenecks, or target deployment date..."
          className="w-full rounded-xl border border-[#E6C594]/30 bg-[#0A0A0C]/90 p-4 text-sm text-white placeholder:text-[#6A6A7A] transition-all focus:outline-none focus:border-[#F3D5A0] focus:ring-2 focus:ring-[#F3D5A0]/40 hover:border-[#E6C594]/60"
        />
      </div>

      {/* Submit Trigger */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 px-8 rounded-full bg-gradient-to-r from-[#E6C594] via-[#F3D5A0] to-[#E6C594] text-black text-xs font-bold uppercase tracking-[0.24em] shadow-[0_0_35px_rgba(230,197,148,0.4)] hover:shadow-[0_0_50px_rgba(230,197,148,0.65)] hover:scale-[1.01] border border-[#FFF0D4]/80 transition-all duration-200 flex items-center justify-center gap-3 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F3D5A0] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <SpinnerIcon className="w-4 h-4 animate-spin text-black" />
              <span>Transmitting Architecture Request...</span>
            </>
          ) : (
            <>
              <span>Transmit Acquisition Brief</span>
              <ArrowRightIcon className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      <div className="flex items-center justify-center gap-4 text-[10px] font-mono uppercase tracking-[0.2em] text-[#A0A0B0] text-center pt-2">
        <span>Strict Non-Disclosure</span>
        <span>·</span>
        <span>Guaranteed 24-Hour Response</span>
        <span>·</span>
        <span>Zero Third-Party Telemetry</span>
      </div>
    </form>
  );
}
