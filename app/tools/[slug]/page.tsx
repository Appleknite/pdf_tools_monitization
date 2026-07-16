import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { JsonLd } from "@/components/JsonLd"
import { ToolWorkspace } from "@/components/ToolWorkspace"
import { toolMap, tools } from "@/content/tools"
import { absoluteUrl, site } from "@/lib/site"

export function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const tool = toolMap.get(slug)
  if (!tool) return {}
  return {
    title: `${tool.shortName} — free and private`,
    description: tool.description,
    keywords: tool.keywords,
    alternates: { canonical: `/tools/${tool.slug}` },
    openGraph: { title: tool.name, description: tool.description, url: `/tools/${tool.slug}` },
  }
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const tool = toolMap.get(slug)
  if (!tool) notFound()
  const related = tools.filter((candidate) => candidate.slug !== tool.slug && candidate.category === tool.category).slice(0, 4)

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "@id": absoluteUrl(`/tools/${tool.slug}#app`),
        name: tool.name,
        description: tool.description,
        url: absoluteUrl(`/tools/${tool.slug}`),
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Any modern web browser",
        browserRequirements: "JavaScript and a modern browser are required",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        publisher: { "@id": absoluteUrl("/#organization") },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: site.url },
          { "@type": "ListItem", position: 2, name: tool.shortName, item: absoluteUrl(`/tools/${tool.slug}`) },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: tool.faq.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })),
      },
    ],
  }

  return (
    <>
      <section className="page-hero">
        <div className="shell">
          <div className="breadcrumbs"><Link href="/">Home</Link><span>/</span><span>{tool.shortName}</span></div>
          <h1>{tool.name}</h1>
          <p>{tool.description}</p>
          <span className="local-badge"><span className="status-dot" /> Local processing · no upload</span>
        </div>
      </section>
      <section className="workspace-wrap"><div className="shell"><ToolWorkspace tool={tool} /></div></section>
      <section className="section section-tint">
        <div className="shell content-grid">
          <article className="prose">
            <h2>How to {tool.shortName.toLowerCase()}</h2>
            <ol>{tool.steps.map((step) => <li key={step}>{step}</li>)}</ol>
            <h2>What this tool preserves</h2>
            <ul>{tool.benefits.map((benefit) => <li key={benefit}>{benefit}</li>)}</ul>
            <h2>Important limitations</h2>
            <ul>{tool.limitations.map((limitation) => <li key={limitation}>{limitation}</li>)}</ul>
            <h2>Frequently asked questions</h2>
            <div className="faq">{tool.faq.map((item) => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</div>
          </article>
          <aside className="side-panel">
            <h2>Related {tool.category === "pdf" ? "PDF" : "image"} tools</h2>
            {related.map((item) => <Link key={item.slug} href={`/tools/${item.slug}`}>{item.shortName} →</Link>)}
            <Link href="/security">How local processing works →</Link>
          </aside>
        </div>
      </section>
      <JsonLd data={schema} />
    </>
  )
}
