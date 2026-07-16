import { describe, expect, it } from "vitest"
import { safeBaseName } from "../processing/files"

describe("safe output names", () => {
  it("removes paths, control punctuation and long extensions", () => {
    expect(safeBaseName("../../My invoice (final).PDF")).toBe("My-invoice-final")
  })

  it("uses a fallback for punctuation-only names", () => {
    expect(safeBaseName("---.pdf")).toBe("file")
  })
})
