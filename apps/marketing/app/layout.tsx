import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mobile Home Guy — Mobile & Manufactured Home Financing",
  description: "Financing for mobile and manufactured homes — in a park or with land, purchase or refinance.",
};

const NAV_LINKS = [
  { href: "/get-approved", label: "Get Approved" },
  { href: "/apply", label: "Apply Online" },
  { href: "/contact", label: "Contact" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <header className="border-b border-ink-200 bg-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <Link href="/" className="font-display text-xl font-semibold text-brand-700">
              Mobile Home Guy
            </Link>
            <nav className="flex items-center gap-6 text-sm font-medium text-ink-700">
              {NAV_LINKS.map((link) => (
                <Link key={link.href} href={link.href} className="hover:text-brand-700">
                  {link.label}
                </Link>
              ))}
              <Link
                href="/login"
                className="rounded-md bg-brand-600 px-4 py-2 text-white hover:bg-brand-700"
              >
                Login
              </Link>
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
