import { bikes } from "./products";

const photoCount = bikes.reduce((total, bike) => total + bike.images.length, 0);

export function StoreFooter() {
  return (
    <footer>
      <div className="footer-top">
        <a className="wordmark footer-brand" href="/" aria-label="Craige Bikes home"><img className="brand-logo" src="/brand/craige-bikes-wordmark-v2.png" alt="Craige Bikes" /></a>
        <p>The independent marketplace for original old-school BMX bikes.</p>
        <a className="button button-white" href="/shop">Shop all bikes</a>
      </div>
      <div className="footer-links">
        <nav aria-label="Footer marketplace links"><strong>Marketplace</strong><a href="/shop">All bikes</a><a href="/shop?style=Freestyle">Freestyle</a><a href="/shop?style=Race">Race</a></nav>
        <nav aria-label="Footer information links"><strong>Information</strong><a href="/history">BMX history</a><a href="/#confidence">Our standards</a><a href="/#process">How to buy</a><a href="https://wa.me/16089573848" target="_blank" rel="noreferrer">Contact support</a></nav>
        <div><strong>Catalogued with care</strong><p>{bikes.length} classic bikes<br />{photoCount} catalogue photographs<br />Worldwide order support</p></div>
      </div>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} Craige Bikes</span><span>Old-school BMX · Built for collectors</span></div>
    </footer>
  );
}
