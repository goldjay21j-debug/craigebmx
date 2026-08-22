"use client";

import { FormEvent, useEffect, useState } from "react";
import { currency, priceLabel, statusBadge, type Bike } from "../../lib/bike";

const WHATSAPP_NUMBER = "16089573848";


const heroSlides = [
  {
    image: "/history/bmx-local-race-gate-2013.jpg",
    alt: "BMX riders lined up at the Desert Downs start gate in El Paso in 2013",
    year: "Roots · late 1960s",
    tab: "California spark",
    title: "Built in dirt. Fueled by kids.",
    note: "BMX began when California riders copied motocross on backyard tracks. The gate-drop ritual still carries that original rebel energy.",
    event: "Photo · Desert Downs BMX · 2013",
    credit: "Spc. Jarred Woods / U.S. Army · Public domain",
    creditUrl: "https://commons.wikimedia.org/wiki/File:BMX_racing_opportunities_in_El_Paso_130710-A-ZA744-454.jpg",
    position: "center 44%",
  },
  {
    image: "/history/bmx-world-cup-gate-2007.jpg",
    alt: "Eight BMX racers waiting at the 2007 UCI BMX Supercross World Cup starting gate in Frejus",
    year: "World stage · 1982",
    tab: "First World Champs",
    title: "One backyard idea went global.",
    note: "The first official BMX World Championships landed in Dayton, Ohio, in 1982—just over a decade after the sport’s California spark.",
    event: "Photo · UCI BMX Supercross World Cup · Fréjus 2007",
    credit: "Fabrizio Tarizzo · CC BY-SA 2.0",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Starting_gate_2007_BMX_World_Cup.jpg",
    position: "center 52%",
  },
  {
    image: "/history/bmx-munich-mash-2018.jpg",
    alt: "A BMX freestyle rider airborne during the Munich Mash BMX Park Final in 2018",
    year: "Olympic era · 2008 → today",
    tab: "BMX goes Olympic",
    title: "Same nerve. Bigger crowd.",
    note: "BMX racing debuted at Beijing 2008, and freestyle joined at Tokyo 2020. The scene still runs on style, progression and pure stoke.",
    event: "Photo · Munich Mash BMX Park Final · 2018",
    credit: "Usien · CC BY-SA 3.0",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Munich_Mash_Festival_2018_BMX_Freestyle_0001.jpg",
    position: "center 46%",
  },
];

function whatsappLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function HomeClient({ bikes, featuredBikes }: { bikes: Bike[]; featuredBikes: Bike[] }) {
  const photoCount = bikes.reduce((total, bike) => total + bike.images.length, 0);

  // Category tiles used to index fixed positions in the static array, which
  // breaks as soon as the catalogue is edited. Pick by meaning instead.
  const pick = (match: (bike: Bike) => boolean) => bikes.find(match) ?? bikes[0];
  const freestyle = pick((bike) => bike.style === "Freestyle");
  const race = pick((bike) => bike.style === "Race");
  const gt = pick((bike) => bike.brand === "GT");
  const spotlight = featuredBikes[0] ?? bikes[0];

  const categories = [
    { label: "Freestyle", note: "Iconic street and flatland builds", image: freestyle?.images[0] },
    { label: "Race", note: "Fast, light golden-era machines", image: race?.images[0] },
    { label: "GT", note: "The unmistakable 1980s originals", image: gt?.images[0] },
    { label: "All", title: "The full collection", note: "Every bike in Craig's catalogue", image: bikes[0]?.images[0] },
  ];

  const [query, setQuery] = useState("");
  const [cart, setCart] = useState<number[]>([]);
  const [cartReady, setCartReady] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedBike, setSelectedBike] = useState<Bike | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [notice, setNotice] = useState("");
  const [heroSlide, setHeroSlide] = useState(0);
  const [heroPaused, setHeroPaused] = useState(false);

  const cartItems = bikes.filter((bike) => cart.includes(bike.id));
  const subtotal = cartItems.reduce((total, bike) => total + (bike.price ?? 0), 0);
  const hasPriceOnRequest = cartItems.some((bike) => bike.price === null);

  useEffect(() => {
    const stored = window.localStorage.getItem("craige-bike-cart");
    if (stored) {
      try {
        setCart(JSON.parse(stored));
      } catch {
        window.localStorage.removeItem("craige-bike-cart");
      }
    }
    setCartReady(true);
  }, []);

  useEffect(() => {
    if (cartReady) window.localStorage.setItem("craige-bike-cart", JSON.stringify(cart));
  }, [cart, cartReady]);

  useEffect(() => {
    if (!notice) return;
    const timeout = window.setTimeout(() => setNotice(""), 2200);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (heroPaused || reducedMotion) return;
    const interval = window.setInterval(() => {
      setHeroSlide((current) => (current + 1) % heroSlides.length);
    }, 6200);
    return () => window.clearInterval(interval);
  }, [heroPaused]);

  useEffect(() => {
    if (!drawerOpen && !selectedBike) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDrawerOpen(false);
        setSelectedBike(null);
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [drawerOpen, selectedBike]);

  useEffect(() => {
    const root = document.documentElement;
    const revealItems = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    root.classList.add("motion-ready");

    if (reducedMotion || !("IntersectionObserver" in window)) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
      return () => root.classList.remove("motion-ready");
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.13, rootMargin: "0px 0px -5% 0px" },
    );

    revealItems.forEach((item) => observer.observe(item));

    const heroImage = document.querySelector<HTMLElement>(".hero-slides");
    let frame = 0;
    const updateParallax = () => {
      frame = 0;
      heroImage?.style.setProperty("--parallax-y", `${Math.min(window.scrollY * 0.035, 22)}px`);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(updateParallax);
    };

    updateParallax();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
      root.classList.remove("motion-ready");
    };
  }, []);

  function chooseCategory(category: string) {
    window.location.href = category === "All" ? "/shop" : `/shop?style=${encodeURIComponent(category)}`;
  }

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedQuery = query.trim();
    window.location.href = normalizedQuery ? `/shop?search=${encodeURIComponent(normalizedQuery)}` : "/shop";
  }

  function openBike(bike: Bike) {
    setSelectedBike(bike);
    setSelectedImage(0);
  }

  function moveHero(direction: number) {
    setHeroSlide((current) => (current + direction + heroSlides.length) % heroSlides.length);
  }

  function addToCart(bike: Bike) {
    if (cart.includes(bike.id)) {
      setNotice(`${bike.name} is already in your cart`);
      return;
    }
    setCart((current) => [...current, bike.id]);
    setNotice(`${bike.name} added to cart`);
  }

  function removeFromCart(bike: Bike) {
    setCart((current) => current.filter((id) => id !== bike.id));
    setNotice(`${bike.name} removed`);
  }

  const orderMessage = [
    "Hello Craig's Bikes. I’d like to order the following bikes:",
    ...cartItems.map((bike) => `• ${bike.name} — ${priceLabel(bike.price)}`),
    `Subtotal: ${currency.format(subtotal)}`,
    ...(hasPriceOnRequest ? ["Please also confirm the price-on-request item(s)."] : []),
    "Please confirm availability and quote shipping to my location.",
  ].join("\n");

  return (
    <main id="top">
      <div className="page-shell">
        <header className="site-header">
          <a className="wordmark" href="#top" aria-label="Craig's Bikes home">
            <img className="brand-logo" src="/brand/craigs-bikes-wordmark-v3.png" alt="Craig's Bikes" />
          </a>

          <button className="menu-button" type="button" aria-label="Toggle navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
            <span /><span /><span />
          </button>

          <nav className={menuOpen ? "main-nav open" : "main-nav"} aria-label="Main navigation">
            <a href="/shop" onClick={() => setMenuOpen(false)}>Shop bikes</a>
            <a href="#categories" onClick={() => setMenuOpen(false)}>Categories</a>
            <a href="/history" onClick={() => setMenuOpen(false)}>BMX history</a>
            <a href="#process" onClick={() => setMenuOpen(false)}>How to buy</a>
          </nav>

          <div className="header-actions">
            <a className="support-link" href={whatsappLink("Hello Craig's Bikes. I need help choosing a BMX bike.")} target="_blank" rel="noreferrer">Support</a>
            <button className="cart-button" type="button" onClick={() => setDrawerOpen(true)} aria-label={`Open cart with ${cart.length} items`}>
              <span aria-hidden="true">▱</span>
              <strong>Cart</strong>
              <em>{cart.length}</em>
            </button>
          </div>
        </header>

        <section
          className="hero history-hero"
          onMouseEnter={() => setHeroPaused(true)}
          onMouseLeave={() => setHeroPaused(false)}
          onFocusCapture={() => setHeroPaused(true)}
          onBlurCapture={() => setHeroPaused(false)}
          aria-roledescription="carousel"
          aria-label="Old-school BMX highlights"
        >
          <div className="hero-slides" aria-live="polite">
            {heroSlides.map((slide, index) => (
              <figure className={heroSlide === index ? "hero-slide is-active" : "hero-slide"} key={slide.image} aria-hidden={heroSlide !== index}>
                <img src={slide.image} alt={heroSlide === index ? slide.alt : ""} style={{ objectPosition: slide.position }} />
              </figure>
            ))}
          </div>
          <div className="hero-shade" aria-hidden="true" />
          <div className="hero-copy" data-reveal>
            <span className="eyebrow light"><i /> For riders, collectors &amp; dreamers</span>
            <h1>Old-school BMX.<br /><em>Forever RAD.</em></h1>
            <p>We live for Tuff Wheels, sky-high bars, Day-Glo paint and the bikes that made a generation want to ride. Find your golden-era legend and keep the stoke alive.</p>
            <form className="hero-search" onSubmit={submitSearch} role="search">
              <span aria-hidden="true">⌕</span>
              <label className="sr-only" htmlFor="bike-search">Search the bike collection</label>
              <input id="bike-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search “GT Performer”" />
              <button type="submit">Search</button>
            </form>
            <div className="hero-links">
              <a className="button button-white" href="/shop">Shop the RAD collection</a>
              <a className="text-link light-link" href="/history">Meet the legends <span>→</span></a>
            </div>
            <div className="hero-milestones" aria-label="Historic BMX milestones">
              {heroSlides.map((slide, index) => (
                <button
                  type="button"
                  className={heroSlide === index ? "active" : ""}
                  key={slide.tab}
                  onClick={() => setHeroSlide(index)}
                  aria-pressed={heroSlide === index}
                >
                  <span>{index === 0 ? "Late ’60s" : index === 1 ? "1982" : "2008"}</span>
                  <small>{slide.tab}</small>
                </button>
              ))}
            </div>
          </div>

          <div className="hero-story-card" data-reveal>
            <span>{heroSlides[heroSlide].year}</span>
            <strong>{heroSlides[heroSlide].title}</strong>
            <p>{heroSlides[heroSlide].note}</p>
            <small>{heroSlides[heroSlide].event}</small>
            <a href={heroSlides[heroSlide].creditUrl} target="_blank" rel="noreferrer">{heroSlides[heroSlide].credit} ↗</a>
          </div>

          <div className="hero-controls" aria-label="Choose a hero image">
            <button type="button" onClick={() => moveHero(-1)} aria-label="Previous image">←</button>
            <div className="hero-dots">
              {heroSlides.map((slide, index) => (
                <button
                  type="button"
                  className={heroSlide === index ? "active" : ""}
                  key={slide.image}
                  onClick={() => setHeroSlide(index)}
                  aria-label={`Show slide ${index + 1}: ${slide.title}`}
                  aria-current={heroSlide === index ? "true" : undefined}
                />
              ))}
            </div>
            <span>{String(heroSlide + 1).padStart(2, "0")} / {String(heroSlides.length).padStart(2, "0")}</span>
            <button type="button" onClick={() => moveHero(1)} aria-label="Next image">→</button>
          </div>
        </section>

        <section className="trust-strip" aria-label="Shopping benefits" data-reveal>
          <div><span>✓</span><p><strong>The real-deal details</strong><small>Full galleries, specs and collector notes</small></p></div>
          <div><span>◇</span><p><strong>Golden-era rides</strong><small>80s and 90s machines with serious soul</small></p></div>
          <div><span>↗</span><p><strong>Stoke delivered worldwide</strong><small>Personal shipping confirmation</small></p></div>
        </section>

        <section className="history-preview" id="history" data-reveal>
          <div className="history-preview-image">
            <img src="/history/haro-master-neon-1986.jpg" alt="Neon green 1986 Haro Freestyle Master" />
            <span>Golden-era BMX · 1970 onward</span>
          </div>
          <div className="history-preview-copy">
            <span className="eyebrow light"><i /> Roots, rebels &amp; riders</span>
            <h2>Before it was vintage,<br /><em>it was a revolution.</em></h2>
            <p>From dirt-lot racing to freestyle’s first purpose-built machines, meet the people and moments that made BMX forever RAD.</p>
            <a className="button button-white" href="/history">Ride through BMX history <span>→</span></a>
          </div>
        </section>

        <section className="category-section" id="categories">
          <div className="section-title-row" data-reveal>
            <div><span className="eyebrow"><i /> Pick your kind of RAD</span><h2>Choose your era.<br />Find your ride.</h2></div>
            <button className="text-link" type="button" onClick={() => chooseCategory("All")}>View all bikes <span>→</span></button>
          </div>
          <div className="category-grid">
            {categories.map((category) => (
              <button className="category-card" type="button" key={category.label} onClick={() => chooseCategory(category.label)} data-reveal>
                <img src={category.image} alt="" />
                <span><strong>{category.title ?? category.label}</strong><small>{category.note}</small></span>
                <i>→</i>
              </button>
            ))}
          </div>
        </section>

        <section className="confidence-section" id="confidence">
          <div className="confidence-copy" data-reveal>
            <span className="eyebrow light"><i /> No mystery builds</span>
            <h2>The right parts.<br />The real deal.</h2>
            <p>Every Craig's Bikes listing puts the collector details up front. No digging through chat threads. No missing prices. Just the ride, its story and everything you need to know before it joins your crew.</p>
            <a className="button button-white" href="#collection">Browse the marketplace</a>
          </div>
          <div className="confidence-visual" data-reveal>
            <img src={spotlight?.images[0]} alt="1987 GT Pro Freestyle Tour in Maui Blue" />
            <div className="value-card">
              <span>Craig's collection</span>
              <h3>1987 GT Pro Freestyle Tour</h3>
              <div><small>Listed price</small><strong>{priceLabel(spotlight?.price ?? null)}</strong></div>
              <div className="value-meter"><i /><i /><i /></div>
              <p><b>Collector grade</b><span>Complete photo gallery</span></p>
            </div>
          </div>
        </section>

        <section className="marketplace-section" id="collection">
          <div className="section-title-row marketplace-title" data-reveal>
            <div><span className="eyebrow"><i /> Six stand-out builds</span><h2>Featured RAD rides.</h2><p>A curated taste of the Craig's Bikes collection.</p></div>
            <a className="button button-blue" href="/shop">View all {bikes.length} bikes <span>→</span></a>
          </div>

          <div className="product-grid">
              {featuredBikes.map((bike) => {
                const inCart = cart.includes(bike.id);
                return (
                  <article className="product-card" key={bike.id} data-reveal>
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
                      <button className={inCart ? "add-button added" : "add-button"} type="button" onClick={() => addToCart(bike)} disabled={inCart}>
                        {inCart ? "Added to cart" : "Add to cart"}
                      </button>
                    </div>
                  </article>
                );
              })}
          </div>

          <div className="featured-shop-cta" data-reveal>
            <p><strong>Want the complete line-up?</strong><span>The remaining {bikes.length - featuredBikes.length} collector bikes live in the full shop.</span></p>
            <a className="button button-blue" href="/shop">Explore the full shop <span>→</span></a>
          </div>
        </section>

        <section className="process-section" id="process">
          <div className="process-heading" data-reveal><span className="eyebrow light"><i /> Simple and personal</span><h2>A better way to<br />buy a legend.</h2><p>Buying a collectible bike should feel considered, clear and exciting from the first photo to delivery day.</p></div>
          <div className="process-steps" data-reveal>
            <article><span>01</span><div><h3>Browse and compare</h3><p>Search the full collection, explore every gallery and review the important details.</p></div></article>
            <article><span>02</span><div><h3>Build your order</h3><p>Add your favourites to the cart and see a clear itemised subtotal.</p></div></article>
            <article><span>03</span><div><h3>Confirm with us</h3><p>Send your order for availability, shipping and secure payment arrangements.</p></div></article>
          </div>
        </section>

        <section className="service-section" data-reveal>
          <div><span className="eyebrow"><i /> Personal service</span><h2>Talk to a real collector.</h2><p>Tell us what you collect, what you used to ride, or which details you want checked. We’ll help you choose with confidence.</p></div>
          <a className="button button-blue" href={whatsappLink("Hello Craig's Bikes. I have a question about a bike on the website.")} target="_blank" rel="noreferrer">Chat with Craig's Bikes <span>↗</span></a>
        </section>

        <footer>
          <div className="footer-top">
            <a className="wordmark footer-brand" href="#top" aria-label="Craig's Bikes home"><img className="brand-logo" src="/brand/craigs-bikes-wordmark-v3.png" alt="Craig's Bikes" /></a>
            <p>The independent marketplace for original old-school BMX bikes.</p>
            <a className="button button-white" href="/shop">Shop all bikes</a>
          </div>
          <div className="footer-links">
            <nav aria-label="Footer marketplace links"><strong>Marketplace</strong><a href="/shop">All bikes</a><a href="/shop?style=Freestyle">Freestyle</a><a href="/shop?style=Race">Race</a></nav>
            <nav aria-label="Footer information links"><strong>Information</strong><a href="/history">BMX history</a><a href="#confidence">Our standards</a><a href="#process">How to buy</a><a href={whatsappLink("Hello Craig's Bikes. I need support.")} target="_blank" rel="noreferrer">Contact support</a></nav>
            <div><strong>Catalogued with care</strong><p>{bikes.length} classic bikes<br />{photoCount} catalogue photographs<br />Worldwide order support</p></div>
          </div>
          <div className="footer-bottom"><span>© {new Date().getFullYear()} Craig's Bikes</span><span>Old-school BMX · Built for collectors</span></div>
        </footer>
      </div>

      <a className="whatsapp-float" href={whatsappLink("Hello Craig's Bikes. I have a question about a bike on the website.")} target="_blank" rel="noreferrer" aria-label="Contact Craig's Bikes on WhatsApp"><span>W</span><strong>Bike support</strong></a>

      {selectedBike && (
        <div className="product-shell" role="dialog" aria-modal="true" aria-labelledby="product-title">
          <button className="product-backdrop" type="button" aria-label="Close product details" onClick={() => setSelectedBike(null)} />
          <section className="product-dialog">
            <button className="dialog-close" type="button" aria-label="Close product details" onClick={() => setSelectedBike(null)}>×</button>
            <div className="gallery">
              <div className="gallery-main"><img src={selectedBike.images[selectedImage]} alt={`${selectedBike.name}, view ${selectedImage + 1}`} /></div>
              <div className="gallery-thumbs" aria-label="Product photographs">
                {selectedBike.images.map((image, index) => (
                  <button key={image} className={selectedImage === index ? "active" : ""} type="button" onClick={() => setSelectedImage(index)} aria-label={`View photograph ${index + 1}`}><img src={image} alt="" /></button>
                ))}
              </div>
            </div>
            <div className="product-details">
              <span className="listing-badge dialog-badge">Collector grade</span>
              <p className="dialog-kicker">{selectedBike.year} · {selectedBike.brand} · {selectedBike.style}</p>
              <h2 id="product-title">{selectedBike.name}</h2>
              <strong className="dialog-price">{priceLabel(selectedBike.price)} {selectedBike.price !== null && <small>USD</small>}</strong>
              <p className="dialog-description">{selectedBike.description}</p>
              <div className="spec-list">
                {selectedBike.highlights.map((highlight) => <div key={highlight}><span>✓</span><p>{highlight}</p></div>)}
              </div>
              <div className="shipping-note"><span>↗</span><p><strong>Worldwide order support</strong><small>Shipping is confirmed personally for your location.</small></p></div>
              <button className="button button-blue detail-cart" type="button" onClick={() => addToCart(selectedBike)} disabled={cart.includes(selectedBike.id)}>
                {cart.includes(selectedBike.id) ? "Already in cart" : `Add to cart · ${priceLabel(selectedBike.price)}`}
              </button>
            </div>
          </section>
        </div>
      )}

      {drawerOpen && (
        <div className="drawer-shell" role="dialog" aria-modal="true" aria-labelledby="cart-title">
          <button className="drawer-backdrop" type="button" aria-label="Close cart" onClick={() => setDrawerOpen(false)} />
          <aside className="drawer">
            <div className="drawer-head"><div><span className="eyebrow"><i /> Your order</span><h2 id="cart-title">Cart ({cart.length})</h2></div><button type="button" onClick={() => setDrawerOpen(false)} aria-label="Close cart">×</button></div>
            {cartItems.length ? <>
              <div className="drawer-items">{cartItems.map((bike) => <div className="drawer-item" key={bike.id}><img src={bike.images[0]} alt="" /><div><span>{bike.year} · {bike.brand}</span><strong>{bike.name}</strong><em>{priceLabel(bike.price)}</em></div><button type="button" onClick={() => removeFromCart(bike)} aria-label={`Remove ${bike.name}`}>×</button></div>)}</div>
              <div className="cart-total"><span>Subtotal{hasPriceOnRequest && <small> + price on request</small>}</span><strong>{currency.format(subtotal)} <small>USD</small></strong></div>
              <a className="button button-blue drawer-action" href={whatsappLink(orderMessage)} target="_blank" rel="noreferrer">Continue to order review</a>
              <p className="drawer-note">Final availability, shipping and payment are confirmed before dispatch.</p>
            </> : <div className="empty-cart"><span>▱</span><h3>Your cart is empty</h3><p>Add a classic bike to begin your order.</p><button type="button" onClick={() => setDrawerOpen(false)}>Browse the collection</button></div>}
          </aside>
        </div>
      )}

      <div className={notice ? "toast show" : "toast"} aria-live="polite">{notice}</div>
    </main>
  );
}
