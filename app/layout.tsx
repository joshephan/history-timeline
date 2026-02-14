import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Historical Timeline",
  description: "5,000 years of human civilization at a glance — from ancient to modern",
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
