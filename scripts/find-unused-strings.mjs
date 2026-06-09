import fs from 'fs'
import path from 'path'

function flatten(obj, prefix = '') {
  const keys = []
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k
    if (v && typeof v === 'object' && !Array.isArray(v)) keys.push(...flatten(v, key))
    else keys.push(key)
  }
  return keys
}

function walkDir(dir, files = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name)
    if (ent.isDirectory() && !['node_modules', '.next'].includes(ent.name)) walkDir(p, files)
    else if (/\.(tsx?|jsx?|mjs)$/.test(ent.name)) files.push(p)
  }
  return files
}

function isKeyUsed(key, content) {
  const parts = key.split('.')
  const namespace = parts[0]
  const rest = parts.slice(1).join('.')
  const leaf = parts[parts.length - 1]

  const hasNamespace =
    content.includes(`useTranslations('${namespace}')`) ||
    content.includes(`useTranslations("${namespace}")`) ||
    content.includes(`namespace: '${namespace}'`) ||
    content.includes(`namespace: "${namespace}"`)

  // Full path after namespace: t('rest')
  if (rest) {
    const escaped = rest.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const re = new RegExp(`t(?:Pricing)?\\(['"]${escaped}['"]\\)`)
    if (re.test(content)) return true
  }

  // Leaf with namespace context
  if (hasNamespace && rest) {
    const escapedLeaf = leaf.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const reLeaf = new RegExp(`t(?:Pricing)?\\(['"]${escapedLeaf}['"]\\)`)
    if (reLeaf.test(content)) return true
  }

  // Dynamic package keys
  const pkgMatch = key.match(/^pricing\.packages\.([^.]+)\./)
  if (pkgMatch && content.includes(pkgMatch[1])) return true

  // WHY_KEYS / COMMITMENT_KEYS
  if (namespace === 'about' && leaf.startsWith('why') && content.includes('WHY_KEYS')) return true
  if (namespace === 'about' && leaf.startsWith('commitment') && content.includes('COMMITMENT_KEYS')) return true

  // nav footer keys
  if (namespace === 'nav' && (content.includes(`key: '${leaf}'`) || content.includes(`key: "${leaf}"`)))
    return true

  // stats
  if (namespace === 'stats' && (content.includes(`key: '${leaf}'`) || content.includes(`key: "${leaf}"`)))
    return true

  // pricing exterior/interior - check Pricing.tsx for key patterns
  if (key.startsWith('pricing.detailingExterior') || key.startsWith('pricing.detailingInterior')) {
    if (content.includes('EXTERIOR_KEYS') || content.includes('INTERIOR_KEYS') || content.includes(`t("${leaf}")`) || content.includes(`t('${leaf}')`))
      return true
  }

  // metadata
  if (namespace === 'metadata') {
    if (key === 'metadata.keywords') return content.includes('keywords')
    if (key.startsWith('metadata.og')) return content.includes('opengraph') || content.includes('ogTitle')
    if (['siteTitleDefault', 'siteDescription', 'homeTitle', 'homeDescription', 'ogTitle', 'ogDescription'].includes(leaf))
      return true
  }

  // services category keys
  if (namespace === 'services' && rest.includes('.')) {
    const cat = parts[1]
    if (content.includes(cat) || content.includes(`\`${cat}`)) return true
  }

  // contact errors
  if (key.startsWith('contact.errors.') && content.includes('validateField')) return true

  // pricing packages messages via useMessages
  if (key.startsWith('pricing.packages.') && content.includes('packagesMessages')) return true

  // legal pages - cookies, privacy, terms use t() for all keys in namespace
  if (['cookies', 'privacy', 'terms'].includes(namespace) && hasNamespace) {
    const escapedLeaf = leaf.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const reLeaf = new RegExp(`t\\(['"]${escapedLeaf}['"]\\)`)
    if (reLeaf.test(content)) return true
  }

  return false
}

const en = JSON.parse(fs.readFileSync('strings/en.json', 'utf8'))
const allKeys = flatten(en)
const srcFiles = walkDir('src')
let content = srcFiles.map((f) => fs.readFileSync(f, 'utf8')).join('\n')
try {
  content += fs.readFileSync('src/app/[locale]/opengraph-image.tsx', 'utf8')
} catch {}

const unused = allKeys.filter((key) => !isKeyUsed(key, content))

console.log(`Total: ${allKeys.length}, Unused: ${unused.length}`)
unused.forEach((k) => console.log(k))
