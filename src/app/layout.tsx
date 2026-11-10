import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/ui/toast";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#F4ECE1",
};

export const metadata: Metadata = {
  title: "Morland Chambers Vector | Luxury Corporate Web Architectures & Software Systems",
  description:
    "We build software, websites, and web applications for businesses to grow so they never miss another customer. Institutional-grade architectures, luxury digital craftsmanship, and sovereign infrastructure.",
  keywords: [
    "Morland Chambers Vector",
    "Luxury Corporate Web Architecture",
    "Enterprise Software Development",
    "Bespoke Web Applications",
    "Never Miss Another Customer",
  ],
  authors: [{ name: "Morland Chambers Vector" }],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-[#F4ECE1] text-[#0A0A0A] antialiased selection:bg-[#C5A880] selection:text-white">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
