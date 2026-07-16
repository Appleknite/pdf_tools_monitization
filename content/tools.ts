export type ToolCategory = "pdf" | "image"

export type ToolDefinition = {
  slug: string
  name: string
  shortName: string
  description: string
  category: ToolCategory
  accept: string
  multiple: boolean
  minimumFiles: number
  output: string
  action: string
  keywords: string[]
  steps: string[]
  benefits: string[]
  limitations: string[]
  faq: { question: string; answer: string }[]
}

export const tools: ToolDefinition[] = [
  {
    slug: "merge-pdf",
    name: "Merge PDF files",
    shortName: "Merge PDF",
    description: "Combine several PDF files in the order you choose without uploading them.",
    category: "pdf",
    accept: ".pdf,application/pdf",
    multiple: true,
    minimumFiles: 2,
    output: "merged.pdf",
    action: "Merge PDFs",
    keywords: ["merge PDF", "combine PDF files", "private PDF merger"],
    steps: ["Choose two or more PDFs.", "Move files into the required order.", "Merge and download the result."],
    benefits: ["Keeps original page sizes", "Preserves selectable text in normal PDFs", "Works without an account"],
    limitations: ["Encrypted PDFs must be unlocked first", "Available memory depends on your device"],
    faq: [
      { question: "Are my PDFs uploaded?", answer: "No. This version merges PDFs locally in your browser." },
      { question: "Does merging reduce quality?", answer: "No. Pages are copied into a new PDF without rendering them as images." },
    ],
  },
  {
    slug: "split-pdf",
    name: "Split a PDF by page range",
    shortName: "Split PDF",
    description: "Create separate PDF files for every page or for custom page ranges.",
    category: "pdf",
    accept: ".pdf,application/pdf",
    multiple: false,
    minimumFiles: 1,
    output: "split-pages.zip",
    action: "Split PDF",
    keywords: ["split PDF", "separate PDF pages", "extract PDF ranges"],
    steps: ["Choose one PDF.", "Select every page or enter ranges such as 1-3,5,8-10.", "Download a ZIP containing the results."],
    benefits: ["Custom ranges", "Every-page mode", "Local processing"],
    limitations: ["Page numbers start at 1", "Encrypted files are not supported"],
    faq: [
      { question: "Can I extract one page?", answer: "Yes. Enter that page number as the custom range." },
      { question: "Why is the result a ZIP?", answer: "A ZIP allows several output PDFs to download as one file." },
    ],
  },
  {
    slug: "reorder-pdf",
    name: "Reorder PDF pages",
    shortName: "Reorder PDF",
    description: "Rebuild a PDF using a custom page order, including repeated pages.",
    category: "pdf",
    accept: ".pdf,application/pdf",
    multiple: false,
    minimumFiles: 1,
    output: "reordered.pdf",
    action: "Reorder pages",
    keywords: ["reorder PDF pages", "arrange PDF pages", "reverse PDF"],
    steps: ["Choose a PDF.", "Enter the new order, for example 3,1,2.", "Download the reordered PDF."],
    benefits: ["Repeat pages", "Reverse page order", "No quality loss"],
    limitations: ["Use comma-separated page numbers", "Invalid page numbers are rejected"],
    faq: [{ question: "Can I duplicate a page?", answer: "Yes. Repeat its number in the page-order field." }],
  },
  {
    slug: "image-to-pdf",
    name: "Convert images to PDF",
    shortName: "Image to PDF",
    description: "Turn JPG, PNG or WebP images into an ordered, printable PDF.",
    category: "image",
    accept: "image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp",
    multiple: true,
    minimumFiles: 1,
    output: "images.pdf",
    action: "Create PDF",
    keywords: ["image to PDF", "JPG to PDF", "PNG to PDF"],
    steps: ["Choose one or more images.", "Set page size, orientation and margin.", "Create and download the PDF."],
    benefits: ["A4 and Letter pages", "Automatic orientation", "Preserves image order"],
    limitations: ["Very large images may be resized by browser memory limits"],
    faq: [{ question: "Can I combine several images?", answer: "Yes. Each image becomes one page in the PDF." }],
  },
  {
    slug: "pdf-to-image",
    name: "Convert PDF pages to images",
    shortName: "PDF to Image",
    description: "Render PDF pages as JPG, PNG or WebP images at a selected resolution.",
    category: "pdf",
    accept: ".pdf,application/pdf",
    multiple: false,
    minimumFiles: 1,
    output: "pdf-images.zip",
    action: "Convert pages",
    keywords: ["PDF to JPG", "PDF to PNG", "PDF pages to images"],
    steps: ["Choose a PDF.", "Select format, quality and resolution.", "Download one image or a ZIP of all pages."],
    benefits: ["Three image formats", "Sequential low-memory rendering", "Local conversion"],
    limitations: ["Higher DPI uses substantially more memory", "PDF text becomes pixels"],
    faq: [{ question: "Which DPI should I use?", answer: "Use 150 DPI for normal screens and 300 DPI for print-quality output." }],
  },
  {
    slug: "merge-images",
    name: "Merge images",
    shortName: "Merge Images",
    description: "Join images vertically, horizontally or in a clean grid.",
    category: "image",
    accept: "image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp",
    multiple: true,
    minimumFiles: 2,
    output: "merged-images.png",
    action: "Merge images",
    keywords: ["merge images", "combine JPG", "join images vertically"],
    steps: ["Choose two or more images.", "Select vertical, horizontal or grid layout.", "Download the combined image."],
    benefits: ["Adjustable background", "Predictable spacing", "No server upload"],
    limitations: ["The browser limits maximum canvas dimensions"],
    faq: [{ question: "Can transparent images be combined?", answer: "Yes. Use PNG output to preserve transparency." }],
  },
  {
    slug: "convert-image",
    name: "Convert image format",
    shortName: "Convert Image",
    description: "Convert JPG, PNG and WebP files locally, one at a time or in a batch.",
    category: "image",
    accept: "image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp",
    multiple: true,
    minimumFiles: 1,
    output: "converted-images.zip",
    action: "Convert images",
    keywords: ["image converter", "JPG to PNG", "PNG to WebP"],
    steps: ["Choose images.", "Select an output format and quality.", "Download the result."],
    benefits: ["Batch conversion", "Quality control", "Private browser processing"],
    limitations: ["JPEG cannot preserve transparency", "Browser colour management may vary"],
    faq: [{ question: "What happens to transparency in JPEG?", answer: "Transparent areas are placed on a white background." }],
  },
  {
    slug: "compress-image",
    name: "Compress images",
    shortName: "Compress Image",
    description: "Reduce JPG or WebP file size by changing quality and optional dimensions.",
    category: "image",
    accept: "image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp",
    multiple: true,
    minimumFiles: 1,
    output: "compressed-images.zip",
    action: "Compress images",
    keywords: ["compress image", "reduce JPG size", "image optimizer"],
    steps: ["Choose images.", "Set quality and maximum width.", "Compare sizes and download."],
    benefits: ["Batch processing", "Optional resizing", "Shows saved bytes"],
    limitations: ["Lossy compression can reduce detail", "PNG is converted to WebP by default"],
    faq: [{ question: "What quality should I choose?", answer: "Around 80% is a useful starting point for web images." }],
  },
]

export const toolMap = new Map(tools.map((tool) => [tool.slug, tool]))
