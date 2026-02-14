import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Historical Timeline — 5,000 Years of Human Civilization",
  description: "An interactive horizontal-scroll timeline visualizing 2,260 historical figures, 62 major events, and 54 significant works across 5,000 years of human history.",
  keywords: ["history", "timeline", "historical figures", "civilization", "ancient", "medieval", "renaissance", "modern"],
  authors: [{ name: "Joseph Han", url: "https://github.com/joshephan" }],
  openGraph: {
    title: "Historical Timeline — 5,000 Years of Human Civilization",
    description: "An interactive timeline visualizing 2,260 historical figures, 62 major events, and 54 significant works from ancient Mesopotamia to the modern era.",
    type: "website",
    locale: "en_US",
    siteName: "Historical Timeline",
  },
  twitter: {
    card: "summary_large_image",
    title: "Historical Timeline — 5,000 Years of Human Civilization",
    description: "An interactive timeline visualizing 2,260 historical figures across 5,000 years of human history.",
  },
  robots: {
    index: true,
    follow: true,
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
