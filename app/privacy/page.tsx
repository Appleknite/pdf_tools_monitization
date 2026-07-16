import type { Metadata } from "next"

export const metadata: Metadata = { title: "Privacy policy", description: "ClearDoc Tools privacy practices for local document processing and minimal website data.", alternates: { canonical: "/privacy" } }

export default function PrivacyPage() {
  return (
    <>
      <header className="article-hero narrow"><span className="eyebrow">Legal</span><h1>Privacy policy</h1><p>Last reviewed 16 July 2026. Replace placeholder business details and obtain legal review before production launch.</p></header>
      <article className="article-body narrow prose">
        <p className="legal-callout">This is an implementation draft, not legal advice. The operator’s legal name, address, jurisdiction and contact details must be inserted before launch.</p>
        <h2>Documents processed by the tools</h2><p>The current version processes selected PDF and image files inside the browser. It does not upload document contents to our servers. Temporary result URLs exist only in the browser session and are released when cleared, replaced or closed.</p>
        <h2>Website information</h2><p>Hosting and security providers may process standard request information such as IP address, timestamp, requested URL, browser type and security signals. Production logs must be configured to avoid query strings and document names.</p>
        <h2>Analytics and advertising</h2><p>Analytics and advertising are not enabled in the initial codebase. Before either is enabled, this policy and the consent experience must name the providers, purposes, retention periods and available choices. Uploaded filenames and document contents must never be sent to analytics or advertising systems.</p>
        <h2>Donations</h2><p>If you choose to support the project, the payment provider processes payment and identity information under its own privacy policy. ClearDoc should retain only records required for accounting, fraud prevention and legal compliance.</p>
        <h2>Your choices</h2><p>You may use the tools without creating an account. Browser storage and cookies can be cleared through browser settings. Contact details for privacy requests must be added before production launch.</p>
      </article>
    </>
  )
}
