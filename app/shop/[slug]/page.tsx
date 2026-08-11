import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { bikes } from "../../products";
import { StoreFooter } from "../../store-footer";
import { StoreHeader } from "../../store-header";
import { ProductDetailClient } from "./product-detail-client";

type ProductPageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return bikes.map((bike) => ({ slug: bike.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const bike = bikes.find((item) => item.slug === slug);
  if (!bike) return { title: "Bike not found | Craig's Bikes" };

  return {
    title: `${bike.name} | Craig's Bikes`,
    description: `${bike.description} View ${bike.images.length} photographs, collector details, availability and price information.`,
    openGraph: {
      title: `${bike.name} | Craig's Bikes`,
      description: bike.description,
      images: [{ url: bike.images[0], alt: `${bike.name} BMX bicycle` }],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const bike = bikes.find((item) => item.slug === slug);
  if (!bike) notFound();

  const related = bikes.filter((item) => item.id !== bike.id && (item.style === bike.style || item.brand === bike.brand)).slice(0, 3);

  return (
    <div className="page-shell product-page">
      <StoreHeader />
      <main>
        <ProductDetailClient bike={bike} />

        <section className="related-section">
          <div className="section-title-row">
            <div><span className="eyebrow"><i /> Keep looking</span><h2>More RAD rides.</h2></div>
            <a className="text-link" href="/shop">View all bikes <span>→</span></a>
          </div>
          <div className="related-grid">
            {related.map((item) => (
              <a className="related-card" href={`/shop/${item.slug}`} key={item.id}>
                <img src={item.images[0]} alt={`${item.name} BMX bicycle`} />
                <span><small>{item.year} · {item.style}</small><strong>{item.name}</strong></span>
                <i>→</i>
              </a>
            ))}
          </div>
        </section>
      </main>
      <StoreFooter />
    </div>
  );
}
