"use client";

import { useEffect, useMemo, useState } from "react";

const CATALOG_URL = "https://wa.me/c/16089573848";
const WHATSAPP_NUMBER = "16089573848";

type Bike = {
  id: number;
  name: string;
  era: "80s" | "90s";
  style: "Freestyle" | "Street" | "Race";
  image: string;
  note: string;
  tone: string;
};

const bikes: Bike[] = [
  {
    id: 1,
    name: "Neon Freestyle ’86",
    era: "80s",
    style: "Freestyle",
    image: "/images/haro-green.jpg",
    note: "Mag wheels · full pad set · restored",
    tone: "lime",
  },
  {
    id: 2,
    name: "Chrome Sunset ’88",
    era: "80s",
    style: "Race",
    image: "/images/bmx-black.jpg",
    note: "Chrome finish · 20-inch wheels · race stance",
    tone: "sunset",
  },
  {
    id: 3,
    name: "Brick Lane ’94",
    era: "90s",
    style: "Street",
    image: "/images/bmx-street.jpg",
    note: "Tough frame · street tyres · compact geometry",
    tone: "red",
  },
  {
    id: 4,
    name: "Mag Wheel Master ’89",
    era: "80s",
    style: "Freestyle",
    image: "/images/haro-master.jpg",
    note: "Period details · rotor ready · collector feel",
    tone: "blue",
  },
  {
    id: 5,
    name: "Parkline Pro ’93",
    era: "90s",
    style: "Freestyle",
    image: "/images/hero-bmx.jpg",
    note: "Low profile · responsive front end · park setup",
    tone: "ink",
  },
  {
    id: 6,
    name: "Boardwalk Twenty ’90",
    era: "90s",
    style: "Street",
    image: "/images/bmx-black.jpg",
    note: "Classic silhouette · everyday ride · clean build",
    tone: "cream",
  },
];

const filters = ["All", "80s", "90s", "Freestyle", "Street", "Race"];

function whatsappLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export default function Home() {
  const [filter, setFilter] = useState("All");
  const [saved, setSaved] = useState<number[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notice, setNotice] = useState("");

  const shownBikes = useMemo(
    () =>
      filter === "All"
        ? bikes
        : bikes.filter((bike) => bike.era === filter || bike.style === filter),
    [filter],
  );

  const savedBikes = bikes.filter((bike) => saved.includes(bike.id));

  useEffect(() => {
    if (!notice) return;
    const timeout = window.setTimeout(() => setNotice(""), 2200);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  function toggleSaved(bike: Bike) {
    const isSaved = saved.includes(bike.id);
    setSaved((current) =>
      isSaved ? current.filter((id) => id !== bike.id) : [...current, bike.id],
    );
    setNotice(isSaved ? `${bike.name} removed` : `${bike.name} added to your ride list`);
  }

  const listMessage = `Hi Craige Bikes! I’m interested in: ${savedBikes
    .map((bike) => bike.name)
    .join(", ")}. Could you confirm current stock, condition and price?`;

  return (
    <main>
      <div className="announcement">
        <span>Fresh finds added weekly</span>
        <span aria-hidden="true">★</span>
        <span>Worldwide enquiries welcome</span>
        <span aria-hidden="true">★</span>
        <span>Live stock on WhatsApp</span>
      </div>

      <header className="site-header">
        <a className="brand" href="#top" aria-label="Craige Bikes home">
          <span className="brand-mark">CB</span>
          <span>
            <strong>CRAIGE BIKES</strong>
            <small>80s / 90s BMX specialists</small>
          </span>
        </a>

        <button
          className="menu-button"
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((current) => !current)}
        >
          <span />
          <span />
        </button>

        <nav className={menuOpen ? "main-nav open" : "main-nav"} aria-label="Main navigation">
          <a href="#bikes" onClick={() => setMenuOpen(false)}>Bikes</a>
          <a href="#how-it-works" onClick={() => setMenuOpen(false)}>How it works</a>
          <a href="#story" onClick={() => setMenuOpen(false)}>Our story</a>
          <a href="#faq" onClick={() => setMenuOpen(false)}>FAQ</a>
        </nav>

        <button className="ride-list-button" type="button" onClick={() => setDrawerOpen(true)}>
          Ride list <span>{saved.length}</span>
        </button>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow"><span>Since the golden era</span> / rebuilt for now</p>
          <h1>
            Old school soul.
            <em>Built to ride.</em>
          </h1>
          <p className="hero-intro">
            Iconic BMX energy from the 80s and 90s—curated for collectors,
            weekend riders and anyone who still remembers the sound of mag wheels on concrete.
          </p>
          <div className="hero-actions">
            <a className="button button-dark" href="#bikes">Find your bike <span>↘</span></a>
            <a className="text-link" href={CATALOG_URL} target="_blank" rel="noreferrer">
              Open live catalog <span>↗</span>
            </a>
          </div>
          <div className="hero-proof">
            <div className="avatar-stack" aria-hidden="true">
              <span>CK</span><span>RB</span><span>MT</span>
            </div>
            <p><strong>Rider-approved finds</strong><br />Real people. Real BMX nostalgia.</p>
          </div>
        </div>

        <div className="hero-visual">
          <img src="/images/hero-bmx.jpg" alt="BMX rider on a blue bike with red tyres" />
          <div className="hero-sticker sticker-top">20″<small>pure fun</small></div>
          <div className="hero-sticker sticker-bottom">NO<br />BRAKES<br />ON STYLE</div>
          <div className="photo-caption">Archive energy / modern service</div>
        </div>
      </section>

      <div className="marquee" aria-label="Craige Bikes highlights">
        <div>
          <span>Restored legends</span><i>✦</i><span>90s street heat</span><i>✦</i>
          <span>Collector-ready</span><i>✦</i><span>Worldwide enquiries</span><i>✦</i>
          <span>Restored legends</span><i>✦</i><span>90s street heat</span><i>✦</i>
        </div>
      </div>

      <section className="shop-section" id="bikes">
        <div className="section-heading">
          <div>
            <p className="eyebrow"><span>Current picks</span> / from the catalog</p>
            <h2>Choose your era.</h2>
          </div>
          <p>
            Save the bikes you like, then send your ride list to us on WhatsApp for live stock,
            exact condition and pricing.
          </p>
        </div>

        <div className="filters" role="group" aria-label="Filter bikes">
          {filters.map((item) => (
            <button
              type="button"
              key={item}
              className={filter === item ? "active" : ""}
              aria-pressed={filter === item}
              onClick={() => setFilter(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="product-grid">
          {shownBikes.map((bike, index) => {
            const isSaved = saved.includes(bike.id);
            return (
              <article className={`product-card tone-${bike.tone}`} key={bike.id}>
                <div className="product-image-wrap">
                  <img src={bike.image} alt={`${bike.name} BMX bike`} />
                  <span className="era-badge">{bike.era}</span>
                  <button
                    type="button"
                    className={isSaved ? "save-button saved" : "save-button"}
                    onClick={() => toggleSaved(bike)}
                    aria-label={`${isSaved ? "Remove" : "Save"} ${bike.name}`}
                    aria-pressed={isSaved}
                  >
                    {isSaved ? "♥" : "♡"}
                  </button>
                  {index === 0 && <span className="new-stamp">TOP PICK</span>}
                </div>
                <div className="product-info">
                  <div className="product-meta"><span>{bike.style}</span><span>20-inch</span></div>
                  <h3>{bike.name}</h3>
                  <p>{bike.note}</p>
                  <div className="product-buy-row">
                    <span className="live-price"><i /> Live price</span>
                    <a
                      href={whatsappLink(`Hi Craige Bikes! I’m interested in the ${bike.name}. Is it currently available? Please share the condition and price.`)}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Ask about ${bike.name} on WhatsApp`}
                    >
                      Ask about it <span>↗</span>
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="catalog-cta">
          <div>
            <span className="catalog-kicker">The stock changes fast</span>
            <h3>See every bike available right now.</h3>
          </div>
          <a className="button button-yellow" href={CATALOG_URL} target="_blank" rel="noreferrer">
            Browse WhatsApp catalog <span>↗</span>
          </a>
        </div>
      </section>

      <section className="steps-section" id="how-it-works">
        <div className="steps-title">
          <p className="eyebrow"><span>Simple & human</span> / no mystery boxes</p>
          <h2>Three steps.<br />Then you ride.</h2>
        </div>
        <div className="steps-grid">
          <article>
            <span>01</span><div className="step-icon">⌕</div>
            <h3>Pick your favorite</h3>
            <p>Browse the collection here or open the live WhatsApp catalog for the newest arrivals.</p>
          </article>
          <article>
            <span>02</span><div className="step-icon">✉</div>
            <h3>Chat with Craige</h3>
            <p>Ask for close-ups, condition notes, sizing help and a confirmed price before you commit.</p>
          </article>
          <article>
            <span>03</span><div className="step-icon">➜</div>
            <h3>Pay & ship</h3>
            <p>Agree the details securely in WhatsApp, then we pack your bike carefully and get it moving.</p>
          </article>
        </div>
      </section>

      <section className="story-section" id="story">
        <div className="story-image">
          <img src="/images/haro-green.jpg" alt="Neon green old school freestyle BMX bike" />
          <span className="story-year">1986</span>
          <span className="story-scribble">ride loud!</span>
        </div>
        <div className="story-copy">
          <p className="eyebrow"><span>Why Craige Bikes</span> / built on obsession</p>
          <h2>We never grew out of BMX.</h2>
          <p className="story-lead">
            Craige Bikes is for riders who know a bicycle can be a time machine. We chase the colors,
            shapes and attitude that made the 80s and 90s unforgettable.
          </p>
          <div className="story-points">
            <div><strong>Curated, never random</strong><p>Every bike is picked for character, rideability and that unmistakable old-school silhouette.</p></div>
            <div><strong>Details before deals</strong><p>We share honest condition notes and current photos so you know what you’re getting.</p></div>
          </div>
          <a className="text-link" href={whatsappLink("Hi Craige Bikes! I’d like help finding the right old-school BMX for me.")} target="_blank" rel="noreferrer">
            Talk bikes with us <span>↗</span>
          </a>
        </div>
      </section>

      <section className="manifesto">
        <p>Chrome. Mags. Pad sets. Pegs.</p>
        <h2>Some things never go out of style.</h2>
        <a href="#bikes">Shop the old school <span>↓</span></a>
      </section>

      <section className="faq-section" id="faq">
        <div>
          <p className="eyebrow"><span>Need to know</span> / before you roll</p>
          <h2>Questions,<br />answered.</h2>
        </div>
        <div className="faq-list">
          <details>
            <summary>Are the bikes on this page in stock?<span>+</span></summary>
            <p>Availability moves quickly. The WhatsApp catalog is the live source, and we confirm stock, condition and price in chat before purchase.</p>
          </details>
          <details>
            <summary>Can I ask for more photos?<span>+</span></summary>
            <p>Absolutely. Send us the bike name or a catalog screenshot and we’ll share the details you need.</p>
          </details>
          <details>
            <summary>Do you ship bikes?<span>+</span></summary>
            <p>Shipping options depend on your location and the bike. Message us with your city and country for a current quote.</p>
          </details>
          <details>
            <summary>How do I pay?<span>+</span></summary>
            <p>Payment instructions are confirmed directly with Craige Bikes after stock, condition, shipping and the final total are agreed.</p>
          </details>
        </div>
      </section>

      <footer>
        <div className="footer-cta">
          <p>Your next favorite bike is probably waiting.</p>
          <h2>Ready to roll it back?</h2>
          <a className="button button-yellow" href={CATALOG_URL} target="_blank" rel="noreferrer">
            Open the live catalog <span>↗</span>
          </a>
        </div>
        <div className="footer-bottom">
          <a className="brand footer-brand" href="#top">
            <span className="brand-mark">CB</span>
            <span><strong>CRAIGE BIKES</strong><small>80s / 90s BMX specialists</small></span>
          </a>
          <div className="footer-links">
            <a href="#bikes">Bikes</a><a href="#story">Our story</a><a href="#faq">FAQ</a>
            <a href={CATALOG_URL} target="_blank" rel="noreferrer">WhatsApp</a>
          </div>
          <p>© {new Date().getFullYear()} Craige Bikes.<br />Keep it old school.</p>
        </div>
        <p className="photo-credit">Archive imagery used for collection previews. Live product photos, stock and pricing are available in the WhatsApp catalog.</p>
      </footer>

      <a
        className="whatsapp-float"
        href={whatsappLink("Hi Craige Bikes! I’m looking for an old-school BMX.")}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat with Craige Bikes on WhatsApp"
      >
        <span>WA</span><strong>Chat with Craige</strong>
      </a>

      {drawerOpen && (
        <div className="drawer-shell" role="dialog" aria-modal="true" aria-labelledby="ride-list-title">
          <button className="drawer-backdrop" type="button" aria-label="Close ride list" onClick={() => setDrawerOpen(false)} />
          <aside className="drawer">
            <div className="drawer-head">
              <div><p className="eyebrow">Your shortlist</p><h2 id="ride-list-title">Ride list ({saved.length})</h2></div>
              <button type="button" onClick={() => setDrawerOpen(false)} aria-label="Close ride list">×</button>
            </div>
            {savedBikes.length ? (
              <>
                <div className="drawer-items">
                  {savedBikes.map((bike) => (
                    <div className="drawer-item" key={bike.id}>
                      <img src={bike.image} alt="" />
                      <div><span>{bike.era} / {bike.style}</span><strong>{bike.name}</strong></div>
                      <button type="button" onClick={() => toggleSaved(bike)} aria-label={`Remove ${bike.name}`}>×</button>
                    </div>
                  ))}
                </div>
                <a className="button button-yellow drawer-action" href={whatsappLink(listMessage)} target="_blank" rel="noreferrer">
                  Send list on WhatsApp <span>↗</span>
                </a>
                <p className="drawer-note">We’ll reply with live availability, condition and pricing.</p>
              </>
            ) : (
              <div className="empty-list">
                <span>♡</span><h3>Your ride list is empty.</h3>
                <p>Save a few bikes and we’ll help you compare them on WhatsApp.</p>
                <button type="button" onClick={() => setDrawerOpen(false)}>Browse bikes</button>
              </div>
            )}
          </aside>
        </div>
      )}

      <div className={notice ? "toast show" : "toast"} aria-live="polite">{notice}</div>
    </main>
  );
}
