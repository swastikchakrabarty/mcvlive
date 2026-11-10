"use client";

import Link from "next/link";
import { ArrowRightIcon } from "@/components/ui/icons";

export function LuxuryNav() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#E6C594]/20 bg-[#0A0A0C]/85 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.5)] transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Monogram & Title */}
        <Link
          href="/"
          className="flex items-center gap-3.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E6C594] rounded-sm p-1"
        >
          <div className="w-8 h-8 rounded-none border border-[#E6C594]/60 bg-[#121216] flex items-center justify-center font-mono font-medium text-[#F3D5A0] text-xs tracking-wider shadow-[0_0_15px_rgba(230,197,148,0.25)] transition-transform duration-300 group-hover:scale-105">
            MCV
          </div>
          <div className="flex flex-col">
            <span className="font-sans text-[12px] uppercase font-semibold tracking-[0.24em] text-white leading-none">
              Morland Chambers Vector
            </span>
            <span className="font-sans text-[9px] uppercase tracking-[0.28em] text-[#E6C594]/80 mt-1">
              Bespoke Corporate Architectures
            </span>
          </div>
        </Link>

        {/* Minimalist Fear of God Navigation */}
        <nav
          aria-label="Luxury Main Navigation"
          className="hidden md:flex items-center gap-8 text-[11px] uppercase font-medium tracking-[0.22em] text-[#A0A0B0]"
        >
          <a
            href="#philosophy"
            className="hover:text-[#F3D5A0] transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#F3D5A0] hover:after:w-full after:transition-all"
          >
            Philosophy
          </a>
          <a
            href="#architectures"
            className="hover:text-[#F3D5A0] transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#F3D5A0] hover:after:w-full after:transition-all"
          >
            Engineering
          </a>
          <a
            href="#billing"
            className="hover:text-[#F3D5A0] transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#F3D5A0] hover:after:w-full after:transition-all"
          >
            Billing Systems
          </a>
        </nav>

        {/* Direct Action Trigger */}
        <div className="flex items-center gap-4">
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-full border border-[#E6C594] bg-gradient-to-r from-[#E6C594] via-[#F3D5A0] to-[#E6C594] px-4 py-2 text-[11px] uppercase font-semibold tracking-[0.2em] text-black shadow-[0_0_20px_rgba(230,197,148,0.3)] hover:shadow-[0_0_30px_rgba(230,197,148,0.55)] hover:scale-[1.02] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F3D5A0]"
          >
            <span>Direct Inquiry</span>
            <ArrowRightIcon className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </header>
  );
}
