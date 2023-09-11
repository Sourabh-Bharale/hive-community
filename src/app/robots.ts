import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
      },
    ],
    sitemap: "https://onhive.vercel.app/sitemap.xml",
    host: "https://onhive.vercel.app",
  }
}