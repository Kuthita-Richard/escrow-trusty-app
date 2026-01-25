import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Trusty Escrow",
  description: "Secure escrow transactions",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
