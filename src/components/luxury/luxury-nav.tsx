"use client";

import Link from "next/link";
import { ArrowRightIcon } from "@/components/ui/icons";

export function LuxuryNav() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#D4AF37]/20 bg-[#F4ECE1]/85 backdrop-blur-xl transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Monogram & Title */}
        <Link
          href="/"
          className="flex items-center gap-3.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A880] rounded-sm p-1"
        >
          <div className="w-8 h-8 rounded-none border border-[#171717] bg-[#171717] flex items-center justify-center font-mono font-medium text-white text-xs tracking-wider transition-transform duration-300 group-hover:scale-105">
            MCV
          </div>
          <div className="flex flex-col">
            <span className="font-sans text-[12px] uppercase font-semibold tracking-[0.24em] text-[#171717] leading-none">
              Morland Chambers Vector
            </span>
            <span className="font-sans text-[9px] uppercase tracking-[0.28em] text-[#8C8C8C] mt-1">
              Bespoke Corporate Architectures
            </span>
          </div>
        </Link>

        {/* Minimalist Fear of God Navigation */}
        <nav
          aria-label="Luxury Main Navigation"
          className="hidden md:flex items-center gap-8 text-[11px] uppercase font-medium tracking-[0.22em] text-[#5A5A5A]"
        >
          <a
            href="#philosophy"
            className="hover:text-[#171717] transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#171717] hover:after:w-full after:transition-all"
          >
            Philosophy
          </a>
          <a
            href="#architectures"
            className="hover:text-[#171717] transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#171717] hover:after:w-full after:transition-all"
          >
            Engineering
          </a>
          <a
            href="#billing"
            className="hover:text-[#171717] transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#171717] hover:after:w-full after:transition-all"
          >
            Billing Systems
          </a>
        </nav>

        {/* Direct Action Trigger */}
        <div className="flex items-center gap-4">
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/50 bg-white/80 px-4 py-2 text-[11px] uppercase font-semibold tracking-[0.2em] text-[#171717] shadow-sm hover:border-[#D4AF37] hover:bg-[#171717] hover:text-white transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
          >
            <span>Direct Inquiry</span>
            <ArrowRightIcon className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </header>
  );
}
