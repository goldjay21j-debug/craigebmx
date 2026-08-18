import type { Metadata } from "next";
import "./globals.css";

const siteUrl = "https://craigesbike.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Craig's Bikes | Old-School BMX. Forever RAD.",
  description:
    "Shop collector-grade old-school BMX bicycles with detailed galleries, clear USD pricing and worldwide order support.",
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
  },
  openGraph: {
    title: "Craig's Bikes | Old-School BMX. Forever RAD.",
    description: "Golden-era BMX for riders, collectors and dreamers. Find the ride that keeps the stoke alive.",
    url: siteUrl,
    siteName: "Craig's Bikes",
    images: [{ url: "/og-craigs-bikes.jpg", width: 1200, height: 630, alt: "Craig's Bikes old-school BMX marketplace" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Craig's Bikes | Old-School BMX. Forever RAD.",
    description: "Tuff Wheels, Day-Glo paint and golden-era rides for collectors who still live BMX.",
    images: ["/og-craigs-bikes.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
