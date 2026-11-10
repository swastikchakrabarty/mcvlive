"use client";

import { useEffect } from "react";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error(
      JSON.stringify({
        level: "FATAL",
        type: "ROOT_GLOBAL_ERROR_TRIGGERED",
        message: error.message,
        digest: error.digest,
        timestamp: new Date().toISOString(),
      }),
    );
  }, [error]);

  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#0A0A0C] text-white flex items-center justify-center p-6 antialiased">
        <div className="max-w-md w-full rounded-3xl border border-[#E6C594]/40 bg-[#121216] p-8 text-center space-y-6 shadow-[0_0_50px_rgba(230,197,148,0.2)]">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#E6C594]/30 bg-[#0A0A0C] px-4 py-1 text-[11px] font-mono text-[#F3D5A0] uppercase tracking-wider">
            Critical System Guard
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-light tracking-tight text-white uppercase">
              Root Kernel Recovery
            </h1>
            <p className="text-xs text-[#A0A0B0] font-light leading-relaxed">
              An unhandled root-level fault was intercepted. Sovereign infrastructure protections
              remain active.
            </p>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => reset()}
              className="w-full py-3 px-6 rounded-full bg-gradient-to-r from-[#E6C594] via-[#F3D5A0] to-[#E6C594] text-black text-xs font-bold uppercase tracking-[0.2em] shadow-md hover:scale-[1.02] transition-all cursor-pointer"
            >
              Reinitialize Application
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
