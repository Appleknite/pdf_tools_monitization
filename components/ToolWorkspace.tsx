"use client"

import { useEffect, useRef, useState } from "react"
import type { ToolDefinition } from "@/content/tools"
import { formatBytes } from "@/lib/site"
import { processTool } from "@/processing/process"
import { defaultOptions, type ProcessedOutput, type ProcessingOptions } from "@/processing/types"

type DownloadOutput = ProcessedOutput & { url: string }

export function ToolWorkspace({ tool }: { tool: ToolDefinition }) {
  const [files, setFiles] = useState<File[]>([])
  const [options, setOptions] = useState<ProcessingOptions>(defaultOptions)
  const [dragging, setDragging] = useState(false)
  const [status, setStatus] = useState<"idle" | "working" | "success" | "error">("idle")
  const [message, setMessage] = useState("")
  const [progress, setProgress] = useState(0)
  const [outputs, setOutputs] = useState<DownloadOutput[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const controllerRef = useRef<AbortController | null>(null)

  function revokeOutputs() {
    outputs.forEach((output) => URL.revokeObjectURL(output.url))
    setOutputs([])
  }

  useEffect(() => {
    return () => outputs.forEach((output) => URL.revokeObjectURL(output.url))
  }, [outputs])

  function addFiles(incoming: FileList | File[]) {
    revokeOutputs()
    setStatus("idle")
    const selected = Array.from(incoming)
    setFiles((current) => tool.multiple ? [...current, ...selected] : selected.slice(-1))
  }

  function moveFile(index: number, direction: -1 | 1) {
    setFiles((current) => {
      const target = index + direction
      if (target < 0 || target >= current.length) return current
      const next = [...current]
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })
  }

  function removeFile(index: number) {
    setFiles((current) => current.filter((_, fileIndex) => fileIndex !== index))
  }

  function clearAll() {
    revokeOutputs()
    setFiles([])
    setStatus("idle")
    setMessage("")
    setProgress(0)
    if (inputRef.current) inputRef.current.value = ""
  }

  async function run() {
    revokeOutputs()
    setStatus("working")
    setProgress(1)
    setMessage("Preparing files")
    const controller = new AbortController()
    controllerRef.current = controller
    try {
      const result = await processTool(tool, files, options, (value, nextMessage) => {
        setProgress(Math.max(1, Math.min(95, Math.round(value))))
        setMessage(nextMessage)
      }, controller.signal)
      setOutputs(result.map((output) => ({ ...output, url: URL.createObjectURL(output.blob) })))
      setProgress(100)
      setMessage(`Created ${result.length} download${result.length === 1 ? "" : "s"}. Check the result before sharing it.`)
      setStatus("success")
    } catch (error) {
      setStatus("error")
      setMessage(error instanceof DOMException && error.name === "AbortError" ? "Processing was cancelled. No output was saved." : error instanceof Error ? error.message : "The file could not be processed.")
      setProgress(0)
    } finally {
      controllerRef.current = null
    }
  }

  const totalBytes = files.reduce((sum, file) => sum + file.size, 0)

  return (
    <div className="workspace">
      <div
        className={`dropzone${dragging ? " dragging" : ""}`}
        onDragEnter={(event) => { event.preventDefault(); setDragging(true) }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={(event) => { if (event.currentTarget === event.target) setDragging(false) }}
        onDrop={(event) => {
          event.preventDefault()
          setDragging(false)
          addFiles(event.dataTransfer.files)
        }}
      >
        <div>
          <span className="drop-icon" aria-hidden="true">＋</span>
          <h2>Drop {tool.multiple ? "files" : "a file"} here</h2>
          <p>or choose {tool.multiple ? "files" : "a file"} from your device</p>
          <input
            ref={inputRef}
            id="file-picker"
            type="file"
            accept={tool.accept}
            multiple={tool.multiple}
            onChange={(event) => event.target.files && addFiles(event.target.files)}
          />
          <label className="button button-primary" htmlFor="file-picker">Choose {tool.multiple ? "files" : "file"}</label>
          <small className="drop-note">Up to 100 MB per file and 200 MB total · processed locally</small>
        </div>
      </div>

      {files.length > 0 && (
        <>
          <ul className="file-list" aria-label="Selected files">
            {files.map((file, index) => (
              <li className="file-row" key={`${file.name}-${file.size}-${file.lastModified}-${index}`}>
                <span className="file-type">{tool.category === "pdf" ? "PDF" : "IMG"}</span>
                <span className="file-info"><strong title={file.name}>{file.name}</strong><small>{formatBytes(file.size)}</small></span>
                <span className="row-actions">
                  {tool.multiple && <button className="icon-button" type="button" onClick={() => moveFile(index, -1)} disabled={index === 0} aria-label={`Move ${file.name} up`}>↑</button>}
                  {tool.multiple && <button className="icon-button" type="button" onClick={() => moveFile(index, 1)} disabled={index === files.length - 1} aria-label={`Move ${file.name} down`}>↓</button>}
                  <button className="icon-button" type="button" onClick={() => removeFile(index)} aria-label={`Remove ${file.name}`}>×</button>
                </span>
              </li>
            ))}
          </ul>

          <ToolSettings tool={tool} options={options} setOptions={setOptions} />

          <div className="workspace-actions">
            <button className="button button-quiet" type="button" onClick={clearAll} disabled={status === "working"}>Clear</button>
            {status === "working" ? <button className="button button-secondary" type="button" onClick={() => controllerRef.current?.abort()}>Cancel</button> : <button className="button button-primary" type="button" onClick={run} disabled={files.length < tool.minimumFiles}>{tool.action}</button>}
          </div>
          <div className="privacy-note"><span aria-hidden="true">🔒</span><span><strong>{formatBytes(totalBytes)} stays on this device.</strong> Closing or clearing the page releases temporary browser data.</span></div>
        </>
      )}

      {status !== "idle" && (
        <div className={`status-panel status-${status}`} role={status === "error" ? "alert" : "status"} aria-live="polite">
          <strong>{status === "working" ? "Working locally" : status === "success" ? "Ready to download" : "Could not process file"}</strong>
          <div>{message}</div>
          {status === "working" && <div className="progress-track" aria-label={`${progress}% complete`}><div className="progress-bar" style={{ width: `${progress}%` }} /></div>}
          {outputs.length > 0 && (
            <div className="output-list">
              {outputs.map((output) => (
                <div className="output-row" key={output.url}>
                  <span><strong>{output.name}</strong> · {formatBytes(output.blob.size)}{output.sourceBytes ? ` · ${Math.round((1 - output.blob.size / output.sourceBytes) * 100)}% size change` : ""}</span>
                  <a href={output.url} download={output.name}>Download</a>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function ToolSettings({ tool, options, setOptions }: {
  tool: ToolDefinition
  options: ProcessingOptions
  setOptions: React.Dispatch<React.SetStateAction<ProcessingOptions>>
}) {
  function update<K extends keyof ProcessingOptions>(key: K, value: ProcessingOptions[K]) {
    setOptions((current) => ({ ...current, [key]: value }))
  }

  if (tool.slug === "merge-pdf") return null

  if (tool.slug === "split-pdf") return (
    <div className="settings">
      <div className="field"><label htmlFor="split-mode">Split method</label><select id="split-mode" value={options.splitMode} onChange={(e) => update("splitMode", e.target.value as ProcessingOptions["splitMode"])}><option value="every">Every page</option><option value="custom">Custom groups</option></select></div>
      {options.splitMode === "custom" && <div className="field field-wide"><label htmlFor="ranges">Page groups</label><input id="ranges" value={options.ranges} onChange={(e) => update("ranges", e.target.value)} placeholder="1-3; 4,6; 7-10" /><small>Separate output files with semicolons. Commas combine pages in one output.</small></div>}
    </div>
  )

  if (tool.slug === "reorder-pdf") return (
    <div className="settings"><div className="field field-wide"><label htmlFor="page-order">New page order</label><input id="page-order" value={options.pageOrder} onChange={(e) => update("pageOrder", e.target.value)} placeholder="3,1,2 or 10-1" /><small>Ranges may run forwards or backwards. Repeat a number to duplicate that page.</small></div></div>
  )

  if (tool.slug === "image-to-pdf") return (
    <div className="settings">
      <SelectField label="Page size" value={options.pageSize} onChange={(value) => update("pageSize", value as ProcessingOptions["pageSize"])} options={["A4", "Letter", "fit"]} />
      <SelectField label="Orientation" value={options.orientation} onChange={(value) => update("orientation", value as ProcessingOptions["orientation"])} options={["auto", "portrait", "landscape"]} />
      <NumberField label="Margin (points)" value={options.margin} min={0} max={144} onChange={(value) => update("margin", value)} />
    </div>
  )

  if (tool.slug === "pdf-to-image") return (
    <div className="settings">
      <FormatField value={options.format} onChange={(value) => update("format", value)} />
      <div className="field"><label htmlFor="dpi">Resolution</label><select id="dpi" value={options.dpi} onChange={(e) => update("dpi", Number(e.target.value) as ProcessingOptions["dpi"])}><option value="96">96 DPI · preview</option><option value="150">150 DPI · normal</option><option value="300">300 DPI · print</option></select></div>
      {options.format !== "image/png" && <QualityField value={options.quality} onChange={(value) => update("quality", value)} />}
    </div>
  )

  if (tool.slug === "merge-images") return (
    <div className="settings">
      <SelectField label="Layout" value={options.direction} onChange={(value) => update("direction", value as ProcessingOptions["direction"])} options={["vertical", "horizontal", "grid"]} />
      {options.direction === "grid" && <NumberField label="Columns" value={options.columns} min={1} max={10} onChange={(value) => update("columns", value)} />}
      <NumberField label="Gap (pixels)" value={options.gap} min={0} max={200} onChange={(value) => update("gap", value)} />
      <div className="field"><label htmlFor="background">Background</label><input id="background" type="color" value={options.background} onChange={(e) => update("background", e.target.value)} /></div>
      <FormatField value={options.format} onChange={(value) => update("format", value)} />
      {options.format !== "image/png" && <QualityField value={options.quality} onChange={(value) => update("quality", value)} />}
    </div>
  )

  return (
    <div className="settings">
      <FormatField value={tool.slug === "compress-image" && options.format === "image/png" ? "image/webp" : options.format} onChange={(value) => update("format", value)} />
      <QualityField value={options.quality} onChange={(value) => update("quality", value)} />
      <NumberField label="Maximum width (pixels)" value={options.maxWidth} min={320} max={12000} onChange={(value) => update("maxWidth", value)} />
    </div>
  )
}

function SelectField({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  const id = label.toLowerCase().replace(/\W+/g, "-")
  return <div className="field"><label htmlFor={id}>{label}</label><select id={id} value={value} onChange={(e) => onChange(e.target.value)}>{options.map((option) => <option key={option} value={option}>{option}</option>)}</select></div>
}

function NumberField({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (value: number) => void }) {
  const id = label.toLowerCase().replace(/\W+/g, "-")
  return <div className="field"><label htmlFor={id}>{label}</label><input id={id} type="number" min={min} max={max} value={value} onChange={(e) => onChange(Math.max(min, Math.min(max, Number(e.target.value))))} /></div>
}

function FormatField({ value, onChange }: { value: ProcessingOptions["format"]; onChange: (value: ProcessingOptions["format"]) => void }) {
  return <div className="field"><label htmlFor="format">Output format</label><select id="format" value={value} onChange={(e) => onChange(e.target.value as ProcessingOptions["format"])}><option value="image/jpeg">JPG</option><option value="image/png">PNG</option><option value="image/webp">WebP</option></select></div>
}

function QualityField({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  return <div className="field field-wide"><label htmlFor="quality">Quality: {Math.round(value * 100)}%</label><input id="quality" type="range" min="0.35" max="1" step="0.01" value={value} onChange={(e) => onChange(Number(e.target.value))} /></div>
}
