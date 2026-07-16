import Link from "next/link"

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div>
          <div className="brand footer-brand"><span className="brand-mark" aria-hidden="true">C</span><span>ClearDoc Tools</span></div>
          <p>Private, practical document tools. No account and no artificial waiting.</p>
        </div>
        <div>
          <h2>Product</h2>
          <Link href="/#tools">All tools</Link>
          <Link href="/guides">Guides</Link>
          <Link href="/security">Security</Link>
        </div>
        <div>
          <h2>Company</h2>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/accessibility">Accessibility</Link>
          <Link href="/contact">Contact</Link>
        </div>
      </div>
      <div className="shell footer-bottom">© {new Date().getFullYear()} ClearDoc Tools. Files remain yours.</div>
    </footer>
  )
}
