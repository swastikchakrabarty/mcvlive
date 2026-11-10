"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRightIcon } from "@/components/ui/icons";

export function LuxuryNav() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#E6C594]/20 bg-[#0A0A0C]/85 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.5)] transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo & Title */}
        <Link
          href="/"
          className="flex items-center gap-2.5 sm:gap-3.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E6C594] rounded-sm p-1 min-w-0"
        >
          <Image
            src="/mcvlogo.png"
            alt="Morland Chambers Vector Logo"
            width={44}
            height={34}
            priority
            className="h-7 sm:h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-[0_0_15px_rgba(230,197,148,0.3)] shrink-0"
          />
          <div className="flex flex-col min-w-0">
            <span className="font-sans text-[11px] sm:text-[12px] uppercase font-semibold tracking-[0.16em] sm:tracking-[0.24em] text-white leading-none truncate">
              Morland Chambers Vector
            </span>
            <span className="hidden sm:block font-sans text-[9px] uppercase tracking-[0.28em] text-[#E6C594]/80 mt-1">
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
        <div className="flex items-center gap-4 shrink-0">
          <a
            href="#contact"
            className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-[#E6C594] bg-gradient-to-r from-[#E6C594] via-[#F3D5A0] to-[#E6C594] px-3.5 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-[11px] uppercase font-semibold tracking-[0.16em] sm:tracking-[0.2em] text-black shadow-[0_0_20px_rgba(230,197,148,0.3)] hover:shadow-[0_0_30px_rgba(230,197,148,0.55)] hover:scale-[1.02] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F3D5A0] shrink-0"
          >
            <span>Direct Inquiry</span>
            <ArrowRightIcon className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
          </a>
        </div>
      </div>
    </header>
  );
}
