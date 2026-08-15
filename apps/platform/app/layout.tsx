import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mobile Home Guy — Platform",
  description: "Mortgage CRM, loan pipeline, and portals for Mobile Home Guy.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
