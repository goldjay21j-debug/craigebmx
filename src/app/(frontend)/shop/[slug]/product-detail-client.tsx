"use client";

import { useState } from "react";
import { priceLabel, statusBadge, type Bike } from "../../../../lib/bike";

const WHATSAPP_NUMBER = "16089573848";

export function ProductDetailClient({ bike }: { bike: Bike }) {
  const [selectedImage, setSelectedImage] = useState(0);

  const orderMessage = bike.price === null
    ? `Hello Craig's Bikes. I’m interested in the ${bike.name}. Please confirm its price, availability, shipping and payment details.`
    : `Hello Craig's Bikes. I’m interested in the ${bike.name} listed at ${priceLabel(bike.price)}. Please confirm availability, shipping and payment details.`;

  return (
    <>
      <nav className="product-breadcrumbs" aria-label="Breadcrumb">
        <a href="/">Home</a><span>›</span><a href="/shop">Shop</a><span>›</span><strong>{bike.name}</strong>
      </nav>

      <section className="standalone-product">
        <div className="standalone-gallery">
          <div className="standalone-main-image">
            <img src={bike.images[selectedImage]} alt={`${bike.name}, photograph ${selectedImage + 1} of ${bike.images.length}`} />
            <span>{selectedImage + 1} / {bike.images.length}</span>
          </div>
          <div className="standalone-thumbs" aria-label="Product photographs">
            {bike.images.map((image, index) => (
              <button className={selectedImage === index ? "active" : ""} type="button" key={image} onClick={() => setSelectedImage(index)} aria-label={`Show photograph ${index + 1}`} aria-pressed={selectedImage === index}>
                <img src={image} alt="" />
              </button>
            ))}
          </div>
        </div>

        <div className="standalone-details">
          <span className={`listing-badge standalone-badge badge-${statusBadge(bike).tone}`}>{statusBadge(bike).label}</span>
          <p className="standalone-kicker">{bike.year} · {bike.brand} · {bike.style}</p>
          <h1>{bike.name}</h1>
          <div className="standalone-price"><strong>{priceLabel(bike.price)}</strong><small>{bike.price === null ? "Contact us for current pricing and availability" : "USD · shipping confirmed separately"}</small></div>
          <p className="standalone-description">{bike.description}</p>

          <div className="standalone-highlights">
            <small>Collector details</small>
            {bike.highlights.map((highlight) => <p key={highlight}><span>✓</span>{highlight}</p>)}
          </div>

          {bike.sourceUrl && (
            <div className="standalone-source">
              <span>Archive source</span>
              <a href={bike.sourceUrl} target="_blank" rel="noreferrer">{bike.sourceLabel ?? "View original profile"} ↗</a>
            </div>
          )}

          <div className="standalone-service">
            <span>↗</span>
            <p><strong>Worldwide order support</strong><small>Availability, shipping and secure payment are confirmed personally before dispatch.</small></p>
          </div>

          <a className="button button-blue standalone-order" href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(orderMessage)}`} target="_blank" rel="noreferrer">Check availability &amp; order <span>↗</span></a>
          <a className="standalone-back" href="/shop">← Back to all bikes</a>
        </div>
      </section>
    </>
  );
}
