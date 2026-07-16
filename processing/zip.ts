type ZipEntry = { name: string; data: Uint8Array; crc: number; offset: number }

const table = new Uint32Array(256).map((_, index) => {
  let value = index
  for (let bit = 0; bit < 8; bit += 1) value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1
  return value >>> 0
})

export function crc32(data: Uint8Array) {
  let crc = 0xffffffff
  for (const byte of data) crc = table[(crc ^ byte) & 0xff] ^ (crc >>> 8)
  return (crc ^ 0xffffffff) >>> 0
}

function write16(view: DataView, offset: number, value: number) {
  view.setUint16(offset, value, true)
}

function write32(view: DataView, offset: number, value: number) {
  view.setUint32(offset, value, true)
}

function concat(chunks: Uint8Array[]) {
  const output = new Uint8Array(chunks.reduce((sum, chunk) => sum + chunk.byteLength, 0))
  let offset = 0
  for (const chunk of chunks) {
    output.set(chunk, offset)
    offset += chunk.byteLength
  }
  return output
}

function dosDateTime(date = new Date()) {
  const year = Math.max(1980, date.getFullYear())
  return {
    date: ((year - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate(),
    time: (date.getHours() << 11) | (date.getMinutes() << 5) | Math.floor(date.getSeconds() / 2),
  }
}

export async function createZip(files: { name: string; blob: Blob }[]) {
  const encoder = new TextEncoder()
  const localChunks: Uint8Array[] = []
  const entries: ZipEntry[] = []
  let offset = 0
  const stamp = dosDateTime()

  for (const file of files) {
    const name = encoder.encode(file.name)
    const data = new Uint8Array(await file.blob.arrayBuffer())
    const header = new Uint8Array(30 + name.byteLength)
    const view = new DataView(header.buffer)
    write32(view, 0, 0x04034b50)
    write16(view, 4, 20)
    write16(view, 6, 0x0800)
    write16(view, 8, 0)
    write16(view, 10, stamp.time)
    write16(view, 12, stamp.date)
    const crc = crc32(data)
    write32(view, 14, crc)
    write32(view, 18, data.byteLength)
    write32(view, 22, data.byteLength)
    write16(view, 26, name.byteLength)
    write16(view, 28, 0)
    header.set(name, 30)
    localChunks.push(header, data)
    entries.push({ name: file.name, data, crc, offset })
    offset += header.byteLength + data.byteLength
  }

  const centralChunks: Uint8Array[] = []
  for (const entry of entries) {
    const name = encoder.encode(entry.name)
    const header = new Uint8Array(46 + name.byteLength)
    const view = new DataView(header.buffer)
    write32(view, 0, 0x02014b50)
    write16(view, 4, 20)
    write16(view, 6, 20)
    write16(view, 8, 0x0800)
    write16(view, 10, 0)
    write16(view, 12, stamp.time)
    write16(view, 14, stamp.date)
    write32(view, 16, entry.crc)
    write32(view, 20, entry.data.byteLength)
    write32(view, 24, entry.data.byteLength)
    write16(view, 28, name.byteLength)
    write32(view, 42, entry.offset)
    header.set(name, 46)
    centralChunks.push(header)
  }

  const central = concat(centralChunks)
  const end = new Uint8Array(22)
  const endView = new DataView(end.buffer)
  write32(endView, 0, 0x06054b50)
  write16(endView, 8, entries.length)
  write16(endView, 10, entries.length)
  write32(endView, 12, central.byteLength)
  write32(endView, 16, offset)
  const archive = concat([...localChunks, central, end])
  return new Blob([archive], { type: "application/zip" })
}
