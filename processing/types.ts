export type ImageFormat = "image/jpeg" | "image/png" | "image/webp"

export type ProcessingOptions = {
  splitMode: "every" | "custom"
  ranges: string
  pageOrder: string
  pageSize: "A4" | "Letter" | "fit"
  orientation: "auto" | "portrait" | "landscape"
  margin: number
  format: ImageFormat
  quality: number
  dpi: 96 | 150 | 300
  direction: "vertical" | "horizontal" | "grid"
  columns: number
  gap: number
  background: string
  maxWidth: number
}

export const defaultOptions: ProcessingOptions = {
  splitMode: "every",
  ranges: "1-3; 4-6",
  pageOrder: "1,2,3",
  pageSize: "A4",
  orientation: "auto",
  margin: 24,
  format: "image/jpeg",
  quality: 0.82,
  dpi: 150,
  direction: "vertical",
  columns: 2,
  gap: 0,
  background: "#ffffff",
  maxWidth: 1920,
}

export type ProcessedOutput = {
  name: string
  blob: Blob
  sourceBytes?: number
}

export type ProgressCallback = (progress: number, message: string) => void
