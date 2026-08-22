import 'dotenv/config'

import fs from 'fs'
import path from 'path'
import { getPayload } from 'payload'

import { bikes } from '../app/(frontend)/products'
import config from '../payload.config'

const payload = await getPayload({ config })
const storefrontRoot = path.resolve(process.cwd(), '..')

for (const bike of bikes) {
  const mediaIDs: number[] = []

  for (const [index, sourcePath] of bike.images.entries()) {
    const existingMedia = await payload.find({
      collection: 'media',
      limit: 1,
      overrideAccess: true,
      where: { sourcePath: { equals: sourcePath } },
    })

    if (existingMedia.docs[0]) {
      mediaIDs.push(existingMedia.docs[0].id)
      continue
    }

    const filePath = path.join(storefrontRoot, 'public', sourcePath.replace(/^\//, ''))
    if (!fs.existsSync(filePath)) throw new Error(`Missing catalogue image: ${filePath}`)

    const media = await payload.create({
      collection: 'media',
      overrideAccess: true,
      filePath,
      data: {
        alt: `${bike.name} — photograph ${index + 1}`,
        sourcePath,
      },
    })
    mediaIDs.push(media.id)
  }

  const data = {
    legacyId: bike.id,
    name: bike.name,
    slug: bike.slug,
    year: bike.year,
    brand: bike.brand,
    style: bike.style,
    price: bike.price ?? undefined,
    status: (bike.price === null ? 'price-on-request' : 'available') as
      | 'price-on-request'
      | 'available',
    condition: (bike.year >= 2000 ? 'reissue' : 'collector-build') as
      | 'reissue'
      | 'collector-build',
    description: bike.description,
    highlights: bike.highlights.map((text: string) => ({ text })),
    primaryImage: mediaIDs[0],
    gallery: mediaIDs,
    featured: bike.id <= 6,
    featuredOrder: bike.id <= 6 ? bike.id : undefined,
    sourceLabel: bike.sourceLabel,
    sourceUrl: bike.sourceUrl,
    _status: 'published' as const,
  }

  const existingBike = await payload.find({
    collection: 'bikes',
    limit: 1,
    overrideAccess: true,
    where: { slug: { equals: bike.slug } },
  })

  if (existingBike.docs[0]) {
    await payload.update({
      collection: 'bikes',
      id: existingBike.docs[0].id,
      overrideAccess: true,
      data,
    })
  } else {
    await payload.create({
      collection: 'bikes',
      overrideAccess: true,
      data,
    })
  }

  process.stdout.write(`Seeded ${bike.id}/${bikes.length}: ${bike.name}\n`)
}

await payload.updateGlobal({
  slug: 'site-settings',
  overrideAccess: true,
  data: {
    storeName: "Craig's Bikes",
    whatsappNumber: '16089573848',
    currency: 'USD',
    announcement: 'Worldwide shipping available on collector BMX bikes.',
    shippingNote: 'Shipping quotes are confirmed through WhatsApp before payment.',
  },
})

process.stdout.write('Craig’s Bikes catalogue seed complete.\n')
process.exit(0)
