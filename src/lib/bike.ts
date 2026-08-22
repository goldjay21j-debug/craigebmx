/**
 * The shape the storefront renders, and the formatting helpers that go with it.
 * Deliberately free of server imports so client components can use it too.
 */
export type Bike = {
  id: number
  slug: string
  name: string
  year: number
  brand: string
  style: string
  price: number | null
  description: string
  highlights: string[]
  images: string[]
  sourceLabel?: string
  sourceUrl?: string
  featured: boolean
  featuredOrder: number | null
  status: string
}

export const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

export function priceLabel(price: number | null) {
  return price === null ? 'Price on request' : currency.format(price)
}

/**
 * What the corner badge on a listing should say.
 *
 * Sold and reserved bikes stay in the catalogue deliberately -- the back
 * catalogue is part of the shop's credibility -- so the badge has to carry the
 * availability, not the listing's absence.
 */
export function statusBadge(bike: Bike): { label: string; tone: 'sold' | 'reserved' | 'normal' } {
  if (bike.status === 'sold') return { label: 'Sold', tone: 'sold' }
  if (bike.status === 'reserved') return { label: 'Reserved', tone: 'reserved' }
  if (bike.featured) return { label: 'Featured', tone: 'normal' }
  return { label: 'Collector grade', tone: 'normal' }
}
