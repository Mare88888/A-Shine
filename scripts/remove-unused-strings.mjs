import fs from 'fs'

const FILES = ['strings/en.json', 'strings/sl.json']

// Keys confirmed unused in src (not referenced via t(), dynamic arrays, or metadata)
const REMOVE_PATHS = [
  'footer.taglineShort',
  'about.approach',
  'about.goal',
  'pricing.detailingIntroFactor1',
  'pricing.detailingIntroFactor2',
  'pricing.detailingIntroFactor3',
  'pricing.detailingIntroFactor4',
  'pricing.detailingIntroFactor5',
  'pricing.detailingPackagesHeading',
  'pricing.cleaningIntroShort',
  'pricing.cleaningServicesHeading',
  'pricing.cleaningService1',
  'pricing.cleaningService2',
  'pricing.cleaningService3',
  'pricing.cleaningPriceHeading',
  'pricing.cleaningPriceFactor1',
  'pricing.cleaningPriceFactor2',
  'pricing.cleaningPriceFactor3',
  'pricing.cleaningPriceFactor4',
  'pricing.cleaningPriceOnRequest',
  'pricing.cleaningAdditionalHeading',
  'pricing.cleaningAdditional1',
  'pricing.cleaningAdditional2',
  'pricing.cleaningAdditional3',
  'pricing.readMore',
  'pricing.readLess',
  'pricing.packages.cleaning-basic',
  'pricing.packages.cleaning-full',
  'pricing.packages.cleaning-premium',
  'contact.carType',
  'contact.placeholderCar',
  'contact.errors.carType',
  'contact.errors.dateFormat',
  'contact.errors.dateMonth',
  'contact.errors.dateDay',
  'contact.errors.dateYear',
]

function deletePath(obj, path) {
  const parts = path.split('.')
  let cur = obj
  for (let i = 0; i < parts.length - 1; i++) {
    if (!cur || typeof cur !== 'object') return false
    cur = cur[parts[i]]
  }
  const last = parts[parts.length - 1]
  if (cur && Object.prototype.hasOwnProperty.call(cur, last)) {
    delete cur[last]
    return true
  }
  return false
}

for (const file of FILES) {
  const data = JSON.parse(fs.readFileSync(file, 'utf8'))
  let removed = 0
  for (const p of REMOVE_PATHS) {
    if (deletePath(data, p)) removed++
  }
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n', 'utf8')
  console.log(`${file}: removed ${removed} keys`)
}
