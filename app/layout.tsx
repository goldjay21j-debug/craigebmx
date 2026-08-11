import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;

  return {
    metadataBase: new URL(origin),
    title: "Craige Bikes | Old-School BMX. Forever RAD.",
    description:
      "Shop collector-grade old-school BMX bicycles with detailed galleries, clear USD pricing and worldwide order support.",
    icons: {
      icon: "/og-classic.png",
      shortcut: "/og-classic.png",
    },
    openGraph: {
      title: "Craige Bikes | Old-School BMX. Forever RAD.",
      description: "Golden-era BMX for riders, collectors and dreamers. Find the ride that keeps the stoke alive.",
      url: origin,
      siteName: "Craige Bikes",
      images: [{ url: `${origin}/og.png`, width: 1200, height: 630, alt: "Craige Bikes old-school BMX marketplace" }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Craige Bikes | Old-School BMX. Forever RAD.",
      description: "Tuff Wheels, Day-Glo paint and golden-era rides for collectors who still live BMX.",
      images: [`${origin}/og.png`],
    },
  };
}

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
