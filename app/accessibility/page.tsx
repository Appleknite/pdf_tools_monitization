import type { Metadata } from "next"

export const metadata: Metadata = { title: "Accessibility", description: "ClearDoc Tools accessibility commitments and known limitations.", alternates: { canonical: "/accessibility" } }

export default function AccessibilityPage() {
  return (
    <>
      <header className="article-hero narrow"><span className="eyebrow">Accessibility</span><h1>Document tools should work for everyone.</h1><p>Our target is WCAG 2.2 AA across navigation, tool configuration, processing feedback and downloads.</p></header>
      <article className="article-body narrow prose">
        <h2>Implemented foundations</h2><ul><li>Keyboard-accessible controls and file-order buttons</li><li>Visible focus indicators and a skip link</li><li>Live status and error messages</li><li>Reduced-motion support</li><li>Responsive layouts and minimum touch-target sizing</li><li>Semantic headings, labels and navigation</li></ul>
        <h2>Known work</h2><p>PDF page thumbnails and richer drag-and-drop reordering will require screen-reader alternatives before release. Automated checks must be combined with keyboard, zoom and screen-reader testing.</p>
        <h2>Feedback</h2><p>Please report the page, device, browser, assistive technology and the task you could not complete. Do not include a sensitive document.</p>
      </article>
    </>
  )
}
