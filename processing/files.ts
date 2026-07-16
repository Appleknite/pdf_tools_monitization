const MB = 1024 * 1024
export const MAX_INPUT_BYTES = 100 * MB
export const MAX_TOTAL_BYTES = 200 * MB

const signatures = {
  pdf: (bytes: Uint8Array) => String.fromCharCode(...bytes.slice(0, 5)) === "%PDF-",
  jpeg: (bytes: Uint8Array) => bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff,
  png: (bytes: Uint8Array) => bytes[0] === 0x89 && String.fromCharCode(...bytes.slice(1, 4)) === "PNG",
  webp: (bytes: Uint8Array) => String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" && String.fromCharCode(...bytes.slice(8, 12)) === "WEBP",
}

export async function detectFileType(file: File) {
  const bytes = new Uint8Array(await file.slice(0, 16).arrayBuffer())
  if (signatures.pdf(bytes)) return "pdf"
  if (signatures.jpeg(bytes)) return "jpeg"
  if (signatures.png(bytes)) return "png"
  if (signatures.webp(bytes)) return "webp"
  return "unknown"
}

export async function validateFiles(files: File[], category: "pdf" | "image") {
  if (!files.length) throw new Error("Choose at least one file.")
  const total = files.reduce((sum, file) => sum + file.size, 0)
  if (total > MAX_TOTAL_BYTES) throw new Error("The selected files exceed the 200 MB local-processing limit.")

  for (const file of files) {
    if (file.size === 0) throw new Error(`${file.name} is empty.`)
    if (file.size > MAX_INPUT_BYTES) throw new Error(`${file.name} exceeds the 100 MB per-file limit.`)
    const type = await detectFileType(file)
    if (category === "pdf" && type !== "pdf") throw new Error(`${file.name} is not a valid PDF file.`)
    if (category === "image" && !["jpeg", "png", "webp"].includes(type)) {
      throw new Error(`${file.name} is not a supported JPG, PNG or WebP image.`)
    }
  }
}

export function safeBaseName(name: string) {
  return name
    .replace(/\.[^.]+$/, "")
    .normalize("NFKC")
    .replace(/[^\p{L}\p{N}._-]+/gu, "-")
    .replace(/\./g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "file"
}
