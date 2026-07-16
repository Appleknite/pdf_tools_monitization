import type { Metadata } from "next"

export const metadata: Metadata = { title: "Security and local processing", description: "How ClearDoc Tools protects files and limits document-processing risk.", alternates: { canonical: "/security" } }

export default function SecurityPage() {
  return (
    <>
      <header className="article-hero narrow"><span className="eyebrow">Trust centre</span><h1>Security starts by not collecting the file.</h1><p>The current tools process documents locally. This page describes the boundary precisely, including what it does and does not guarantee.</p></header>
      <article className="article-body narrow prose">
        <h2>Local-processing architecture</h2><p>Selected files are read by JavaScript running in your browser. PDF and image libraries transform the bytes on your device and create temporary object URLs for downloading results. The application currently has no document-upload endpoint.</p>
        <h2>Temporary data</h2><p>Files may exist in browser memory while a tool is open. Download URLs are revoked when results are cleared or replaced. Browsers and operating systems still control memory, downloaded files, crash reports and local caches, so use a trusted device for sensitive work.</p>
        <h2>Input validation</h2><p>The application checks file signatures rather than trusting extensions or browser-provided MIME types. It limits individual files to 250 MB and each local job to 500 MB. Rendering tools also cap output pixels to reduce memory-exhaustion risk.</p>
        <h2>Network inspection</h2><p>You can verify the local-processing claim using your browser’s developer tools. Open the Network panel, clear existing entries, process a test file and confirm that the document bytes are not transmitted.</p>
        <h2>Known limitations</h2><ul><li>A compromised browser, extension or device can still access files selected by the user.</li><li>Third-party dependencies may contain defects; versions must be pinned and monitored.</li><li>Password-protected, malformed or highly complex PDFs may be rejected.</li><li>Do not use the tools as the sole copy of an important file.</li></ul>
        <h2>Future cloud processing</h2><p>Cloud processing will not be enabled until isolated workers, private object storage, random identifiers, signed links, strict resource limits, automatic deletion and deletion reconciliation are implemented and independently tested.</p>
        <h2>Reporting a vulnerability</h2><p>Send a concise reproduction and impact assessment through the contact page. Do not include another person’s sensitive document.</p>
      </article>
    </>
  )
}
