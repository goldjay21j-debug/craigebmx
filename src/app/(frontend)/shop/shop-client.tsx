"use client";

import { useEffect, useMemo, useState } from "react";
import { priceLabel, statusBadge, type Bike } from "../../../lib/bike";



export function ShopClient({ bikes }: { bikes: Bike[] }) {
  // Brands come from the catalogue, so a new brand becomes a filter as soon as
  // a bike using it is published.
  const filters = ["All", "Freestyle", "Race", ...Array.from(new Set(bikes.map((bike) => bike.brand)))];
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestedStyle = params.get("style");
    const requestedSearch = params.get("search");
    if (requestedStyle && filters.includes(requestedStyle)) setFilter(requestedStyle);
    if (requestedSearch) setQuery(requestedSearch);
  }, []);

  const shownBikes = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return bikes.filter((bike) => {
      const matchesFilter = filter === "All" || bike.style === filter || bike.brand === filter;
      const haystack = `${bike.name} ${bike.year} ${bike.brand} ${bike.style}`.toLowerCase();
      return matchesFilter && (!normalizedQuery || haystack.includes(normalizedQuery));
    });
  }, [filter, query]);

  return (
    <>
      <section className="shop-hero">
        <div>
          <span className="eyebrow light"><i /> The complete line-up</span>
          <h1>Find your<br /><em>RAD ride.</em></h1>
          <p>Original race machines, freestyle icons and the colourways that still stop collectors in their tracks.</p>
        </div>
        <aside>
          <span>Craig's collection</span>
          <strong>{bikes.length} golden-era bikes</strong>
          <small>Each with its own gallery, history and collector details.</small>
        </aside>
      </section>

      <section className="shop-catalogue" aria-labelledby="shop-title">
        <div className="shop-toolbar">
          <div>
            <span className="eyebrow"><i /> Ready to roll</span>
            <h2 id="shop-title">The collection.</h2>
            <p>{shownBikes.length} {shownBikes.length === 1 ? "bike" : "bikes"} matching your selection</p>
          </div>
          <label className="shop-search">
            <span aria-hidden="true">⌕</span>
            <span className="sr-only">Search the shop</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search bikes" />
          </label>
        </div>

        <div className="filter-row shop-filters" role="group" aria-label="Filter bicycles">
          {filters.map((item) => (
            <button key={item} type="button" className={filter === item ? "active" : ""} aria-pressed={filter === item} onClick={() => setFilter(item)}>{item}</button>
          ))}
        </div>

        {shownBikes.length ? (
          <div className="product-grid shop-product-grid">
            {shownBikes.map((bike, index) => (
              <article className="product-card" key={bike.id}>
                <a className="product-image" href={`/shop/${bike.slug}`} aria-label={`View ${bike.name}`}>
                  <img src={bike.images[0]} alt={`${bike.name} BMX bicycle`} />
                  <span className={`listing-badge badge-${statusBadge(bike).tone}`}>{statusBadge(bike).label}</span>
                  <span className="photo-count">{bike.images.length} photos</span>
                </a>
                <div className="product-info">
                  <div className="product-kicker"><span>{bike.year} · {bike.style}</span><a href={`/shop/${bike.slug}`} aria-label={`View ${bike.name}`}>＋</a></div>
                  <h3><a href={`/shop/${bike.slug}`}>{bike.name}</a></h3>
                  <p>{bike.brand} · 20-inch BMX · Excellent collector condition</p>
                  <div className="product-price"><strong>{priceLabel(bike.price)}</strong>{bike.price !== null && <small>USD</small>}</div>
                  <a className="add-button shop-view-button" href={`/shop/${bike.slug}`}>View bike &amp; gallery</a>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-results"><span>⌕</span><h3>No bikes found</h3><p>Try a different name, brand or category.</p><button type="button" onClick={() => { setQuery(""); setFilter("All"); }}>Clear search</button></div>
        )}
      </section>
    </>
  );
}
