import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider/AuthProvider";
import "react-toastify/dist/ReactToastify.css";
import ToastProvider from "@/components/ToastProvider/ToastProvider";

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
      <body>
        <AuthProvider>{children}</AuthProvider>
        <ToastProvider />
      </body>
    </html>
  );
}
