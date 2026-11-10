import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || "https://morelandchambersvector.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/design", "/dashboard"],
        disallow: ["/api/", "/_next/", "/admin/", "/private/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
