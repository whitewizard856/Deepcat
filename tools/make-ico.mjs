// Wrap a PNG into a single-image ICO. Windows shortcuts and electron-builder both want
// an .ico; a 256×256 PNG entry is valid ICO data since Vista, so no re-encoding is needed.
import { readFileSync, writeFileSync } from 'node:fs'

const [source, target] = process.argv.slice(2)
if (!source || !target) {
  console.error('usage: node tools/make-ico.mjs <in.png> <out.ico>')
  process.exit(1)
}

const png = readFileSync(source)
const header = Buffer.alloc(6 + 16)
header.writeUInt16LE(0, 0) // reserved
header.writeUInt16LE(1, 2) // type: icon
header.writeUInt16LE(1, 4) // image count

const entry = 6
header.writeUInt8(0, entry + 0) // width 256
header.writeUInt8(0, entry + 1) // height 256
header.writeUInt8(0, entry + 2) // palette
header.writeUInt8(0, entry + 3) // reserved
header.writeUInt16LE(1, entry + 4) // colour planes
header.writeUInt16LE(32, entry + 6) // bits per pixel
header.writeUInt32LE(png.length, entry + 8)
header.writeUInt32LE(header.length, entry + 12)

writeFileSync(target, Buffer.concat([header, png]))
console.log(`wrote ${target} (${png.length + header.length} bytes)`)
