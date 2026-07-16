import type { ToolDefinition } from "@/content/tools"
import { validateFiles } from "./files"
import { convertImages, mergeImages } from "./images"
import { imagesToPdf, mergePdfs, pdfToImages, reorderPdf, splitPdf } from "./pdf"
import type { ProcessedOutput, ProcessingOptions, ProgressCallback } from "./types"

export async function processTool(
  tool: ToolDefinition,
  files: File[],
  options: ProcessingOptions,
  progress: ProgressCallback,
  signal: AbortSignal,
): Promise<ProcessedOutput[]> {
  signal.throwIfAborted()
  if (files.length < tool.minimumFiles) throw new Error(`Choose at least ${tool.minimumFiles} file${tool.minimumFiles === 1 ? "" : "s"}.`)
  await validateFiles(files, tool.category)
  progress(2, "Files validated")

  switch (tool.slug) {
    case "merge-pdf": return mergePdfs(files, progress, signal)
    case "split-pdf": return splitPdf(files[0], options, progress, signal)
    case "reorder-pdf": return reorderPdf(files[0], options, progress, signal)
    case "image-to-pdf": return imagesToPdf(files, options, progress, signal)
    case "pdf-to-image": return pdfToImages(files[0], options, progress, signal)
    case "merge-images": return mergeImages(files, options, progress, signal)
    case "convert-image": return convertImages(files, options, progress, signal)
    case "compress-image": return convertImages(files, { ...options, format: options.format === "image/png" ? "image/webp" : options.format }, progress, signal)
    default: throw new Error("This tool is not available yet.")
  }
}
