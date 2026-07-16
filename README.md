# ClearDoc Tools

A privacy-first PDF and image toolbox. The initial release processes files in the browser: documents are not uploaded, accounts are not required, and processing is never delayed to increase advertising exposure.

## Local development

1. Copy `.env.example` to `.env.local` and configure the public site URL.
2. Run `pnpm install`. Commit the generated `pnpm-lock.yaml` before the first production release.
3. Run `pnpm dev`.
4. Before release, run `pnpm check`.

## Privacy boundary

The current codebase has no file-upload API. Files are read into browser memory, transformed locally, offered as object-URL downloads, and released when cleared or when the page closes. Do not add cloud processing without implementing isolated storage, signed URLs, expiry, rate limits and deletion reconciliation.

## Monetization boundary

The processing workspace intentionally contains no ad component. Ads may be added to content-rich regions only after policy review and consent management. They must never imitate controls, block downloads or create artificial waiting.
