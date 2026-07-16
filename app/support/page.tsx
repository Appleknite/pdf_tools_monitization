import type { Metadata } from "next"
import { site } from "@/lib/site"

export const metadata: Metadata = { title: "Support the project", description: "Help maintain free, privacy-first document tools through an optional contribution.", alternates: { canonical: "/support" } }

export default function SupportPage() {
  return (
    <>
      <header className="article-hero narrow"><span className="eyebrow">Optional support</span><h1>Keep the toolbox free and dependable.</h1><p>Contributions help pay for the domain, compatibility testing, security maintenance and future tool development.</p></header>
      <article className="article-body narrow prose">
        <h2>Free means free</h2><p>Core tools do not require payment, an account or an ad click. Supporting the project is optional and does not change processing priority.</p>
        {site.supportUrl ? <p><a className="button button-primary" href={site.supportUrl} rel="noopener noreferrer">Open secure support page</a></p> : <p className="legal-callout">The payment provider has not been configured. Set <code>NEXT_PUBLIC_SUPPORT_URL</code> after completing accounting, tax and provider review.</p>}
        <h2>What support funds</h2><ul><li>Domain and production hosting</li><li>Cross-browser and accessibility testing</li><li>Dependency and security maintenance</li><li>New local-processing tools</li></ul>
      </article>
    </>
  )
}
