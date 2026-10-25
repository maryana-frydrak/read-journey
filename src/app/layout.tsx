import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Read Journey",
  description: "Expand your mind, reading a book",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk">
      <body>{children}</body>
    </html>
  );
}
