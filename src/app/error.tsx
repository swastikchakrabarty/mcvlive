"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowRightIcon } from "@/components/ui/icons";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log structured client error event with unique client timestamp
    console.error(
      JSON.stringify({
        level: "ERROR",
        type: "CLIENT_ERROR_BOUNDARY_TRIGGERED",
        message: error.message,
        digest: error.digest,
        timestamp: new Date().toISOString(),
      }),
    );
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-white flex items-center justify-center p-6 selection:bg-[#E6C594] selection:text-black">
      <div className="relative max-w-lg w-full rounded-3xl border border-[#E6C594]/40 bg-[#121216]/90 p-8 sm:p-10 text-center shadow-[0_0_50px_rgba(230,197,148,0.18)] backdrop-blur-2xl space-y-6">
        {/* Ambient Golden Glow Accent */}
        <div
          className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full bg-[#E6C594]/20 blur-2xl -z-10"
          aria-hidden="true"
        />

        <div className="inline-flex items-center gap-2 rounded-full border border-[#E6C594]/40 bg-[#0A0A0C] px-4 py-1.5 text-[11px] font-mono uppercase tracking-[0.22em] text-[#F3D5A0]">
          <span>Operational Circuit Breaker</span>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-white uppercase">
            Temporary System Interruption
          </h2>
          <p className="text-xs sm:text-sm text-[#A0A0B0] font-light leading-relaxed">
            Our autonomous monitoring systems have captured this event. No client data was
            compromised under our sovereign isolation protocols.
          </p>
        </div>

        {error.digest && (
          <div className="inline-flex items-center gap-2 rounded-lg border border-[#E6C594]/20 bg-[#0A0A0C]/80 px-3.5 py-1.5 text-[11px] font-mono text-[#D0D0E0]">
            <span className="text-[#E6C594]">Trace ID:</span>
            <span>{error.digest}</span>
          </div>
        )}

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#E6C594] via-[#F3D5A0] to-[#E6C594] px-6 py-3 text-xs uppercase font-bold tracking-[0.2em] text-black shadow-[0_0_25px_rgba(230,197,148,0.35)] hover:shadow-[0_0_40px_rgba(230,197,148,0.55)] hover:scale-[1.02] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F3D5A0]"
          >
            <span>Restore Runtime</span>
            <ArrowRightIcon className="w-3.5 h-3.5" />
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-[#E6C594]/40 bg-[#0A0A0C] px-6 py-3 text-xs uppercase font-medium tracking-[0.2em] text-[#F3D5A0] hover:bg-[#181822] transition-all"
          >
            Return to Sovereign Home
          </Link>
        </div>
      </div>
    </div>
  );
}
