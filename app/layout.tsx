import type { Metadata, Viewport } from "next"
import { Footer } from "@/components/Footer"
import { Header } from "@/components/Header"
import { JsonLd } from "@/components/JsonLd"
import { absoluteUrl, site } from "@/lib/site"
import "./globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} — Private PDF and image tools`, template: `%s | ${site.name}` },
  description: site.description,
  applicationName: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} — Private PDF and image tools`,
    description: site.description,
    url: "/",
  },
  twitter: { card: "summary_large_image", title: site.name, description: site.description },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = { width: "device-width", initialScale: 1, colorScheme: "light dark", themeColor: "#0a7359" }

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <JsonLd data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          "@id": absoluteUrl("/#organization"),
          name: site.name,
          url: site.url,
          description: site.description,
        }} />
      </body>
    </html>
  )
}
