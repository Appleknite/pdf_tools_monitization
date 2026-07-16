function assertPage(page: number, totalPages: number) {
  if (!Number.isInteger(page) || page < 1 || page > totalPages) {
    throw new Error(`Page ${page} is outside the document's 1–${totalPages} range.`)
  }
}

export function parsePageSelection(value: string, totalPages: number): number[] {
  const normalized = value.trim()
  if (!normalized) throw new Error("Enter at least one page number.")

  const pages: number[] = []
  for (const token of normalized.split(",")) {
    const part = token.trim()
    if (!part) continue

    const match = /^(\d+)(?:\s*-\s*(\d+))?$/.exec(part)
    if (!match) throw new Error(`“${part}” is not a valid page number or range.`)

    const start = Number(match[1])
    const end = Number(match[2] || match[1])
    assertPage(start, totalPages)
    assertPage(end, totalPages)

    const direction = start <= end ? 1 : -1
    for (let page = start; page !== end + direction; page += direction) pages.push(page - 1)
  }

  if (!pages.length) throw new Error("Enter at least one page number.")
  return pages
}

export function parseRangeGroups(value: string, totalPages: number): number[][] {
  const groups = value
    .split(";")
    .map((group) => group.trim())
    .filter(Boolean)
    .map((group) => parsePageSelection(group, totalPages))

  if (!groups.length) throw new Error("Enter at least one page range.")
  return groups
}
