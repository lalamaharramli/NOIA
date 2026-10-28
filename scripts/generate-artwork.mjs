import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * Generates the illustrative artwork used by the site.
 *
 * Why SVGs? They are tiny, sharp on every screen and easy to replace.
 * Run `npm run artwork` after editing this file. The real product photos
 * should eventually replace these files in public/images/products/.
 */

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const productsDir = path.join(projectRoot, 'public', 'images', 'products')
const imagesDir = path.join(projectRoot, 'public', 'images')

const STITCH = 'stroke-dasharray="11 9" stroke-linecap="round"'

const palettes = {
  tote: {
    bg: ['#F6EEE2', '#E9D9C4'],
    main: '#B07B5E',
    secondary: '#8C927A',
    light: '#F1E5D3',
    accent: '#D8BEA5',
    ink: '#6D4A36',
  },
  blanket: {
    bg: ['#F8F0E8', '#EBD8CC'],
    main: '#C08D7C',
    secondary: '#9AA48B',
    light: '#F7EAE0',
    accent: '#E6C9BA',
    ink: '#7A5548',
  },
  hat: {
    bg: ['#F8F1E9', '#EBDACC'],
    main: '#C68F7E',
    secondary: '#E3C4B6',
    light: '#F3E3D8',
    accent: '#A9714B',
    ink: '#74503F',
  },
  coasters: {
    bg: ['#F6EEE1', '#E8D5BD'],
    main: '#A9714B',
    secondary: '#CBA97F',
    light: '#EFE2CD',
    accent: '#8C927A',
    ink: '#6B4E38',
  },
  bunny: {
    bg: ['#F9F3EA', '#EBDFCC'],
    main: '#D3B7A3',
    secondary: '#E9D6C4',
    light: '#F3E7D7',
    accent: '#C49782',
    ink: '#6E5545',
  },
  scarf: {
    bg: ['#F4EDE4', '#E4D6C5'],
    main: '#B9A78F',
    secondary: '#8C8276',
    light: '#EBE1D3',
    accent: '#C9B49A',
    ink: '#5E564C',
  },
  keychain: {
    bg: ['#F8F1E7', '#EBDBC8'],
    main: '#C98F7C',
    secondary: '#97A188',
    light: '#F4E6D8',
    accent: '#C6A05B',
    ink: '#70503F',
  },
  market: {
    bg: ['#F6EFE3', '#E8DAC2'],
    main: '#8C927A',
    secondary: '#C0AE90',
    light: '#EFE5D2',
    accent: '#B07B5E',
    ink: '#5F5B44',
  },
  hero: {
    bg: ['#FBF6EE', '#EADBC8'],
    main: '#A9714B',
    secondary: '#8C927A',
    light: '#F6EBDB',
    accent: '#E1C3B2',
    ink: '#5E4433',
  },
  studio: {
    bg: ['#FAF5EC', '#E7D7C2'],
    main: '#A9714B',
    secondary: '#8C927A',
    light: '#F4E9D9',
    accent: '#DFC0AE',
    ink: '#5E4433',
  },
}

/** Rounded square granny motif. */
function grannySquare(p, size = 128, inner = p.accent) {
  const s = size / 2
  return `
    <g>
      <rect x="${-s}" y="${-s}" width="${size}" height="${size}" rx="${size * 0.12}" fill="${p.light}" />
      <rect x="${-s + 9}" y="${-s + 9}" width="${size - 18}" height="${size - 18}" rx="${size * 0.08}" fill="none" stroke="${p.main}" stroke-width="${size * 0.07}" ${STITCH} />
      <rect x="${-s + 28}" y="${-s + 28}" width="${size - 56}" height="${size - 56}" rx="${size * 0.05}" fill="none" stroke="${p.secondary}" stroke-width="${size * 0.055}" ${STITCH} />
      <rect x="${-s + 44}" y="${-s + 44}" width="${size - 88}" height="${size - 88}" rx="${size * 0.04}" fill="${inner}" opacity="0.92" />
    </g>`
}

function toteMotif(p) {
  const cell = 128
  const step = 134
  const innerColors = [
    p.accent,
    p.secondary,
    p.main,
    p.secondary,
    p.accent,
    p.secondary,
    p.main,
    p.accent,
    p.secondary,
  ]
  const squares = []
  let index = 0

  for (let row = -1; row <= 1; row += 1) {
    for (let col = -1; col <= 1; col += 1) {
      squares.push(
        `<g transform="translate(${col * step} ${row * step + 20}) rotate(${index % 2 === 0 ? 0 : 90})">${grannySquare(
          p,
          cell,
          innerColors[index],
        )}</g>`,
      )
      index += 1
    }
  }

  return `
    <g>
      <path d="M -148 -186 C -158 -356 158 -356 148 -186" fill="none" stroke="${p.ink}" stroke-width="15" ${STITCH} opacity="0.85" />
      <path d="M -148 -186 C -148 -330 148 -330 148 -186" fill="none" stroke="${p.main}" stroke-width="10" opacity="0.75" />
      <rect x="-212" y="-206" width="424" height="448" rx="36" fill="${p.light}" />
      ${squares.join('')}
      <path d="M -212 -150 Q 0 -120 212 -150" fill="none" stroke="${p.ink}" stroke-width="3" opacity="0.15" />
    </g>`
}

function blanketMotif(p) {
  const colors = [p.main, p.light, p.secondary, p.accent, p.main, p.light, p.secondary]
  const bandStart = -230
  const bands = colors.map((color, index) => {
    const y = bandStart + index * 70
    const path = `M -310 ${y} q 78 -26 156 0 t 156 0 t 156 0 t 156 0`
    return `
      <path d="${path}" fill="none" stroke="${color}" stroke-width="58" stroke-linecap="round" />
      <path d="${path}" fill="none" stroke="${p.ink}" stroke-width="2" opacity="0.16" ${STITCH} transform="translate(0 -20)" />`
  })

  const fringe = Array.from({ length: 24 })
    .map((_, index) => {
      const x = -300 + index * 26
      return `<path d="M ${x} 268 q ${index % 2 === 0 ? 6 : -6} 32 0 62" fill="none" stroke="${p.main}" stroke-width="4" opacity="0.65" stroke-linecap="round" />`
    })
    .join('')

  return `
    <g transform="rotate(-5)">
      <rect x="-336" y="-292" width="672" height="566" rx="46" fill="${p.light}" />
      ${bands.join('')}
      ${fringe}
    </g>`
}

function hatMotif(p) {
  return `
    <g>
      <path d="M -300 20 Q -300 108 0 112 Q 300 108 300 20 Q 300 -12 248 -22 L -248 -22 Q -300 -12 -300 20 Z" fill="${p.accent}" />
      <path d="M -248 -18 Q 0 34 248 -18 L 248 16 Q 0 66 -248 16 Z" fill="${p.main}" opacity="0.45" />
      <path d="M -188 -20 C -198 -120 -140 -238 0 -250 C 140 -238 198 -120 188 -20 Z" fill="${p.light}" />
      <path d="M -188 -20 C -196 -116 -138 -232 0 -244" fill="none" stroke="${p.main}" stroke-width="6" opacity="0.5" ${STITCH} />
      <path d="M -168 -72 Q 0 -40 168 -72" fill="none" stroke="${p.main}" stroke-width="5" opacity="0.45" ${STITCH} />
      <path d="M -148 -128 Q 0 -96 148 -128" fill="none" stroke="${p.secondary}" stroke-width="5" opacity="0.8" ${STITCH} />
      <path d="M -108 -186 Q 0 -158 108 -186" fill="none" stroke="${p.main}" stroke-width="5" opacity="0.45" ${STITCH} />
      <ellipse cx="0" cy="-246" rx="64" ry="24" fill="${p.accent}" opacity="0.85" />
      ${Array.from({ length: 9 })
        .map((_, index) => {
          const angle = -60 + index * 15
          return `<path d="M 0 -244 L ${Math.sin((angle * Math.PI) / 180) * 176} ${-20 - Math.cos((angle * Math.PI) / 180) * 4}" stroke="${p.main}" stroke-width="2" opacity="0.13" transform="rotate(${angle} 0 -20)" />`
        })
        .join('')}
    </g>`
}

function coasterMotif(p) {
  const positions = [
    [-108, -94],
    [108, -94],
    [-108, 104],
    [108, 104],
  ]

  return `<g>${positions
    .map(
      ([x, y], index) => `
      <g transform="translate(${x} ${y}) rotate(${index * 4 - 6})">
        <circle r="112" fill="${p.light}" stroke="${p.main}" stroke-width="9" ${STITCH} />
        <circle r="80" fill="none" stroke="${index % 2 === 0 ? p.secondary : p.accent}" stroke-width="8" ${STITCH} />
        <circle r="48" fill="none" stroke="${p.main}" stroke-width="7" ${STITCH} />
        <circle r="18" fill="${p.accent}" opacity="0.9" />
      </g>`,
    )
    .join('')}</g>`
}

function bunnyMotif(p) {
  return `
    <g>
      <ellipse cx="-62" cy="-300" rx="46" ry="132" transform="rotate(-11 -62 -300)" fill="${p.light}" stroke="${p.main}" stroke-width="8" />
      <ellipse cx="62" cy="-300" rx="46" ry="132" transform="rotate(11 62 -300)" fill="${p.light}" stroke="${p.main}" stroke-width="8" />
      <ellipse cx="-62" cy="-304" rx="21" ry="94" transform="rotate(-11 -62 -304)" fill="${p.accent}" opacity="0.6" />
      <ellipse cx="62" cy="-304" rx="21" ry="94" transform="rotate(11 62 -304)" fill="${p.accent}" opacity="0.6" />
      <ellipse cx="0" cy="156" rx="158" ry="184" fill="${p.light}" stroke="${p.main}" stroke-width="8" />
      <ellipse cx="-158" cy="132" rx="46" ry="86" transform="rotate(24 -158 132)" fill="${p.light}" stroke="${p.main}" stroke-width="8" />
      <ellipse cx="158" cy="132" rx="46" ry="86" transform="rotate(-24 158 132)" fill="${p.light}" stroke="${p.main}" stroke-width="8" />
      <circle cx="0" cy="-92" r="142" fill="${p.light}" stroke="${p.main}" stroke-width="8" />
      <ellipse cx="0" cy="214" rx="96" ry="74" fill="${p.secondary}" opacity="0.55" />
      <circle cx="-52" cy="-112" r="9" fill="${p.ink}" />
      <circle cx="52" cy="-112" r="9" fill="${p.ink}" />
      <path d="M -16 -78 Q 0 -66 16 -78" fill="none" stroke="${p.ink}" stroke-width="5" stroke-linecap="round" />
      <circle cx="0" cy="-86" r="7" fill="${p.accent}" />
      <path d="M 0 -34 L 0 30" stroke="${p.main}" stroke-width="3" opacity="0.4" stroke-dasharray="6 9" stroke-linecap="round" />
      <path d="M -130 168 Q 0 196 130 168" fill="none" stroke="${p.main}" stroke-width="3" opacity="0.3" stroke-dasharray="6 10" />
    </g>`
}

function scarfMotif(p) {
  const ribs = Array.from({ length: 9 })
    .map((_, index) => {
      const x = -88 + index * 22
      return `<path d="M ${x} -306 L ${x} 306" stroke="${index % 2 === 0 ? p.main : p.secondary}" stroke-width="7" opacity="0.55" ${STITCH} />`
    })
    .join('')

  const fringe = Array.from({ length: 9 })
    .map((_, index) => {
      const x = -100 + index * 25
      return `<path d="M ${x} 334 q ${index % 2 === 0 ? 7 : -7} 34 1 62" fill="none" stroke="${p.main}" stroke-width="4" stroke-linecap="round" opacity="0.7" />`
    })
    .join('')

  return `
    <g transform="rotate(-9)">
      <rect x="-134" y="-340" width="268" height="690" rx="42" fill="${p.light}" stroke="${p.main}" stroke-width="6" />
      <path d="M -134 -260 Q 0 -220 134 -260" fill="none" stroke="${p.secondary}" stroke-width="4" opacity="0.45" />
      ${ribs}
      <rect x="-110" y="288" width="220" height="46" rx="20" fill="${p.accent}" opacity="0.7" />
      ${fringe}
    </g>`
}

function keychainMotif(p) {
  const petals = Array.from({ length: 6 })
    .map(
      (_, index) => `
      <g transform="rotate(${index * 60})">
        <ellipse cx="0" cy="-128" rx="68" ry="108" fill="${p.light}" stroke="${p.main}" stroke-width="7" />
        <ellipse cx="0" cy="-128" rx="30" ry="64" fill="${p.accent}" opacity="0.55" />
      </g>`,
    )
    .join('')

  const chainLinks = Array.from({ length: 8 })
    .map(
      (_, index) =>
        `<circle cx="0" cy="${-250 - index * 24}" r="9" fill="none" stroke="${p.secondary}" stroke-width="5" opacity="0.85" />`,
    )
    .join('')

  return `
    <g>
      ${petals}
      <circle r="82" fill="${p.accent}" stroke="${p.main}" stroke-width="7" />
      <circle r="54" fill="none" stroke="${p.light}" stroke-width="6" ${STITCH} opacity="0.8" />
      <circle r="26" fill="none" stroke="${p.main}" stroke-width="5" ${STITCH} />
      <path d="M 0 -250 L 0 -382" stroke="${p.secondary}" stroke-width="3" opacity="0.5" />
      ${chainLinks}
      <circle cx="0" cy="-414" r="30" fill="none" stroke="#8b8177" stroke-width="9" />
      <circle cx="0" cy="-414" r="30" fill="none" stroke="#c8c0b6" stroke-width="3" />
    </g>`
}

function marketBagMotif(p) {
  const netLines = []
  for (let offset = -520; offset <= 520; offset += 42) {
    netLines.push(
      `<path d="M ${offset} -280 L ${offset + 560} 280" stroke="${p.main}" stroke-width="5" opacity="0.55" />`,
      `<path d="M ${offset} 280 L ${offset + 560} -280" stroke="${p.main}" stroke-width="5" opacity="0.55" />`,
    )
  }

  return `
    <g>
      <path d="M -178 -246 C -196 -420 196 -420 178 -246" fill="none" stroke="${p.ink}" stroke-width="12" ${STITCH} opacity="0.8" />
      <clipPath id="marketBagClip">
        <path d="M -226 -256 Q 0 -292 226 -256 L 268 208 Q 0 274 -268 208 Z" />
      </clipPath>
      <g clip-path="url(#marketBagClip)">
        <rect x="-290" y="-300" width="580" height="600" fill="${p.light}" />
        ${netLines.join('')}
        <path d="M -290 -30 Q 0 20 290 -30" fill="none" stroke="${p.accent}" stroke-width="18" opacity="0.45" />
      </g>
      <path d="M -226 -256 Q 0 -292 226 -256 L 268 208 Q 0 274 -268 208 Z" fill="none" stroke="${p.main}" stroke-width="9" />
      <path d="M -220 -250 Q 0 -284 220 -250" fill="none" stroke="${p.secondary}" stroke-width="6" ${STITCH} />
    </g>`
}

/** Concentric crochet doily used by the hero and social preview. */
function doilyMotif(p) {
  const rings = [338, 296, 254, 212, 170, 128]
  const strokes = [p.main, p.secondary, p.accent, p.main, p.secondary, p.accent]

  const petals = Array.from({ length: 24 })
    .map(
      (_, index) => `
      <g transform="rotate(${index * 15})">
        <path d="M 0 -338 q 30 -44 0 -82 q -30 38 0 82" fill="${p.accent}" opacity="0.7" />
      </g>`,
    )
    .join('')

  const ringElements = rings
    .map(
      (radius, index) =>
        `<circle r="${radius}" fill="none" stroke="${strokes[index]}" stroke-width="${index === 0 ? 13 : 7}" ${STITCH} opacity="${0.9 - index * 0.05}" />`,
    )
    .join('')

  const spiralPoints = []
  for (let angle = 0; angle < 8.2 * Math.PI; angle += 0.16) {
    const radius = 8 + angle * 4.2
    spiralPoints.push(
      `${(radius * Math.cos(angle)).toFixed(1)},${(radius * Math.sin(angle)).toFixed(1)}`,
    )
  }

  return `
    <g>
      ${petals}
      ${ringElements}
      <circle r="104" fill="${p.light}" stroke="${p.main}" stroke-width="8" />
      <polyline points="${spiralPoints.join(' ')}" fill="none" stroke="${p.main}" stroke-width="6" stroke-linecap="round" opacity="0.75" transform="rotate(-24)" />
    </g>`
}

function yarnBall(p, radius = 96) {
  return `
    <g>
      <circle r="${radius}" fill="${p.accent}" stroke="${p.main}" stroke-width="5" />
      <ellipse rx="${radius * 0.92}" ry="${radius * 0.4}" fill="none" stroke="${p.main}" stroke-width="4" opacity="0.55" transform="rotate(24)" />
      <ellipse rx="${radius * 0.92}" ry="${radius * 0.4}" fill="none" stroke="${p.light}" stroke-width="4" opacity="0.8" transform="rotate(-28)" />
      <ellipse rx="${radius * 0.55}" ry="${radius * 0.92}" fill="none" stroke="${p.main}" stroke-width="3" opacity="0.4" />
      <path d="M ${radius * 0.7} ${radius * 0.55} q 70 50 130 30" fill="none" stroke="${p.main}" stroke-width="4" opacity="0.6" />
    </g>`
}

function crochetHook(p, length = 300) {
  return `
    <g transform="rotate(28)">
      <rect x="${-length / 2}" y="-8" width="${length}" height="16" rx="8" fill="#B79C7C" />
      <path d="M ${length / 2 - 4} -6 q 34 6 30 32 q -2 18 -22 16" fill="none" stroke="#8D7256" stroke-width="9" stroke-linecap="round" />
      <rect x="${-length / 2}" y="-8" width="62" height="16" rx="8" fill="${p.ink}" opacity="0.8" />
    </g>`
}

/** Shared background, grain and shadow definitions. */
function frameDefs(p) {
  return `
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="0.3" y2="1">
        <stop offset="0%" stop-color="${p.bg[0]}" />
        <stop offset="100%" stop-color="${p.bg[1]}" />
      </linearGradient>
      <radialGradient id="glow" cx="35%" cy="22%" r="70%">
        <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.55" />
        <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0" />
      </radialGradient>
      <radialGradient id="vignette" cx="50%" cy="50%" r="72%">
        <stop offset="55%" stop-color="#6B4B33" stop-opacity="0" />
        <stop offset="100%" stop-color="#6B4B33" stop-opacity="0.12" />
      </radialGradient>
      <filter id="softShadow" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="22" stdDeviation="26" flood-color="#5A4231" flood-opacity="0.18" />
      </filter>
      <filter id="grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.86" numOctaves="3" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
        <feComponentTransfer>
          <feFuncA type="linear" slope="0.055" />
        </feComponentTransfer>
      </filter>
    </defs>`
}

function productSvg(p, motif, { zoom = 1, shift = [0, 0] } = {}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1250" width="1000" height="1250" role="img">
  ${frameDefs(p)}
  <rect width="1000" height="1250" fill="url(#bg)" />
  <rect width="1000" height="1250" fill="url(#glow)" />
  <circle cx="500" cy="610" r="395" fill="${p.light}" opacity="0.35" />
  <circle cx="500" cy="610" r="395" fill="none" stroke="${p.main}" stroke-width="1.5" opacity="0.18" ${STITCH} />
  <g transform="translate(500 610) translate(${shift[0]} ${shift[1]}) scale(${zoom})" filter="url(#softShadow)">
    ${motif}
  </g>
  <rect width="1000" height="1250" fill="url(#vignette)" />
  <rect width="1000" height="1250" filter="url(#grain)" opacity="0.65" style="mix-blend-mode:multiply" />
</svg>
`
}

function heroSvg() {
  const p = palettes.hero
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1200" width="1000" height="1200" role="img">
  ${frameDefs(p)}
  <rect width="1000" height="1200" fill="url(#bg)" />
  <rect width="1000" height="1200" fill="url(#glow)" />
  <g transform="translate(500 560)">
    <g filter="url(#softShadow)">
      ${doilyMotif(p)}
    </g>
    <g transform="translate(-262 268) rotate(9)" filter="url(#softShadow)">
      ${grannySquare(p, 196, p.secondary)}
    </g>
    <g transform="translate(270 -254)" filter="url(#softShadow)">
      ${yarnBall(p, 92)}
    </g>
    <g transform="translate(40 -430) rotate(12)" opacity="0.9">
      ${crochetHook(p, 260)}
    </g>
    <g transform="translate(-300 -300)" opacity="0.75">
      <path d="M 0 0 q 70 -30 120 10" fill="none" stroke="${p.main}" stroke-width="4" ${STITCH} />
    </g>
  </g>
  <rect width="1000" height="1200" fill="url(#vignette)" />
  <rect width="1000" height="1200" filter="url(#grain)" opacity="0.65" style="mix-blend-mode:multiply" />
</svg>
`
}

function studioSvg() {
  const p = palettes.studio
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" width="1600" height="1000" role="img">
  ${frameDefs(p)}
  <rect width="1600" height="1000" fill="url(#bg)" />
  <rect width="1600" height="1000" fill="url(#glow)" />
  <g transform="translate(470 520) rotate(-7)" filter="url(#softShadow)">
    <rect x="-250" y="-56" width="500" height="112" rx="24" fill="${p.light}" stroke="${p.main}" stroke-width="4" />
    <rect x="-250" y="-170" width="500" height="112" rx="24" fill="${p.accent}" opacity="0.75" stroke="${p.main}" stroke-width="4" />
    <path d="M -230 -14 L 230 -14 M -230 -128 L 230 -128" stroke="${p.main}" stroke-width="3" ${STITCH} opacity="0.5" />
    <path d="M -190 -170 q 30 -26 60 0 t 60 0 t 60 0 t 60 0 t 60 0 t 60 0" fill="none" stroke="${p.secondary}" stroke-width="3" opacity="0.5" />
  </g>

  <g transform="translate(1040 420)" filter="url(#softShadow)">
    ${yarnBall(p, 168)}
  </g>
  <g transform="translate(1290 620)" filter="url(#softShadow)">
    ${yarnBall({ ...p, accent: p.secondary }, 122)}
  </g>
  <g transform="translate(920 700)" filter="url(#softShadow)">
    ${yarnBall({ ...p, accent: '#C9B49A' }, 96)}
  </g>

  <g transform="translate(760 800) rotate(8)" opacity="0.95">
    ${crochetHook(p, 320)}
  </g>

  <g transform="translate(1330 250) rotate(-14)" opacity="0.8">
    ${grannySquare(p, 150, p.accent)}
  </g>

  <rect width="1600" height="1000" fill="url(#vignette)" />
  <rect width="1600" height="1000" filter="url(#grain)" opacity="0.6" style="mix-blend-mode:multiply" />
</svg>
`
}

const productArtwork = [
  { slug: 'square-motif-tote', palette: palettes.tote, motif: toteMotif },
  { slug: 'ripple-baby-blanket', palette: palettes.blanket, motif: blanketMotif },
  { slug: 'blush-bucket-hat', palette: palettes.hat, motif: hatMotif },
  { slug: 'coaster-set', palette: palettes.coasters, motif: coasterMotif },
  { slug: 'amigurumi-bunny', palette: palettes.bunny, motif: bunnyMotif },
  { slug: 'ribbed-scarf', palette: palettes.scarf, motif: scarfMotif },
  { slug: 'flower-keychain', palette: palettes.keychain, motif: keychainMotif },
  { slug: 'string-market-bag', palette: palettes.market, motif: marketBagMotif },
]

async function main() {
  await mkdir(productsDir, { recursive: true })
  await mkdir(imagesDir, { recursive: true })

  for (const item of productArtwork) {
    const motif = item.motif(item.palette)
    const mainImage = productSvg(item.palette, motif)
    const detailImage = productSvg(item.palette, motif, { zoom: 1.55, shift: [-20, -40] })

    await writeFile(path.join(productsDir, `${item.slug}-1.svg`), mainImage, 'utf8')
    await writeFile(path.join(productsDir, `${item.slug}-2.svg`), detailImage, 'utf8')
  }

  await writeFile(path.join(imagesDir, 'hero.svg'), heroSvg(), 'utf8')
  await writeFile(path.join(imagesDir, 'studio.svg'), studioSvg(), 'utf8')

  console.log(`Generated ${productArtwork.length * 2 + 2} SVG images.`)
}

await main()
