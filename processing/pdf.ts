import { safeBaseName } from "./files"
import { parsePageSelection, parseRangeGroups } from "./ranges"
import type { ProcessedOutput, ProcessingOptions, ProgressCallback } from "./types"
import { createZip } from "./zip"

const pageSizes = {
  A4: [595.28, 841.89] as [number, number],
  Letter: [612, 792] as [number, number],
}

function pdfBlob(bytes: Uint8Array) {
  return new Blob([new Uint8Array(bytes).buffer], { type: "application/pdf" })
}

export async function mergePdfs(files: File[], progress: ProgressCallback, signal: AbortSignal): Promise<ProcessedOutput[]> {
  const { PDFDocument } = await import("pdf-lib")
  const output = await PDFDocument.create()
  for (let index = 0; index < files.length; index += 1) {
    signal.throwIfAborted()
    progress((index / files.length) * 90, `Adding ${files[index].name}`)
    const source = await PDFDocument.load(await files[index].arrayBuffer(), { ignoreEncryption: false })
    const pages = await output.copyPages(source, source.getPageIndices())
    for (const page of pages) output.addPage(page)
  }
  const bytes = await output.save({ useObjectStreams: true })
  return [{ name: "merged.pdf", blob: pdfBlob(bytes), sourceBytes: files.reduce((sum, file) => sum + file.size, 0) }]
}

export async function splitPdf(file: File, options: ProcessingOptions, progress: ProgressCallback, signal: AbortSignal): Promise<ProcessedOutput[]> {
  const { PDFDocument } = await import("pdf-lib")
  const source = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: false })
  const total = source.getPageCount()
  const groups = options.splitMode === "every"
    ? Array.from({ length: total }, (_, index) => [index])
    : parseRangeGroups(options.ranges, total)
  const outputs: { name: string; blob: Blob }[] = []

  for (let index = 0; index < groups.length; index += 1) {
    signal.throwIfAborted()
    progress((index / groups.length) * 90, `Creating part ${index + 1} of ${groups.length}`)
    const part = await PDFDocument.create()
    const pages = await part.copyPages(source, groups[index])
    for (const page of pages) part.addPage(page)
    const bytes = await part.save({ useObjectStreams: true })
    outputs.push({ name: `${safeBaseName(file.name)}-part-${String(index + 1).padStart(3, "0")}.pdf`, blob: pdfBlob(bytes) })
  }

  return [{ name: `${safeBaseName(file.name)}-split.zip`, blob: await createZip(outputs), sourceBytes: file.size }]
}

export async function reorderPdf(file: File, options: ProcessingOptions, progress: ProgressCallback, signal: AbortSignal): Promise<ProcessedOutput[]> {
  const { PDFDocument } = await import("pdf-lib")
  progress(15, "Reading page structure")
  const source = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: false })
  signal.throwIfAborted()
  const order = parsePageSelection(options.pageOrder, source.getPageCount())
  const output = await PDFDocument.create()
  const pages = await output.copyPages(source, order)
  for (const page of pages) output.addPage(page)
  progress(85, "Writing reordered PDF")
  const bytes = await output.save({ useObjectStreams: true })
  return [{ name: `${safeBaseName(file.name)}-reordered.pdf`, blob: pdfBlob(bytes), sourceBytes: file.size }]
}

async function normalizeImage(file: File) {
  if (file.type === "image/jpeg" || file.type === "image/png") return { bytes: await file.arrayBuffer(), type: file.type }
  const bitmap = await createImageBitmap(file)
  const canvas = document.createElement("canvas")
  canvas.width = bitmap.width
  canvas.height = bitmap.height
  const context = canvas.getContext("2d")
  if (!context) throw new Error("Canvas is not available in this browser.")
  context.drawImage(bitmap, 0, 0)
  bitmap.close()
  const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob((value) => value ? resolve(value) : reject(new Error("Could not convert image.")), "image/png"))
  return { bytes: await blob.arrayBuffer(), type: "image/png" }
}

export async function imagesToPdf(files: File[], options: ProcessingOptions, progress: ProgressCallback, signal: AbortSignal): Promise<ProcessedOutput[]> {
  const { PDFDocument } = await import("pdf-lib")
  const output = await PDFDocument.create()

  for (let index = 0; index < files.length; index += 1) {
    signal.throwIfAborted()
    progress((index / files.length) * 90, `Adding ${files[index].name}`)
    const normalized = await normalizeImage(files[index])
    const image = normalized.type === "image/jpeg" ? await output.embedJpg(normalized.bytes) : await output.embedPng(normalized.bytes)
    const intrinsic = image.scale(1)
    let [pageWidth, pageHeight] = options.pageSize === "fit" ? [intrinsic.width + options.margin * 2, intrinsic.height + options.margin * 2] : pageSizes[options.pageSize]
    const landscape = options.orientation === "landscape" || (options.orientation === "auto" && intrinsic.width > intrinsic.height)
    if (landscape && pageHeight > pageWidth) [pageWidth, pageHeight] = [pageHeight, pageWidth]
    if (!landscape && options.orientation === "portrait" && pageWidth > pageHeight) [pageWidth, pageHeight] = [pageHeight, pageWidth]
    const usableWidth = Math.max(1, pageWidth - options.margin * 2)
    const usableHeight = Math.max(1, pageHeight - options.margin * 2)
    const scale = Math.min(usableWidth / intrinsic.width, usableHeight / intrinsic.height)
    const width = intrinsic.width * scale
    const height = intrinsic.height * scale
    const page = output.addPage([pageWidth, pageHeight])
    page.drawImage(image, { x: (pageWidth - width) / 2, y: (pageHeight - height) / 2, width, height })
  }

  const bytes = await output.save({ useObjectStreams: true })
  return [{ name: "images.pdf", blob: pdfBlob(bytes), sourceBytes: files.reduce((sum, file) => sum + file.size, 0) }]
}

function canvasBlob(canvas: HTMLCanvasElement, type: string, quality: number) {
  return new Promise<Blob>((resolve, reject) => canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("Could not encode image.")), type, quality))
}

export async function pdfToImages(file: File, options: ProcessingOptions, progress: ProgressCallback, signal: AbortSignal): Promise<ProcessedOutput[]> {
  const pdfjs = await import("pdfjs-dist")
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs"
  const document = await pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise
  const outputs: { name: string; blob: Blob }[] = []
  const extension = options.format === "image/jpeg" ? "jpg" : options.format === "image/png" ? "png" : "webp"

  try {
    for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
      signal.throwIfAborted()
      progress(((pageNumber - 1) / document.numPages) * 90, `Rendering page ${pageNumber} of ${document.numPages}`)
      const page = await document.getPage(pageNumber)
      const viewport = page.getViewport({ scale: options.dpi / 72 })
      if (viewport.width * viewport.height > 50_000_000) throw new Error("A page is too large at this resolution. Choose a lower DPI.")
      const canvas = documentOwnerCanvas(Math.ceil(viewport.width), Math.ceil(viewport.height))
      const context = canvas.getContext("2d", { alpha: options.format !== "image/jpeg" })
      if (!context) throw new Error("Canvas is not available in this browser.")
      if (options.format === "image/jpeg") {
        context.fillStyle = "#ffffff"
        context.fillRect(0, 0, canvas.width, canvas.height)
      }
      await page.render({ canvas, canvasContext: context, viewport }).promise
      outputs.push({ name: `${safeBaseName(file.name)}-page-${String(pageNumber).padStart(3, "0")}.${extension}`, blob: await canvasBlob(canvas, options.format, options.quality) })
      page.cleanup()
    }
  } finally {
    await document.loadingTask.destroy()
  }

  if (outputs.length === 1) return [{ ...outputs[0], sourceBytes: file.size }]
  return [{ name: `${safeBaseName(file.name)}-images.zip`, blob: await createZip(outputs), sourceBytes: file.size }]
}

function documentOwnerCanvas(width: number, height: number) {
  const canvas = window.document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  return canvas
}
