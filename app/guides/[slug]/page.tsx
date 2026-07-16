import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { JsonLd } from "@/components/JsonLd"
import { guideMap, guides } from "@/content/guides"
import { absoluteUrl, site } from "@/lib/site"

export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const guide = guideMap.get((await params).slug)
  if (!guide) return {}
  return { title: guide.title, description: guide.description, alternates: { canonical: `/guides/${guide.slug}` } }
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const guide = guideMap.get((await params).slug)
  if (!guide) notFound()
  return (
    <>
      <header className="article-hero narrow">
        <div className="breadcrumbs" style={{ justifyContent: "flex-start" }}><Link href="/guides">Guides</Link><span>/</span><span>{guide.title}</span></div>
        <h1>{guide.title}</h1><p>{guide.description}</p><div className="article-meta">Reviewed {new Date(`${guide.reviewed}T00:00:00Z`).toLocaleDateString("en", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })}</div>
      </header>
      <article className="article-body narrow prose">
        {guide.sections.map((section) => <section key={section.heading}><h2>{section.heading}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</section>)}
        <h2>Try a local tool</h2><p><Link href="/#tools">Browse all PDF and image tools</Link>. Always keep the original file until you have checked the result.</p>
      </article>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "Article", headline: guide.title, description: guide.description, dateModified: guide.reviewed, mainEntityOfPage: absoluteUrl(`/guides/${guide.slug}`), publisher: { "@id": absoluteUrl("/#organization") }, author: { "@type": "Organization", name: site.name } }} />
    </>
  )
}
