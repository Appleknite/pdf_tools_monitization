import type { MetadataRoute } from "next"
import { guides } from "@/content/guides"
import { tools } from "@/content/tools"
import { absoluteUrl } from "@/lib/site"

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["/", "/guides", "/security", "/privacy", "/terms", "/accessibility", "/contact", "/support"]
  return [
    ...staticRoutes.map((path) => ({ url: absoluteUrl(path), lastModified: new Date("2026-07-16"), changeFrequency: path === "/" ? "weekly" as const : "monthly" as const, priority: path === "/" ? 1 : 0.5 })),
    ...tools.map((tool) => ({ url: absoluteUrl(`/tools/${tool.slug}`), lastModified: new Date("2026-07-16"), changeFrequency: "monthly" as const, priority: 0.8 })),
    ...guides.map((guide) => ({ url: absoluteUrl(`/guides/${guide.slug}`), lastModified: new Date(guide.reviewed), changeFrequency: "monthly" as const, priority: 0.65 })),
  ]
}
