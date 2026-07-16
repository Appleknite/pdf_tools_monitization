import { createZip } from "./zip"
import { safeBaseName } from "./files"
import type { ImageFormat, ProcessedOutput, ProcessingOptions, ProgressCallback } from "./types"

const MAX_CANVAS_EDGE = 16384
const MAX_CANVAS_PIXELS = 50_000_000

function extension(format: ImageFormat) {
  return format === "image/jpeg" ? "jpg" : format === "image/png" ? "png" : "webp"
}

function ensureCanvasSize(width: number, height: number) {
  if (width < 1 || height < 1 || width > MAX_CANVAS_EDGE || height > MAX_CANVAS_EDGE || width * height > MAX_CANVAS_PIXELS) {
    throw new Error("The requested output is too large for safe browser processing. Reduce dimensions or process fewer images.")
  }
}

function canvasToBlob(canvas: HTMLCanvasElement, format: ImageFormat, quality: number) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("The browser could not encode the output image."))), format, quality)
  })
}

async function decode(file: File) {
  try {
    return await createImageBitmap(file, { imageOrientation: "from-image" })
  } catch {
    return await createImageBitmap(file)
  }
}

function scaledSize(width: number, height: number, maxWidth: number) {
  if (!maxWidth || width <= maxWidth) return { width, height }
  const ratio = maxWidth / width
  return { width: Math.round(width * ratio), height: Math.round(height * ratio) }
}

export async function convertImages(files: File[], options: ProcessingOptions, progress: ProgressCallback, signal: AbortSignal) {
  const outputs: { name: string; blob: Blob; sourceBytes: number }[] = []
  for (let index = 0; index < files.length; index += 1) {
    signal.throwIfAborted()
    const file = files[index]
    progress((index / files.length) * 90, `Converting ${file.name}`)
    const bitmap = await decode(file)
    const size = scaledSize(bitmap.width, bitmap.height, options.maxWidth)
    ensureCanvasSize(size.width, size.height)
    const canvas = document.createElement("canvas")
    canvas.width = size.width
    canvas.height = size.height
    const context = canvas.getContext("2d", { alpha: options.format !== "image/jpeg" })
    if (!context) throw new Error("Canvas is not available in this browser.")
    if (options.format === "image/jpeg") {
      context.fillStyle = options.background
      context.fillRect(0, 0, canvas.width, canvas.height)
    }
    context.drawImage(bitmap, 0, 0, size.width, size.height)
    bitmap.close()
    outputs.push({ name: `${safeBaseName(file.name)}.${extension(options.format)}`, blob: await canvasToBlob(canvas, options.format, options.quality), sourceBytes: file.size })
  }

  if (outputs.length === 1) return outputs satisfies ProcessedOutput[]
  return [{ name: "converted-images.zip", blob: await createZip(outputs), sourceBytes: files.reduce((sum, file) => sum + file.size, 0) }]
}

export async function mergeImages(files: File[], options: ProcessingOptions, progress: ProgressCallback, signal: AbortSignal): Promise<ProcessedOutput[]> {
  progress(5, "Reading image dimensions")
  const images = await Promise.all(files.map(decode))
  if (signal.aborted) {
    images.forEach((image) => image.close())
    signal.throwIfAborted()
  }
  const gap = Math.max(0, options.gap)
  let width: number
  let height: number
  let columns = 1
  let cellWidth = 0
  let cellHeight = 0

  if (options.direction === "horizontal") {
    width = images.reduce((sum, image) => sum + image.width, 0) + gap * (images.length - 1)
    height = Math.max(...images.map((image) => image.height))
  } else if (options.direction === "grid") {
    columns = Math.max(1, Math.min(options.columns, images.length))
    const rows = Math.ceil(images.length / columns)
    cellWidth = Math.max(...images.map((image) => image.width))
    cellHeight = Math.max(...images.map((image) => image.height))
    width = columns * cellWidth + gap * (columns - 1)
    height = rows * cellHeight + gap * (rows - 1)
  } else {
    width = Math.max(...images.map((image) => image.width))
    height = images.reduce((sum, image) => sum + image.height, 0) + gap * (images.length - 1)
  }

  ensureCanvasSize(width, height)
  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext("2d")
  if (!context) throw new Error("Canvas is not available in this browser.")
  context.fillStyle = options.background
  context.fillRect(0, 0, width, height)

  let x = 0
  let y = 0
  images.forEach((image, index) => {
    if (options.direction === "grid") {
      const column = index % columns
      const row = Math.floor(index / columns)
      x = column * (cellWidth + gap) + (cellWidth - image.width) / 2
      y = row * (cellHeight + gap) + (cellHeight - image.height) / 2
    } else if (options.direction === "horizontal") {
      y = (height - image.height) / 2
    } else {
      x = (width - image.width) / 2
    }
    context.drawImage(image, x, y)
    if (options.direction === "horizontal") x += image.width + gap
    if (options.direction === "vertical") y += image.height + gap
    image.close()
  })

  progress(90, "Encoding merged image")
  const format = options.format
  return [{ name: `merged-images.${extension(format)}`, blob: await canvasToBlob(canvas, format, options.quality), sourceBytes: files.reduce((sum, file) => sum + file.size, 0) }]
}
