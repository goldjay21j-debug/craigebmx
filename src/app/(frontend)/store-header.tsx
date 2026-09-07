"use client";

import { useState } from "react";
import { emailLink } from "../../lib/contact";

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
        <a className="support-link" href={emailLink("Help choosing a BMX bike", "Hello Craig's Bikes,\n\nI need help choosing a BMX bike.\n")}>Support</a>
        <a className="store-chat-link" href={emailLink("Question about the collection", "Hello Craig's Bikes,\n\nI have a question about the collection.\n")}>
          <span>@</span><strong>Email</strong>
        </a>
      </div>
    </header>
  );
}
