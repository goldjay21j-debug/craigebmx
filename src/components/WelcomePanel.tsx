import type { Payload } from 'payload'

export default async function WelcomePanel({ payload }: { payload: Payload }) {
  const [bikes, available, orders] = await Promise.all([
    payload.count({ collection: 'bikes', overrideAccess: true }),
    payload.count({
      collection: 'bikes',
      overrideAccess: true,
      where: { status: { equals: 'available' } },
    }),
    payload.count({ collection: 'orders', overrideAccess: true }),
  ])

  return (
    <section className="craigs-dashboard-hero">
      <div>
        <span className="craigs-dashboard-kicker">Craig’s Bikes control room</span>
        <h1>Keep the RAD inventory rolling.</h1>
        <p>Manage the catalogue, product photography, featured rides and customer orders from one secure dashboard.</p>
      </div>
      <div className="craigs-dashboard-stats" aria-label="Store summary">
        <div><strong>{bikes.totalDocs}</strong><span>Total bikes</span></div>
        <div><strong>{available.totalDocs}</strong><span>Available</span></div>
        <div><strong>{orders.totalDocs}</strong><span>Orders</span></div>
      </div>
    </section>
  )
}
