import type { Metadata } from "next"
import { site } from "@/lib/site"

export const metadata: Metadata = { title: "Contact", description: "Contact ClearDoc Tools without sending sensitive documents.", alternates: { canonical: "/contact" } }

export default function ContactPage() {
  return (
    <>
      <header className="article-hero narrow"><span className="eyebrow">Contact</span><h1>Tell us what needs improving.</h1><p>Report a bug, accessibility problem or security concern—but never attach a confidential document.</p></header>
      <article className="article-body narrow prose">
        {site.contactUrl ? <p><a className="button button-primary" href={site.contactUrl} rel="noopener noreferrer">Open contact form</a></p> : <p className="legal-callout">A production support channel has not been configured. Set <code>NEXT_PUBLIC_CONTACT_URL</code> before launch.</p>}
        <h2>Useful bug reports include</h2><ul><li>Tool name and expected result</li><li>Browser, operating system and device</li><li>File type and approximate size</li><li>Whether the problem occurs with a non-sensitive test file</li><li>Exact error message</li></ul>
        <h2>Security reports</h2><p>Describe the vulnerability, impact and minimal reproduction. Do not access another user’s data or perform denial-of-service testing.</p>
      </article>
    </>
  )
}
