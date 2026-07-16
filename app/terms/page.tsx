import type { Metadata } from "next"

export const metadata: Metadata = { title: "Terms of use", description: "Terms governing responsible use of ClearDoc Tools.", alternates: { canonical: "/terms" } }

export default function TermsPage() {
  return (
    <>
      <header className="article-hero narrow"><span className="eyebrow">Legal</span><h1>Terms of use</h1><p>Last reviewed 16 July 2026. Operator details and jurisdiction require legal review before launch.</p></header>
      <article className="article-body narrow prose">
        <p className="legal-callout">This draft must be reviewed for the operator’s jurisdiction before the service is publicly launched.</p>
        <h2>Permitted use</h2><p>You may use the service for lawful files you own or are authorised to process. You may not attempt to overload, reverse engineer for abuse, bypass resource limits, introduce malware or process material that infringes another person’s rights.</p>
        <h2>No guarantee of output</h2><p>Document formats are complex. Always retain the original and inspect page order, text, links, forms, signatures, metadata and visual quality before relying on an output.</p>
        <h2>Availability</h2><p>The service is provided without a promise of uninterrupted availability. Tools and limits may change to protect users, security and operational sustainability.</p>
        <h2>Liability and warranties</h2><p>Appropriate warranty disclaimers, liability limits and consumer-law provisions must be drafted by qualified counsel for the operator’s jurisdiction.</p>
      </article>
    </>
  )
}
