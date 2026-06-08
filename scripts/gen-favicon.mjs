import sharp from 'sharp'
import fs from 'fs'
import toIco from 'to-ico'

const ACCENT = '#00b8db'
const BG = { r: 8, g: 8, b: 10, alpha: 1 }
const GLYPH_RATIO = 0.6 // glyph height as fraction of icon size

// High-res font glyph on a transparent background; trimmed + centered later
// so the typographic "A" is preserved but perfectly centered.
const glyphSvg = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512">
    <text x="256" y="256" text-anchor="middle" dominant-baseline="central"
      font-family="Arial, Helvetica, system-ui, sans-serif" font-size="400" font-weight="700"
      fill="${ACCENT}">A</text>
  </svg>`,
)

async function buildPng(size) {
  const glyph = await sharp(glyphSvg).png().trim().toBuffer()
  const gm = await sharp(glyph).metadata()
  const targetH = Math.round(size * GLYPH_RATIO)
  const scale = targetH / gm.height
  const targetW = Math.round(gm.width * scale)
  const scaled = await sharp(glyph).resize(targetW, targetH).png().toBuffer()
  return sharp({ create: { width: size, height: size, channels: 4, background: BG } })
    .composite([
      {
        input: scaled,
        left: Math.round((size - targetW) / 2),
        top: Math.round((size - targetH) / 2),
      },
    ])
    .png()
    .toBuffer()
}

const pngTargets = [
  [32, 'public/favicon-32.png'],
  [48, 'public/favicon-48.png'],
  [48, 'public/icon.png'],
  [48, 'src/app/icon.png'],
]

for (const [size, out] of pngTargets) {
  fs.writeFileSync(out, await buildPng(size))
}

const icoBuffers = []
for (const s of [16, 32, 48]) icoBuffers.push(await buildPng(s))
fs.writeFileSync('src/app/favicon.ico', await toIco(icoBuffers))

console.log('Favicons regenerated.')
