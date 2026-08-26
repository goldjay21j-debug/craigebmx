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

type MediaLike = { filename?: null | string; url?: null | string; sourcePath?: null | string }

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


/**
 * Public base URL of the media bucket, derived from the S3 endpoint so there is
 * no second variable to keep in sync.
 *   https://<ref>.supabase.co/storage/v1/s3
 *   -> https://<ref>.supabase.co/storage/v1/object/public/<bucket>
 */
const publicMediaBase = (() => {
  const endpoint = process.env.S3_ENDPOINT
  const bucket = process.env.S3_BUCKET
  if (!endpoint || !bucket) return null
  const base = endpoint.replace(/\/+$/, '')
  const suffix = '/storage/v1/s3'
  const root = base.endsWith(suffix) ? base.slice(0, -suffix.length) : base
  return `${root}/storage/v1/object/public/${bucket}`
})()

const resolveImage = (media: unknown): null | string => {
  if (!media || typeof media !== 'object') return null
  const doc = media as MediaLike

  // Serve straight from the bucket's CDN. Payload's own /api/media/file route
  // boots Payload and takes a database connection *per image*, so a page with
  // seventeen photographs opened seventeen connections and blew past
  // Supabase's 15-client limit -- every image then failed with a 500.
  if (publicMediaBase && doc.filename) {
    return `${publicMediaBase}/${encodeURIComponent(doc.filename)}`
  }

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
  try {
    // A starved connection pool does not reject -- it waits. That is what made
    // a build hang for seven minutes instead of failing, and it was
    // self-inflicted: the running deployment held every connection, so the
    // build meant to fix that could never finish and replace it. A deadline
    // turns the hang into an empty render, and the pages fill in on the next
    // request once connections are free again.
    return await withDeadline(readBikes(), 20_000)
  } catch (error) {
    console.error('catalogue unavailable, rendering empty:', (error as Error).message)
    return []
  }
})

function withDeadline<T>(work: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`timed out after ${ms}ms`)), ms)
    work.then(
      (value) => { clearTimeout(timer); resolve(value) },
      (error) => { clearTimeout(timer); reject(error) },
    )
  })
}

async function readBikes(): Promise<Bike[]> {
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
}

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
