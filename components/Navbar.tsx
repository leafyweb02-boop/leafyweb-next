"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/#features", label: "Features" },
  { href: "/#templates", label: "Templates" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#contact", label: "Contact" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#111111]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="text-3xl font-bold text-white sm:text-4xl">
          Leafy<span className="text-orange-500">web</span>
        </Link>

        <nav className="hidden items-center gap-10 text-white md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-orange-500">
              {item.label}
            </Link>
          ))}

          <Link
            href="/order"
            className="rounded-xl bg-orange-500 px-7 py-3 font-semibold text-white transition hover:scale-105 hover:bg-orange-600"
          >
            Order Website
          </Link>
        </nav>

        <button
          type="button"
          aria-label="Toggle navigation menu"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((open) => !open)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:border-orange-500 hover:text-orange-400 md:hidden"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-white/10 bg-[#111111]/95 md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 sm:px-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-xl px-3 py-3 text-base text-white transition hover:bg-white/5 hover:text-orange-400"
              >
                {item.label}
              </Link>
            ))}

            <Link
              href="/order"
              onClick={() => setMobileOpen(false)}
              className="mt-2 rounded-xl bg-orange-500 px-5 py-3 text-center font-semibold text-white transition hover:bg-orange-600"
            >
              Order Website
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}