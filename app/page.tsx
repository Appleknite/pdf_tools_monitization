import Link from "next/link"
import { JsonLd } from "@/components/JsonLd"
import { SupportCard } from "@/components/SupportCard"
import { ToolCard } from "@/components/ToolCard"
import { guides } from "@/content/guides"
import { tools } from "@/content/tools"
import { absoluteUrl, site } from "@/lib/site"

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="shell hero-grid">
          <div>
            <span className="eyebrow"><span className="status-dot" /> Files stay on your device</span>
            <h1>Document tools without handing over your documents.</h1>
            <p className="hero-copy">Merge PDFs, convert images and handle everyday files directly in your browser. Free, fast and built around privacy.</p>
            <div className="hero-actions">
              <Link className="button button-primary" href="#tools">Choose a tool</Link>
              <Link className="button button-quiet" href="/security">How privacy works</Link>
            </div>
            <ul className="trust-list" aria-label="Product benefits">
              <li>No registration</li><li>No uploads</li><li>No artificial waiting</li>
            </ul>
          </div>
          <div className="privacy-visual" aria-label="Illustration showing local browser processing">
            <div className="visual-file">PDF</div>
            <div className="visual-flow"><span>→</span><small>your browser</small><span>→</span></div>
            <div className="visual-file visual-file-done">✓</div>
            <div className="visual-device"><span>Processed locally</span><strong>Nothing uploaded</strong></div>
          </div>
        </div>
      </section>

      <section className="section" id="tools">
        <div className="shell">
          <div className="section-heading">
            <div><span className="eyebrow">Free browser tools</span><h2>What do you need to do?</h2></div>
            <p>Choose a tool. Processing code loads only when you need it.</p>
          </div>
          <div className="tool-grid">{tools.map((tool) => <ToolCard key={tool.slug} tool={tool} />)}</div>
        </div>
      </section>

      <section className="section section-tint">
        <div className="shell three-column">
          <article><span className="number">01</span><h2>Private by design</h2><p>Files are transformed in your browser. The initial release has no document-upload endpoint.</p></article>
          <article><span className="number">02</span><h2>Honest processing</h2><p>Progress reflects real work. We never delay a job to manufacture additional ad impressions.</p></article>
          <article><span className="number">03</span><h2>Built for verification</h2><p>Clear options, useful warnings and output summaries help you check the result before sharing it.</p></article>
        </div>
      </section>

      <section className="section">
        <div className="shell split-layout">
          <div>
            <span className="eyebrow">Learn before you convert</span>
            <h2>Practical document guides</h2>
            <div className="guide-list">
              {guides.map((guide) => (
                <Link href={`/guides/${guide.slug}`} key={guide.slug}>
                  <strong>{guide.title}</strong><span>{guide.description}</span><small>Read guide →</small>
                </Link>
              ))}
            </div>
          </div>
          <SupportCard />
        </div>
      </section>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": absoluteUrl("/#website"),
        name: site.name,
        url: site.url,
        description: site.description,
      }} />
    </>
  )
}
