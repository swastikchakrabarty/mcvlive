import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/ui/toast";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#090D16",
};

export const metadata: Metadata = {
  title: "Morland Chambers Vector | Enterprise Web Architectures & Vector Engines",
  description:
    "Institutional corporate software sales platform, proprietary vector architectures, sovereign multi-tenant databases, and mission-critical cloud blueprints.",
  keywords: [
    "Morland Chambers Vector",
    "vector database architecture",
    "sovereign web platform",
    "high-throughput inference",
    "institutional cloud blueprints",
  ],
  authors: [{ name: "Morland Chambers Vector Systems" }],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="min-h-screen bg-[#090D16] text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
