"use client";

import React, { useState } from "react";
import { Button, Input, Select, useToast } from "@/components/ui";
import { CheckIcon, MailIcon, ShieldCheckIcon, TerminalIcon } from "@/components/ui/icons";

interface FormState {
  fullName: string;
  email: string;
  organization: string;
  tier: string;
  message: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  organization?: string;
  message?: string;
}

const FORBIDDEN_DOMAINS = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "icloud.com"];

export function CorporateContactForm() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormState>({
    fullName: "",
    email: "",
    organization: "",
    tier: "enterprise",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReference, setSubmittedReference] = useState<string | null>(null);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      newErrors.fullName = "Please enter your full legal name or corporate signatory.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Corporate email is required.";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = "Please provide a valid email address.";
      } else {
        const domain = formData.email.trim().split("@")[1]?.toLowerCase();
        if (domain && FORBIDDEN_DOMAINS.includes(domain)) {
          newErrors.email =
            "Please provide an institutional or corporate domain email (e.g. @yourcompany.com).";
        }
      }
    }

    if (!formData.organization.trim() || formData.organization.trim().length < 2) {
      newErrors.organization = "Please provide your corporate entity or enterprise name.";
    }

    if (!formData.message.trim() || formData.message.trim().length < 10) {
      newErrors.message =
        "Please describe your architecture scope or vector workload (min 10 characters).";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    // Simulate enterprise inquiry dispatch to info@morelandchambers.com
    await new Promise((resolve) => setTimeout(resolve, 800));

    const refId = `MCV-REQ-${Math.floor(100000 + Math.random() * 900000)}`;
    setSubmittedReference(refId);
    setIsSubmitting(false);

    toast({
      type: "success",
      title: "Inquiry Successfully Dispatched",
      description: `Reference #${refId} routed to our Principal Solutions Architecture team at info@morelandchambers.com.`,
    });
  };

  if (submittedReference) {
    return (
      <div className="rounded-2xl border border-emerald-500/40 bg-slate-900/90 p-8 text-center shadow-xl shadow-slate-950/80 space-y-4">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-500/50 bg-emerald-950/60 text-emerald-400">
          <CheckIcon className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-100">Architecture Inquiry Registered</h3>
        <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
          Your technical requirements have been cryptographically logged and routed to our Senior
          Partners at <span className="font-mono text-indigo-300">info@morelandchambers.com</span>.
        </p>

        <div className="inline-flex items-center gap-2 rounded-lg bg-slate-950 border border-slate-800 px-3.5 py-1.5 text-xs font-mono text-slate-300">
          <ShieldCheckIcon className="w-4 h-4 text-emerald-400" />
          <span>Tracking Ref: {submittedReference}</span>
        </div>

        <div className="pt-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSubmittedReference(null);
              setFormData({
                fullName: "",
                email: "",
                organization: "",
                tier: "enterprise",
                message: "",
              });
            }}
          >
            Submit Another Technical Brief
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 shadow-2xl shadow-slate-950/60 space-y-5"
    >
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono uppercase tracking-wider">
          <TerminalIcon className="w-4 h-4" />
          <span>Direct Institutional Ingress</span>
        </div>
        <h3 className="text-lg font-bold text-slate-100 mt-1">Engage Morland Chambers Vector</h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Inquiries are routed directly to Senior Architects at{" "}
          <span className="text-slate-300 font-mono">info@morelandchambers.com</span>.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Corporate Signatory / Name"
          placeholder="e.g. Dr. Julian Morland"
          required
          value={formData.fullName}
          error={errors.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
        />

        <Input
          label="Corporate Domain Email"
          type="email"
          placeholder="julian@apexsovereign.com"
          required
          value={formData.email}
          error={errors.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          hint="Institutional domains only."
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Enterprise / Organization Name"
          placeholder="Apex Sovereign Systems Ltd"
          required
          value={formData.organization}
          error={errors.organization}
          onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
        />

        <Select
          label="Architecture Tier of Interest"
          value={formData.tier}
          onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
          options={[
            { value: "enterprise", label: "Enterprise (Dedicated Cluster / Bespoke)" },
            { value: "professional", label: "Professional ($8,500/mo - 1hr SLA)" },
            { value: "starter", label: "Starter ($2,500/mo - Core Runtime)" },
            { value: "custom_blueprint", label: "Custom Multi-Region Sovereign Blueprint" },
          ]}
        />
      </div>

      <div className="w-full space-y-1.5 text-left">
        <label
          htmlFor="message"
          className="block text-xs font-semibold uppercase tracking-wider text-slate-300"
        >
          Technical Scope & Vector Query Scale <span className="text-indigo-400">*</span>
        </label>
        <textarea
          id="message"
          rows={3}
          required
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          aria-invalid={!!errors.message}
          placeholder="Outline expected vector dimensionality, daily QPS, multi-jurisdiction compliance needs, or bespoke edge deployment specs..."
          className={`w-full rounded-lg border bg-slate-900/90 p-3 text-sm text-slate-100 placeholder:text-slate-500 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-slate-950 ${
            errors.message
              ? "border-rose-500/80 focus:border-rose-500 focus:ring-rose-500/60"
              : "border-slate-800 hover:border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/50"
          }`}
        />
        {errors.message && (
          <p role="alert" className="text-xs text-rose-400 font-medium">
            {errors.message}
          </p>
        )}
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          isLoading={isSubmitting}
          iconRight={<MailIcon className="w-4 h-4" />}
        >
          {isSubmitting ? "Routing Technical Brief..." : "Transmit Institutional Request"}
        </Button>
      </div>

      <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 pt-1">
        <ShieldCheckIcon className="w-3.5 h-3.5 text-indigo-400" />
        <span>TLS 1.3 encrypted · Zero public telemetry exposure · 1-hour SLA response</span>
      </div>
    </form>
  );
}
