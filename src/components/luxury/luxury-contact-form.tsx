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

const BUDGET_OPTIONS = [
  "$15,000 – $30,000 (Standard Corporate Architecture)",
  "$30,000 – $60,000 (High-Throughput Web Application)",
  "$60,000 – $150,000 (Multi-Tenant Institutional System)",
  "$150,000+ (Custom Sovereign VPC / Enterprise Infrastructure)",
  "Bespoke / Discussed on Call",
];

export function LuxuryContactForm({ initialTier }: LuxuryContactFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormState>({
    businessName: "",
    ownerName: "",
    companyEmail: "",
    budget: BUDGET_OPTIONS[1]!,
    tierSelected: initialTier || "100_advance",
    message: "",
  });

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
      <div className="rounded-3xl border border-[#D4AF37]/50 bg-white/90 p-8 sm:p-12 text-center shadow-2xl shadow-amber-950/10 backdrop-blur-xl space-y-6 animate-in fade-in duration-300">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#FAF5EB] border border-[#D4AF37]/60 text-[#8C734B]">
          <CheckIcon className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#8C734B] font-semibold">
            Inquiry Protocol Verified
          </span>
          <h3 className="text-2xl sm:text-3xl font-light tracking-tight text-[#171717]">
            Engagement Request Logged
          </h3>
          <p className="text-sm text-[#5A5A5A] font-light max-w-lg mx-auto leading-relaxed">
            {successResponse.message} Direct dispatch routed to{" "}
            <span className="font-mono text-[#171717] font-medium">info@morelandchambers.com</span>.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full border border-[#E8E2D8] bg-[#FAF9F6] px-5 py-2 text-xs font-mono text-[#171717] shadow-sm">
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
                tierSelected: "100_advance",
                message: "",
              });
            }}
            className="text-xs uppercase font-medium tracking-[0.2em] text-[#5A5A5A] hover:text-[#171717] underline underline-offset-4 cursor-pointer"
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
      className="rounded-3xl border border-[#E8E2D8] bg-white/75 p-8 sm:p-12 shadow-2xl shadow-neutral-900/5 backdrop-blur-xl space-y-8"
    >
      <div className="space-y-2 border-b border-[#E8E2D8]/80 pb-6">
        <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#8C734B] font-semibold block">
          Direct Acquisition Channel
        </span>
        <h3 className="text-2xl sm:text-3xl font-light tracking-tight text-[#171717]">
          Initiate Executive Discussion
        </h3>
        <p className="text-xs text-[#666666] font-light">
          Inquiries are handled strictly by our Senior Systems Engineering team under mutual
          non-disclosure terms. Contact:{" "}
          <span className="text-[#171717] font-medium font-mono">info@morelandchambers.com</span>.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Business Name */}
        <div className="space-y-2">
          <label
            htmlFor="businessName"
            className="block text-[11px] uppercase font-mono tracking-[0.2em] text-[#5A5A5A] font-medium"
          >
            Business Name <span className="text-[#8C734B]">*</span>
          </label>
          <input
            id="businessName"
            type="text"
            required
            value={formData.businessName}
            onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
            placeholder="e.g. Apex Sovereign Holdings Ltd"
            className={`w-full rounded-xl border bg-white/90 px-4 py-3.5 text-sm text-[#171717] placeholder:text-[#A3A3A3] transition-colors focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 ${
              errors.businessName ? "border-rose-500" : "border-[#E8E2D8] hover:border-[#D4AF37]/60"
            }`}
          />
          {errors.businessName && (
            <p className="text-[11px] text-rose-600 font-light">{errors.businessName}</p>
          )}
        </div>

        {/* Owner's Name */}
        <div className="space-y-2">
          <label
            htmlFor="ownerName"
            className="block text-[11px] uppercase font-mono tracking-[0.2em] text-[#5A5A5A] font-medium"
          >
            Owner&apos;s / Signatory Name <span className="text-[#8C734B]">*</span>
          </label>
          <input
            id="ownerName"
            type="text"
            required
            value={formData.ownerName}
            onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
            placeholder="e.g. Julian Morland"
            className={`w-full rounded-xl border bg-white/90 px-4 py-3.5 text-sm text-[#171717] placeholder:text-[#A3A3A3] transition-colors focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 ${
              errors.ownerName ? "border-rose-500" : "border-[#E8E2D8] hover:border-[#D4AF37]/60"
            }`}
          />
          {errors.ownerName && (
            <p className="text-[11px] text-rose-600 font-light">{errors.ownerName}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Company Email */}
        <div className="space-y-2">
          <label
            htmlFor="companyEmail"
            className="block text-[11px] uppercase font-mono tracking-[0.2em] text-[#5A5A5A] font-medium"
          >
            Company Email Address <span className="text-[#8C734B]">*</span>
          </label>
          <input
            id="companyEmail"
            type="email"
            required
            value={formData.companyEmail}
            onChange={(e) => setFormData({ ...formData, companyEmail: e.target.value })}
            placeholder="julian@apexholdings.com"
            className={`w-full rounded-xl border bg-white/90 px-4 py-3.5 text-sm text-[#171717] placeholder:text-[#A3A3A3] transition-colors focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 ${
              errors.companyEmail ? "border-rose-500" : "border-[#E8E2D8] hover:border-[#D4AF37]/60"
            }`}
          />
          {errors.companyEmail && (
            <p className="text-[11px] text-rose-600 font-light">{errors.companyEmail}</p>
          )}
        </div>

        {/* Expected Budget / Price Point */}
        <div className="space-y-2">
          <label
            htmlFor="budget"
            className="block text-[11px] uppercase font-mono tracking-[0.2em] text-[#5A5A5A] font-medium"
          >
            Expected Budget / Price Point <span className="text-[#8C734B]">*</span>
          </label>
          <select
            id="budget"
            required
            value={formData.budget}
            onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
            className={`w-full appearance-none rounded-xl border bg-white/90 px-4 py-3.5 text-sm text-[#171717] transition-colors focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 ${
              errors.budget ? "border-rose-500" : "border-[#E8E2D8] hover:border-[#D4AF37]/60"
            }`}
          >
            {BUDGET_OPTIONS.map((opt) => (
              <option key={opt} value={opt} className="bg-white text-[#171717] py-1">
                {opt}
              </option>
            ))}
          </select>
          {errors.budget && <p className="text-[11px] text-rose-600 font-light">{errors.budget}</p>}
        </div>
      </div>

      {/* Scope / Notes */}
      <div className="space-y-2">
        <label
          htmlFor="contact-message"
          className="block text-[11px] uppercase font-mono tracking-[0.2em] text-[#5A5A5A] font-medium"
        >
          Scope Summary / Architecture Requirements (Optional)
        </label>
        <textarea
          id="contact-message"
          rows={3}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="Briefly describe your current platform, customer scaling bottlenecks, or target deployment date..."
          className="w-full rounded-xl border border-[#E8E2D8] bg-white/90 p-4 text-sm text-[#171717] placeholder:text-[#A3A3A3] transition-colors focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 hover:border-[#D4AF37]/60"
        />
      </div>

      {/* Submit Trigger */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 px-8 rounded-full bg-[#171717] text-white text-xs font-medium uppercase tracking-[0.24em] hover:bg-[#2B2B2B] shadow-xl shadow-neutral-900/10 border border-[#D4AF37]/50 transition-all duration-200 flex items-center justify-center gap-3 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <SpinnerIcon className="w-4 h-4 animate-spin text-[#D4AF37]" />
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

      <div className="flex items-center justify-center gap-4 text-[10px] font-mono uppercase tracking-[0.2em] text-[#8C8C8C] text-center pt-2">
        <span>Strict Non-Disclosure</span>
        <span>·</span>
        <span>Guaranteed 24-Hour Response</span>
        <span>·</span>
        <span>Zero Third-Party Telemetry</span>
      </div>
    </form>
  );
}
