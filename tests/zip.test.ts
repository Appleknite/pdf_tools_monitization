import { describe, expect, it } from "vitest"
import { crc32, createZip } from "../processing/zip"

describe("ZIP writer", () => {
  it("calculates the standard CRC32 vector", () => {
    expect(crc32(new TextEncoder().encode("123456789"))).toBe(0xcbf43926)
  })

  it("creates a ZIP with local, central and end records", async () => {
    const blob = await createZip([{ name: "hello.txt", blob: new Blob(["hello"]) }])
    const bytes = new Uint8Array(await blob.arrayBuffer())
    expect([...bytes.slice(0, 4)]).toEqual([0x50, 0x4b, 0x03, 0x04])
    expect([...bytes.slice(-22, -18)]).toEqual([0x50, 0x4b, 0x05, 0x06])
  })
})
