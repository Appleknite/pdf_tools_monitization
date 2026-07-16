import Link from "next/link"

export default function NotFound() {
  return <section className="article-hero narrow"><span className="eyebrow">404</span><h1>This page is not available.</h1><p>The address may have changed, or the tool may not exist yet.</p><Link className="button button-primary" href="/">Return home</Link></section>
}
