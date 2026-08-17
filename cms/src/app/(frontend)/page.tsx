import './styles.css'

export default function HomePage() {
  return (
    <main className="admin-gateway">
      <section className="gateway-card">
        <img src="/craigs-bikes-wordmark.png" alt="Craig's Bikes" />
        <span>Payload CMS</span>
        <h1>The control room for every RAD ride.</h1>
        <p>Manage the complete BMX catalogue, pricing, product photography, availability and customer orders.</p>
        <div className="gateway-actions">
          <a className="primary" href="/admin">Open admin dashboard</a>
          <a href={process.env.STOREFRONT_URL || 'https://craige-bikes.g4rp5kk5m9.chatgpt.site'}>View storefront</a>
        </div>
      </section>
    </main>
  )
}
