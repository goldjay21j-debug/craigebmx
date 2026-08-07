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
    title: "Craige Bikes | Old School BMX",
    description:
      "Shop curated 80s and 90s BMX bikes from Craige Bikes, with live stock and personal buying help on WhatsApp.",
    icons: {
      icon: "/og.png",
      shortcut: "/og.png",
    },
    openGraph: {
      title: "Craige Bikes | Old School Soul. Built to Ride.",
      description: "Curated 80s and 90s BMX bikes with live stock on WhatsApp.",
      url: origin,
      siteName: "Craige Bikes",
      images: [{ url: `${origin}/og.png`, width: 1200, height: 630, alt: "Craige Bikes old school BMX" }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Craige Bikes | Old School BMX",
      description: "Old school soul. Built to ride.",
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
