import type { Metadata } from "next"
import Link from "next/link"
import { guides } from "@/content/guides"

export const metadata: Metadata = {
  title: "Document guides",
  description: "Practical, privacy-aware guidance for working with PDF and image files.",
  alternates: { canonical: "/guides" },
}

export default function GuidesPage() {
  return (
    <>
      <header className="article-hero narrow"><span className="eyebrow">Resource library</span><h1>Document guides</h1><p>Understand formats, privacy and quality before you process an important file.</p></header>
      <div className="shell guide-index">
        {guides.map((guide) => <Link className="guide-card" href={`/guides/${guide.slug}`} key={guide.slug}><h2>{guide.title}</h2><p>{guide.description}</p><small>Read guide →</small></Link>)}
      </div>
    </>
  )
}
