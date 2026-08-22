/**
 * Reads the catalogue from Payload for the storefront.
 *
 * Uses Payload's local API, which runs in-process rather than over HTTP. That
 * is only possible because the shop and the admin are now one app -- there is
 * no fetch, no base URL and no API key to get wrong.
 *
 * Server components only.
 */
import config from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'

import type { Bike } from './bike'

type MediaLike = { url?: null | string; sourcePath?: null | string }

/**
 * Payload returns an absolute URL built from serverURL, which is wrong whenever
 * that env var is unset or stale. Reduce it to a path so the browser resolves
 * it against whatever host is actually serving the page.
 */
const toPath = (value: string) => {
  try {
    return new URL(value).pathname
  } catch {
    return value
  }
}


const resolveImage = (media: unknown): null | string => {
  if (!media || typeof media !== 'object') return null
  const doc = media as MediaLike
  if (doc.url) return toPath(doc.url)
  // Photographs imported from the original storefront still sit in /public.
  if (doc.sourcePath) return doc.sourcePath
  return null
}

const toBike = (doc: Record<string, any>): Bike => {
  const gallery: string[] = [doc.primaryImage, ...(doc.gallery ?? [])]
    .map(resolveImage)
    .filter((value): value is string => Boolean(value))

  return {
    id: doc.legacyId ?? doc.id,
    slug: doc.slug,
    name: doc.name,
    year: doc.year,
    brand: doc.brand,
    style: doc.style,
    // "Price on request" is an absent price, not a zero one.
    price: doc.status === 'price-on-request' ? null : (doc.price ?? null),
    description: doc.description,
    highlights: (doc.highlights ?? [])
      .map((h: { text?: string }) => h?.text)
      .filter((text: unknown): text is string => Boolean(text)),
    // De-duplicate: the primary image is usually also the first gallery entry.
    images: Array.from(new Set(gallery)),
    sourceLabel: doc.sourceLabel ?? undefined,
    sourceUrl: doc.sourceUrl ?? undefined,
    featured: Boolean(doc.featured),
    featuredOrder: doc.featuredOrder ?? null,
    status: doc.status,
  }
}

/**
 * Every bike a visitor may see. "Hidden draft" listings are excluded.
 *
 * Wrapped in React's cache so a page rendering the shop, the footer counts and
 * a product's related items all share one query rather than three.
 */
export const getBikes = cache(async function getBikes(): Promise<Bike[]> {
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'bikes',
    depth: 1,
    limit: 0,
    pagination: false,
    overrideAccess: true,
    sort: 'legacyId',
    where: { status: { not_equals: 'draft' } },
  })

  return docs.map(toBike)
})

/** Derived from the cached catalogue, so viewing a bike costs no extra query. */
export async function getBike(slug: string): Promise<Bike | null> {
  const bikes = await getBikes()
  return bikes.find((bike) => bike.slug === slug) ?? null
}

/** Bikes flagged Featured in the admin, in their chosen homepage order. */
export function selectFeatured(bikes: Bike[], count = 6): Bike[] {
  const flagged = bikes
    .filter((bike) => bike.featured)
    .sort((a, b) => (a.featuredOrder ?? 99) - (b.featuredOrder ?? 99))

  // Never render an empty homepage just because nobody ticked the box.
  return (flagged.length ? flagged : bikes).slice(0, count)
}
