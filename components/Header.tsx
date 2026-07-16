import Link from "next/link"

export function Header() {
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link className="brand" href="/" aria-label="ClearDoc Tools home">
          <span className="brand-mark" aria-hidden="true">C</span>
          <span>ClearDoc <strong>Tools</strong></span>
        </Link>
        <nav aria-label="Main navigation">
          <Link href="/#tools">All tools</Link>
          <Link href="/guides">Guides</Link>
          <Link href="/security">Security</Link>
          <Link className="nav-support" href="/support">Support us</Link>
        </nav>
      </div>
    </header>
  )
}
