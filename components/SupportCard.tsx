import Link from "next/link"

export function SupportCard() {
  return (
    <aside className="support-card">
      <span className="eyebrow">Community-supported</span>
      <h2>Keep useful tools free</h2>
      <p>If ClearDoc saved you time, a voluntary contribution helps cover the domain, testing and maintenance.</p>
      <Link className="button button-secondary" href="/support">Support the project</Link>
    </aside>
  )
}
