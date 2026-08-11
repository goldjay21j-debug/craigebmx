"use client";

import { useState } from "react";

const WHATSAPP_NUMBER = "16089573848";

export function StoreHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header store-header">
      <a className="wordmark" href="/" aria-label="Craig's Bikes home">
        <img className="brand-logo" src="/brand/craigs-bikes-wordmark-v3.png" alt="Craig's Bikes" />
      </a>

      <button
        className="menu-button"
        type="button"
        onClick={() => setMenuOpen((current) => !current)}
        aria-label="Toggle navigation"
        aria-expanded={menuOpen}
      >
        <span /><span />
      </button>

      <nav className={menuOpen ? "main-nav open" : "main-nav"} aria-label="Main navigation">
        <a href="/shop" onClick={() => setMenuOpen(false)}>Shop</a>
        <a href="/#categories" onClick={() => setMenuOpen(false)}>Categories</a>
        <a href="/history" onClick={() => setMenuOpen(false)}>BMX history</a>
        <a href="/#process" onClick={() => setMenuOpen(false)}>How to buy</a>
      </nav>

      <div className="header-actions">
        <a className="support-link" href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello Craig's Bikes. I need help choosing a BMX bike.")}`} target="_blank" rel="noreferrer">Support</a>
        <a className="store-chat-link" href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello Craig's Bikes. I have a question about the collection.")}`} target="_blank" rel="noreferrer">
          <span>W</span><strong>Chat</strong>
        </a>
      </div>
    </header>
  );
}
