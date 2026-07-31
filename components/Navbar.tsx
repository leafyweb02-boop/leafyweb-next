"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#111111]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link href="/" className="text-4xl font-bold text-white">
          Leafy<span className="text-orange-500">web</span>
        </Link>

        <nav className="hidden items-center gap-10 text-white md:flex">
          <Link href="/" className="transition hover:text-orange-500">
            Home
          </Link>

          <Link href="/#features" className="transition hover:text-orange-500">
            Features
          </Link>

          <Link href="/#templates" className="transition hover:text-orange-500">
            Templates
          </Link>

          <Link href="/#pricing" className="transition hover:text-orange-500">
            Pricing
          </Link>

          <Link href="/#contact" className="transition hover:text-orange-500">
            Contact
          </Link>

          <Link
            href="/order"
            className="rounded-xl bg-orange-500 px-7 py-3 font-semibold text-white transition hover:scale-105 hover:bg-orange-600"
          >
            Order Website
          </Link>
        </nav>
      </div>
    </header>
  );
}