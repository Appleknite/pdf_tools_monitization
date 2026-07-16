export type Guide = {
  slug: string
  title: string
  description: string
  reviewed: string
  sections: { heading: string; paragraphs: string[] }[]
}

export const guides: Guide[] = [
  {
    slug: "safe-online-pdf-tools",
    title: "How to use online PDF tools safely",
    description: "A practical checklist for handling contracts, identity documents and other sensitive PDFs.",
    reviewed: "2026-07-16",
    sections: [
      {
        heading: "Prefer local processing",
        paragraphs: [
          "A local-processing tool transforms the file inside your browser. The document does not need to be sent to a remote server, reducing exposure to storage, logging and account-access mistakes.",
          "Look for an explicit statement beside the file picker. A general privacy claim in the footer is less useful than a tool-specific explanation of where processing occurs.",
        ],
      },
      {
        heading: "Check deletion and access controls",
        paragraphs: [
          "When cloud processing is unavoidable, the provider should explain how long files remain available, whether links are private, and how deletion is verified. Avoid services that expose predictable download URLs or do not state a retention period.",
        ],
      },
      {
        heading: "Protect the original document",
        paragraphs: [
          "Keep the source file until you have opened and checked the result. Review page order, text selection, links, signatures, form fields and image quality before sharing the output.",
        ],
      },
    ],
  },
  {
    slug: "pdf-compression-quality",
    title: "PDF compression without avoidable quality loss",
    description: "Understand structural optimization, image recompression and rasterization before reducing PDF size.",
    reviewed: "2026-07-16",
    sections: [
      {
        heading: "Not all compression is the same",
        paragraphs: [
          "Structural optimization reorganizes a PDF and removes redundant data while preserving text and vector content. Image recompression reduces the resolution or quality of embedded images. Rasterization converts entire pages into images and can remove selectable text, links, forms and accessibility information.",
        ],
      },
      {
        heading: "Choose resolution by use case",
        paragraphs: [
          "For screen-only documents, 120 to 150 DPI is often sufficient. Documents intended for printing may need 300 DPI. Line drawings and small text deserve careful visual inspection at the final viewing size.",
        ],
      },
    ],
  },
  {
    slug: "best-image-format",
    title: "JPG, PNG or WebP: choosing an image format",
    description: "Choose a format based on photographs, transparency, text sharpness and compatibility.",
    reviewed: "2026-07-16",
    sections: [
      {
        heading: "Use JPG for photographs",
        paragraphs: ["JPEG usually provides small files for photographs, but it is lossy and cannot preserve transparency."],
      },
      {
        heading: "Use PNG for exact pixels and transparency",
        paragraphs: ["PNG is useful for diagrams, screenshots and assets that require transparency. Photographs saved as PNG can be unnecessarily large."],
      },
      {
        heading: "Use WebP for modern web delivery",
        paragraphs: ["WebP supports lossy and lossless compression and transparency. It often produces smaller web assets, though specialised workflows may still require JPG or PNG."],
      },
    ],
  },
]

export const guideMap = new Map(guides.map((guide) => [guide.slug, guide]))
