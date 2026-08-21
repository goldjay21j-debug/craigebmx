/**
 * Replays migration-export/content.json into whatever DATABASE_URL points at.
 * Re-uploads each media file, so with the S3 variables set the images land in
 * the bucket rather than on the container's disk.
 *
 * Safe to re-run: documents are matched on a natural key and updated in place.
 *
 *   npm run migrate:import
 */
import 'dotenv/config'

import fs from 'fs'
import path from 'path'
import { getPayload } from 'payload'

import config from '../payload.config.js'

const payload = await getPayload({ config })

const outDir = path.resolve(process.cwd(), 'migration-export')
const contentPath = path.join(outDir, 'content.json')

if (!fs.existsSync(contentPath)) {
  throw new Error(`No export found at ${contentPath}. Run "npm run migrate:export" first.`)
}

const { media, bikes, orders, siteSettings } = JSON.parse(fs.readFileSync(contentPath, 'utf8'))

// Old numeric IDs differ from the new ones, so remap as we go.
const mediaIdMap = new Map<number, number>()

process.stdout.write(`Importing ${media.length} media files\n`)

for (const doc of media) {
  const { id: oldId, filename, alt, caption, sourcePath } = doc
  const filePath = path.join(outDir, 'files', filename)

  if (!fs.existsSync(filePath)) {
    process.stdout.write(`  ! skipping ${filename} (file missing)\n`)
    continue
  }

  const existing = sourcePath
    ? await payload.find({
        collection: 'media',
        limit: 1,
        overrideAccess: true,
        where: { sourcePath: { equals: sourcePath } },
      })
    : { docs: [] }

  if (existing.docs[0]) {
    mediaIdMap.set(oldId, existing.docs[0].id as number)
    continue
  }

  const created = await payload.create({
    collection: 'media',
    overrideAccess: true,
    filePath,
    data: { alt, caption, sourcePath },
  })

  mediaIdMap.set(oldId, created.id as number)
}

process.stdout.write(`Importing ${bikes.length} bikes\n`)

for (const bike of bikes) {
  const { id: _id, createdAt: _c, updatedAt: _u, primaryImage, gallery, ...rest } = bike

  const data = {
    ...rest,
    primaryImage: mediaIdMap.get(primaryImage) ?? undefined,
    gallery: (gallery || []).map((m: number) => mediaIdMap.get(m)).filter(Boolean),
  }

  const existing = await payload.find({
    collection: 'bikes',
    limit: 1,
    overrideAccess: true,
    where: { slug: { equals: bike.slug } },
  })

  if (existing.docs[0]) {
    await payload.update({
      collection: 'bikes',
      id: existing.docs[0].id,
      overrideAccess: true,
      data,
    })
  } else {
    await payload.create({ collection: 'bikes', overrideAccess: true, data })
  }
}

process.stdout.write(`Importing ${orders.length} orders\n`)

for (const order of orders) {
  const { id: _id, createdAt: _c, updatedAt: _u, items, ...rest } = order

  const existing = await payload.find({
    collection: 'orders',
    limit: 1,
    overrideAccess: true,
    where: { orderNumber: { equals: order.orderNumber } },
  })

  if (existing.docs[0]) continue

  await payload.create({
    collection: 'orders',
    overrideAccess: true,
    data: { ...rest, items },
  })
}

if (siteSettings) {
  const { id: _id, createdAt: _c, updatedAt: _u, homepageFeatured, ...rest } = siteSettings
  await payload.updateGlobal({
    slug: 'site-settings',
    overrideAccess: true,
    data: rest,
  })
}

process.stdout.write(
  '\nImport complete.\n' +
    'Users were NOT imported (password hashes are tied to PAYLOAD_SECRET).\n' +
    'Create the first admin at https://<your-domain>/admin.\n',
)

process.exit(0)
