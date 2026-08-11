import type { Metadata } from "next";
import { StoreFooter } from "../store-footer";
import { StoreHeader } from "../store-header";
import { ShopClient } from "./shop-client";

export const metadata: Metadata = {
  title: "Shop Old-School BMX Bikes | Craige Bikes",
  description: "Browse the complete Craige Bikes collection of collector-grade freestyle and race BMX bikes from the golden era.",
};

export default function ShopPage() {
  return (
    <div className="page-shell shop-page">
      <StoreHeader />
      <main>
        <ShopClient />
      </main>
      <StoreFooter />
    </div>
  );
}
