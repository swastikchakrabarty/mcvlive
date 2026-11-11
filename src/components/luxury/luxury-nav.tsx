"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRightIcon } from "@/components/ui/icons";

export function LuxuryNav() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#D4AF37]/20 bg-[#070709]/85 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.7)] transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo & Title with Gold Emblem */}
        <Link
          href="/"
          className="flex items-center gap-2.5 sm:gap-3.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] rounded-sm p-1 min-w-0"
        >
          <Image
            src="/mcvlogo.png"
            alt="Morland Chambers Vector Logo"
            width={48}
            height={48}
            priority
            data-emblem="/Morland Chambers Gold Emblem.png"
            className="h-8 sm:h-9 w-auto object-contain gold-glow-bloom shrink-0"
          />
          <div className="flex flex-col min-w-0">
            <span className="font-sans text-[11px] sm:text-[12px] uppercase font-semibold tracking-[0.16em] sm:tracking-[0.24em] text-white leading-none truncate group-hover:text-[#FFF3D6] transition-colors">
              Morland Chambers Vector
            </span>
            <span className="hidden sm:block font-sans text-[9px] uppercase tracking-[0.28em] text-[#D4AF37]/85 mt-1">
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
            className="hover:text-[#E5C158] transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#D4AF37] hover:after:w-full after:transition-all"
          >
            Philosophy
          </a>
          <a
            href="#architectures"
            className="hover:text-[#E5C158] transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#D4AF37] hover:after:w-full after:transition-all"
          >
            Engineering
          </a>
          <a
            href="#billing"
            className="hover:text-[#E5C158] transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#D4AF37] hover:after:w-full after:transition-all"
          >
            Billing Systems
          </a>
        </nav>

        {/* Direct Action Trigger */}
        <div className="flex items-center gap-4 shrink-0">
          <a
            href="#contact"
            className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-[#D4AF37] bg-gradient-to-r from-[#D4AF37] via-[#F3E0B5] to-[#D4AF37] px-3.5 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-[11px] uppercase font-semibold tracking-[0.16em] sm:tracking-[0.2em] text-black shadow-[0_0_25px_rgba(212,175,55,0.35)] hover:shadow-[0_0_40px_rgba(229,193,88,0.65)] hover:scale-[1.02] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5C158] shrink-0"
          >
            <span>Direct Inquiry</span>
            <ArrowRightIcon className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
          </a>
        </div>
      </div>
    </header>
  );
}
