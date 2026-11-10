import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/ui/toast";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0A0A0C",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://morelandchambersvector.com"),
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
  creator: "Morland Chambers Vector",
  publisher: "Morland Chambers Vector",
  alternates: {
    canonical: "https://morelandchambersvector.com",
  },
  openGraph: {
    title: "Morland Chambers Vector | Luxury Corporate Web Architectures & Software Systems",
    description:
      "We build software, websites, and web applications for businesses to grow so they never miss another customer.",
    url: "https://morelandchambersvector.com",
    siteName: "Morland Chambers Vector",
    images: [
      {
        url: "/mcvlogo.png",
        width: 1200,
        height: 630,
        alt: "Morland Chambers Vector Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Morland Chambers Vector | Luxury Corporate Web Architectures & Software Systems",
    description:
      "We build software, websites, and web applications for businesses to grow so they never miss another customer.",
    images: ["/mcvlogo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/mcvlogo.png",
    shortcut: "/mcvlogo.png",
    apple: "/mcvlogo.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="min-h-screen bg-[#0A0A0C] text-white antialiased selection:bg-[#E6C594] selection:text-black">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
