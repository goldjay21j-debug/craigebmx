/**
 * Exports every document from the current database into a single JSON file,
 * plus a copy of each uploaded file. Run this against the LOCAL SQLite
 * database, then run importContent.ts against the production Postgres one.
 *
 *   npm run migrate:export
 */
import 'dotenv/config'

import fs from 'fs'
import path from 'path'
import { getPayload } from 'payload'

import config from '../payload.config.js'

const payload = await getPayload({ config })

const outDir = path.resolve(process.cwd(), 'migration-export')
const filesDir = path.join(outDir, 'files')
fs.mkdirSync(filesDir, { recursive: true })

const readAll = async (collection: 'bikes' | 'media' | 'orders' | 'users') => {
  const { docs } = await payload.find({
    collection,
    depth: 0,
    limit: 0,
    overrideAccess: true,
    pagination: false,
    ...(collection === 'bikes' ? { draft: true } : {}),
  })
  process.stdout.write(`  ${collection}: ${docs.length}\n`)
  return docs
}

process.stdout.write('Exporting collections\n')

const media = await readAll('media')
const bikes = await readAll('bikes')
const orders = await readAll('orders')
const users = await readAll('users')

const siteSettings = await payload.findGlobal({
  slug: 'site-settings',
  depth: 0,
  overrideAccess: true,
})

// Copy the binary files themselves; the JSON only records their names.
const mediaRoot = path.resolve(process.cwd(), 'media')
let copied = 0
let missing = 0

for (const doc of media as Array<{ filename?: null | string }>) {
  if (!doc.filename) continue
  const source = path.join(mediaRoot, doc.filename)
  if (!fs.existsSync(source)) {
    process.stdout.write(`  ! missing file: ${doc.filename}\n`)
    missing += 1
    continue
  }
  fs.copyFileSync(source, path.join(filesDir, doc.filename))
  copied += 1
}

fs.writeFileSync(
  path.join(outDir, 'content.json'),
  JSON.stringify({ media, bikes, orders, users, siteSettings }, null, 2),
)

process.stdout.write(
  `\nExported to ${outDir}\n` +
    `  ${copied} files copied${missing ? `, ${missing} missing` : ''}\n` +
    `  Users are exported WITHOUT passwords — recreate logins after import.\n`,
)

process.exit(0)
