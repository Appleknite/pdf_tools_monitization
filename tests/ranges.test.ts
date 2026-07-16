import { describe, expect, it } from "vitest"
import { parsePageSelection, parseRangeGroups } from "../processing/ranges"

describe("page range parsing", () => {
  it("expands forward and reverse ranges", () => {
    expect(parsePageSelection("1-3,5,8-6", 8)).toEqual([0, 1, 2, 4, 7, 6, 5])
  })

  it("preserves repeated pages for reordering", () => {
    expect(parsePageSelection("2,2,1", 2)).toEqual([1, 1, 0])
  })

  it("separates output groups with semicolons", () => {
    expect(parseRangeGroups("1-2; 3,5; 6-4", 6)).toEqual([[0, 1], [2, 4], [5, 4, 3]])
  })

  it("rejects invalid and out-of-range pages", () => {
    expect(() => parsePageSelection("0", 3)).toThrow(/outside/)
    expect(() => parsePageSelection("4", 3)).toThrow(/outside/)
    expect(() => parsePageSelection("one", 3)).toThrow(/not a valid/)
  })
})
