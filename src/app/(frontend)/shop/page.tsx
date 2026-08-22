import type { Metadata } from "next";
import { getBikes } from "../../../lib/catalogue";
import { StoreFooter } from "../store-footer";
import { StoreHeader } from "../store-header";
import { ShopClient } from "./shop-client";

export const metadata: Metadata = {
  title: "Shop Old-School BMX Bikes | Craig's Bikes",
  description: "Browse the complete Craig's Bikes collection of collector-grade freestyle and race BMX bikes from the golden era.",
};

// Re-read the catalogue at most once a minute, so edits published in the admin
// reach the shop without anyone triggering a rebuild.
export const revalidate = 60;

export default async function ShopPage() {
  const bikes = await getBikes();

  return (
    <div className="page-shell shop-page">
      <StoreHeader />
      <main>
        <ShopClient bikes={bikes} />
      </main>
      <StoreFooter bikes={bikes} />
    </div>
  );
}
