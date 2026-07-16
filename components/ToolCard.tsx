import Link from "next/link"
import type { ToolDefinition } from "@/content/tools"

export function ToolCard({ tool }: { tool: ToolDefinition }) {
  return (
    <Link className="tool-card" href={`/tools/${tool.slug}`}>
      <span className={`tool-icon tool-icon-${tool.category}`} aria-hidden="true">
        {tool.category === "pdf" ? "PDF" : "IMG"}
      </span>
      <span>
        <strong>{tool.shortName}</strong>
        <small>{tool.description}</small>
      </span>
      <span className="card-arrow" aria-hidden="true">→</span>
    </Link>
  )
}
