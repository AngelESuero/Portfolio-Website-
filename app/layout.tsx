import "./globals.css";
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { PwaRegister } from "./components/PwaRegister";

export const metadata: Metadata = {
  title: "Newark Civic Circuit",
  description: "Community-powered civic input for Newark residents.",
  manifest: "/manifest.json"
};

export const viewport: Viewport = {
  themeColor: "#54575b"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-fog">
        <PwaRegister />
        {children}
      </body>
    </html>
  );
}
