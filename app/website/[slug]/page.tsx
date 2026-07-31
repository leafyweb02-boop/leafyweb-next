// app/website/[slug]/page.tsx
//
// ASSUMPTION: You have a Supabase client exported from `lib/supabase.ts` like:
//
//   import { createClient } from '@supabase/supabase-js'
//   export const supabase = createClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
//   )
//
// If your client lives somewhere else, just update the import path below.
// Nothing else in your project (including the generator page) is touched by this file.

import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import LeafywebBrandBackground from "@/components/LeafywebBrandBackground";

export const dynamic = "force-dynamic"; // always fetch fresh data, no caching

// ---------- Types ----------

interface GeneratedWebsite {
  id: string;
  business_name: string;
  business_type: string;
  template: "Modern" | "Minimal" | "Premium" | string;
  description: string;
  slug: string;
  status: string;
  created_at: string;
  address?: string;
  phone?: string;
  email?: string;
  menu_item_1?: string;
  menu_price_1?: string;
  menu_item_2?: string;
  menu_price_2?: string;
  menu_item_3?: string;
  menu_price_3?: string;
  menu_item_4?: string;
  menu_price_4?: string;
  opening_hours_mon_thu?: string;
  opening_hours_fri_sat?: string;
  opening_hours_sun?: string;
  gallery_image_1?: string;
  gallery_image_2?: string;
  gallery_image_3?: string;
  gallery_image_4?: string;
}

// ---------- Data fetching ----------

async function getWebsiteBySlug(slug: string): Promise<GeneratedWebsite | null> {
  const { data, error } = await supabase
    .from("generated_websites")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    return null;
  }

  return data as GeneratedWebsite;
}

// ---------- Page ----------

function normalizeStatus(status: string | undefined): "Draft" | "Published" | "Archived" {
  const normalized = String(status || "").trim().toLowerCase();

  if (normalized === "published") return "Published";
  if (normalized === "archived") return "Archived";
  return "Draft";
}

type GeneratedWebsitePageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string }>;
};

export default async function GeneratedWebsitePage({
  params,
  searchParams,
}: GeneratedWebsitePageProps) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const previewMode = resolvedSearchParams.preview === "true";
  const website = await getWebsiteBySlug(slug);

  if (!website) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-[#0b0b0f] text-white">
        <LeafywebBrandBackground stage="website" />
        <WebsiteNotFound slug={slug} />
      </main>
    );
  }

  const currentStatus = normalizeStatus(website.status);
  if (currentStatus !== "Published" && !previewMode) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-[#0b0b0f] text-white">
        <LeafywebBrandBackground stage="website" />
        <WebsiteUnavailable site={website} />
      </main>
    );
  }

  const content = (() => {
    switch (website.template) {
      case "Minimal":
        return <MinimalTemplate site={website} />;
      case "Modern":
        return <ModernTemplate site={website} />;
      case "Premium":
      default:
        return <PremiumTemplate site={website} />;
    }
  })();

  if (previewMode && currentStatus !== "Published") {
    return (
      <main className="relative min-h-screen overflow-hidden bg-[#0b0b0f] text-white">
        <LeafywebBrandBackground stage="website" />
        <div className="fixed inset-x-0 top-0 z-50 border-b border-orange-400 bg-orange-500/95 px-4 py-3 text-center text-sm font-semibold text-black">
          Preview mode: this website is not published publicly yet.
        </div>
        <div className="pt-14">{content}</div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0b0b0f] text-white">
      <LeafywebBrandBackground stage="website" />
      {content}
    </main>
  );
}

function WebsiteUnavailable({ site }: { site: GeneratedWebsite }) {
  const status = normalizeStatus(site.status);
  const title = status === "Archived" ? "Website Archived" : "Website Not Published";
  const message =
    status === "Archived"
      ? "This website has been archived and is not available publicly."
      : "This website is currently saved as a draft and cannot be viewed publicly.";

  return (
    <main className="min-h-screen bg-[#0b0b0f] text-white flex items-center justify-center px-6 py-20">
      <div className="max-w-2xl rounded-3xl border border-white/10 bg-[#111315] p-10 text-center shadow-2xl">
        <h1 className="text-3xl font-semibold mb-4">{title}</h1>
        <p className="mb-8 text-gray-400">{message}</p>
        <Link
          href="/"
          className="inline-flex rounded-xl bg-orange-500 px-6 py-3 text-sm font-semibold text-black transition hover:bg-orange-400"
        >
          Back to Leafyweb
        </Link>
      </div>
    </main>
  );
}

// =========================================================
// NOT FOUND STATE
// =========================================================

function WebsiteNotFound({ slug }: { slug: string }) {
  return (
    <main className="min-h-screen bg-[#0b0b0f] text-white flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="mx-auto mb-6 h-16 w-16 rounded-2xl bg-orange-500/10 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-orange-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M12 21a9 9 0 100-18 9 9 0 000 18z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-semibold mb-2">Website Not Found</h1>
        <p className="text-gray-400 mb-8">
          We couldn&apos;t find a generated website for{" "}
          <span className="text-orange-400 font-mono">/{slug}</span>. It may
          have been removed, or the link might be incorrect.
        </p>
        <Link
          href="/"
          className="inline-block rounded-xl bg-orange-500 hover:bg-orange-400 transition-colors px-6 py-3 text-sm font-medium text-black"
        >
          Back to Leafyweb
        </Link>
      </div>
    </main>
  );
}

// =========================================================
// SHARED: Restaurant business content
// =========================================================

function RestaurantContent({
  accent,
  site,
}: {
  accent: "orange" | "emerald" | "slate";
  site: GeneratedWebsite;
}) {
  const accentText =
    accent === "orange"
      ? "text-orange-400"
      : accent === "emerald"
      ? "text-emerald-500"
      : "text-gray-800";
  const accentBg =
    accent === "orange"
      ? "bg-orange-500 hover:bg-orange-400 text-black"
      : accent === "emerald"
      ? "bg-emerald-500 hover:bg-emerald-400 text-black"
      : "bg-gray-900 hover:bg-gray-700 text-white";

  const defaultDishes = [
    { name: "Grilled Saffron Chicken", price: "$18" },
    { name: "Slow-Braised Lamb Shank", price: "$24" },
    { name: "Truffle Mushroom Risotto", price: "$16" },
    { name: "Seared Salmon & Citrus Glaze", price: "$21" },
  ];

  const dishes = [1, 2, 3, 4].map((index) => ({
    name:
      site[
        `menu_item_${index}` as keyof GeneratedWebsite
      ] || defaultDishes[index - 1].name,
    price:
      site[
        `menu_price_${index}` as keyof GeneratedWebsite
      ] || defaultDishes[index - 1].price,
  }));

  const hours = [
    {
      day: "Monday – Thursday",
      time: site.opening_hours_mon_thu || "11:00 AM – 10:00 PM",
    },
    {
      day: "Friday – Saturday",
      time: site.opening_hours_fri_sat || "11:00 AM – 11:30 PM",
    },
    {
      day: "Sunday",
      time: site.opening_hours_sun || "12:00 PM – 9:00 PM",
    },
  ];

  return (
    <>
      {/* Menu / Signature Dishes */}
      <section id="menu" className="py-20 px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <h2 className={`text-3xl md:text-4xl font-semibold mb-2 ${accentText}`}>
            Signature Dishes
          </h2>
          <p className="text-gray-400 mb-10">
            A curated selection from our seasonal menu.
          </p>
          <div className="grid sm:grid-cols-2 gap-6">
            {dishes.map((dish) => (
              <div
                key={`${dish.name}-${dish.price}`}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-6 py-5 hover:bg-white/[0.08] transition-colors"
              >
                <span className="font-medium">{dish.name}</span>
                <span className={`font-semibold ${accentText}`}>{dish.price}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Opening Hours + Reservation CTA */}
      <section id="reservation" className="py-20 px-6 md:px-12 bg-white/[0.03]">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className={`text-3xl font-semibold mb-6 ${accentText}`}>
              Opening Hours
            </h2>
            <ul className="space-y-3">
              {hours.map((h) => (
                <li
                  key={h.day}
                  className="flex justify-between border-b border-white/10 pb-2 text-gray-300"
                >
                  <span>{h.day}</span>
                  <span className="text-gray-400">{h.time}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-white/10 p-8 text-center">
            <h3 className="text-2xl font-semibold mb-3">Reserve Your Table</h3>
            <p className="text-gray-400 mb-6">
              Join us for an unforgettable dining experience. Booking takes less
              than a minute.
            </p>
            <button
              className={`w-full rounded-xl px-6 py-3 font-medium transition-colors ${accentBg}`}
            >
              Book a Table
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

// =========================================================
// GENERIC: Gallery + Contact + Footer (shared shell pieces)
// =========================================================

function GalleryPlaceholder({ variant }: { variant: "dark" | "light" }) {
  const box =
    variant === "dark"
      ? "bg-white/5 border border-white/10"
      : "bg-gray-100 border border-gray-200";
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className={`aspect-square rounded-xl ${box} flex items-center justify-center text-sm text-gray-400`}
        >
          Gallery {i}
        </div>
      ))}
    </div>
  );
}

function GallerySection({
  site,
  variant,
}: {
  site: GeneratedWebsite;
  variant: "dark" | "light";
}) {
  const images = [
    site.gallery_image_1,
    site.gallery_image_2,
    site.gallery_image_3,
    site.gallery_image_4,
  ].filter(Boolean) as string[];

  if (images.length === 0) {
    return <GalleryPlaceholder variant={variant} />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      {images.map((imageUrl, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-3xl border border-white/10 bg-white/5"
        >
          <Image
            src={imageUrl}
            alt={`Gallery image ${index + 1}`}
            width={600}
            height={600}
            unoptimized
            className="h-full w-full object-cover"
          />
        </div>
      ))}
    </div>
  );
}

function ContactSection({
  site,
  variant = "dark",
}: {
  site: GeneratedWebsite;
  variant?: "dark" | "light";
}) {
  const address = site.address || "123 Main Street";
  const phone = site.phone || "(555) 123-4567";
  const email = site.email || "hello@example.com";

  const itemClass =
    variant === "light"
      ? "rounded-md border border-gray-200 py-5 text-sm text-gray-600"
      : "rounded-xl border border-white/10 py-5 text-sm text-gray-300";

  return (
    <div className={`grid sm:grid-cols-3 gap-4 ${variant === "light" ? "text-gray-600" : "text-gray-300"}`}>
      <div className={itemClass}>📍 {address}</div>
      <div className={itemClass}>📞 {phone}</div>
      <div className={itemClass}>✉️ {email}</div>
    </div>
  );
}

// =========================================================
// PREMIUM TEMPLATE — dark, orange accent, elegant, animated
// =========================================================

function PremiumTemplate({ site }: { site: GeneratedWebsite }) {
  return (
    <main className="min-h-screen bg-[#0b0b0f] text-white font-serif selection:bg-orange-500/30">
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.9s ease-out both; }
        .fade-up-delay-1 { animation: fadeUp 0.9s ease-out 0.15s both; }
        .fade-up-delay-2 { animation: fadeUp 0.9s ease-out 0.3s both; }
      `}</style>

      {/* Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#0b0b0f]/80 border-b border-white/10">
        <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 md:px-12 py-4">
          <span className="text-lg tracking-wide font-semibold">
            {site.business_name}
          </span>
          <div className="hidden md:flex gap-8 text-sm text-gray-300">
            <a href="#about" className="hover:text-orange-400 transition-colors">About</a>
            <a href="#menu" className="hover:text-orange-400 transition-colors">Menu</a>
            <a href="#gallery" className="hover:text-orange-400 transition-colors">Gallery</a>
            <a href="#contact" className="hover:text-orange-400 transition-colors">Contact</a>
          </div>
          <a
            href="#reservation"
            className="rounded-lg bg-orange-500 hover:bg-orange-400 transition-colors px-4 py-2 text-sm font-medium text-black"
          >
            Reserve
          </a>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden px-6 md:px-12 py-28 md:py-40 text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-500/10 via-transparent to-transparent" />
        <div className="relative max-w-3xl mx-auto">
          <span className="fade-up inline-block text-xs uppercase tracking-[0.3em] text-orange-400 mb-6">
            {site.business_type}
          </span>
          <h1 className="fade-up-delay-1 text-4xl md:text-6xl font-semibold leading-tight mb-6">
            {site.business_name}
          </h1>
          <p className="fade-up-delay-2 text-gray-400 text-lg max-w-xl mx-auto mb-10">
            {site.description}
          </p>
          <div className="fade-up-delay-2 flex justify-center gap-4">
            <a
              href="#reservation"
              className="rounded-xl bg-orange-500 hover:bg-orange-400 transition-colors px-7 py-3 text-sm font-medium text-black"
            >
              Reserve a Table
            </a>
            <a
              href="#about"
              className="rounded-xl border border-white/20 hover:border-orange-400/60 transition-colors px-7 py-3 text-sm font-medium"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-20 px-6 md:px-12 border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-orange-400">
            About Us
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed">
            {site.description}
          </p>
        </div>
      </section>

      {/* Business-specific content */}
      {site.business_type?.toLowerCase() === "restaurant" ? (
        <RestaurantContent accent="orange" site={site} />
      ) : (
        <section className="py-20 px-6 md:px-12 bg-white/[0.03]">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl font-semibold mb-4 text-orange-400">
              Our Services
            </h2>
            <p className="text-gray-400">
              Tailored {site.business_type.toLowerCase()} services designed
              around your needs.
            </p>
          </div>
        </section>
      )}

      {/* Gallery */}
      <section id="gallery" className="py-20 px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-semibold mb-10 text-orange-400 text-center">
            Gallery
          </h2>
          <GallerySection site={site} variant="dark" />
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20 px-6 md:px-12 border-t border-white/10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-4 text-orange-400">
            Get in Touch
          </h2>
          <p className="text-gray-400 mb-8">
            We&apos;d love to hear from you. Reach out for reservations,
            events, or general inquiries.
          </p>
          <ContactSection site={site} variant="dark" />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 md:px-12 border-t border-white/10 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} {site.business_name}. Built with Leafyweb.
      </footer>
    </main>
  );
}

// =========================================================
// MODERN TEMPLATE — bold, colorful, energetic
// =========================================================

function ModernTemplate({ site }: { site: GeneratedWebsite }) {
  return (
    <main className="min-h-screen bg-[#0f172a] text-white font-sans">
      {/* Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#0f172a]/80 border-b border-white/10">
        <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 md:px-12 py-4">
          <span className="text-lg font-bold">{site.business_name}</span>
          <div className="hidden md:flex gap-8 text-sm text-gray-300">
            <a href="#about" className="hover:text-emerald-400 transition-colors">About</a>
            <a href="#menu" className="hover:text-emerald-400 transition-colors">Menu</a>
            <a href="#gallery" className="hover:text-emerald-400 transition-colors">Gallery</a>
            <a href="#contact" className="hover:text-emerald-400 transition-colors">Contact</a>
          </div>
          <a
            href="#reservation"
            className="rounded-full bg-emerald-500 hover:bg-emerald-400 transition-colors px-5 py-2 text-sm font-semibold text-black"
          >
            Get Started
          </a>
        </nav>
      </header>

      {/* Hero */}
      <section className="px-6 md:px-12 py-24 md:py-32 text-center bg-gradient-to-br from-emerald-500/10 via-transparent to-blue-500/10">
        <span className="inline-block rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-semibold uppercase tracking-wide px-4 py-1 mb-6">
          {site.business_type}
        </span>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
          {site.business_name}
        </h1>
        <p className="text-gray-300 text-lg max-w-xl mx-auto mb-10">
          {site.description}
        </p>
        <div className="flex justify-center gap-4">
          <a
            href="#reservation"
            className="rounded-full bg-emerald-500 hover:bg-emerald-400 transition-colors px-7 py-3 text-sm font-semibold text-black"
          >
            Reserve Now
          </a>
          <a
            href="#about"
            className="rounded-full border border-white/20 hover:border-emerald-400 transition-colors px-7 py-3 text-sm font-semibold"
          >
            Discover More
          </a>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-20 px-6 md:px-12">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div className="rounded-2xl bg-white/5 border border-white/10 h-56 flex items-center justify-center text-gray-500">
            Image Placeholder
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-4 text-emerald-400">About Us</h2>
            <p className="text-gray-300 leading-relaxed">{site.description}</p>
          </div>
        </div>
      </section>

      {site.business_type?.toLowerCase() === "restaurant" ? (
        <RestaurantContent accent="emerald" site={site} />
      ) : (
        <section className="py-20 px-6 md:px-12 bg-white/5">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4 text-emerald-400">
              What We Offer
            </h2>
            <p className="text-gray-300">
              Modern {site.business_type.toLowerCase()} solutions built around you.
            </p>
          </div>
        </section>
      )}

      <section id="gallery" className="py-20 px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-10 text-emerald-400 text-center">
            Gallery
          </h2>
          <GallerySection site={site} variant="dark" />
        </div>
      </section>

      <section id="contact" className="py-20 px-6 md:px-12 bg-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4 text-emerald-400">Contact Us</h2>
          <p className="text-gray-300 mb-8">Let&apos;s talk about how we can help.</p>
          <ContactSection site={site} variant="dark" />
        </div>
      </section>

      <footer className="py-10 px-6 md:px-12 border-t border-white/10 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} {site.business_name}. Built with Leafyweb.
      </footer>
    </main>
  );
}

// =========================================================
// MINIMAL TEMPLATE — light, clean, spacious
// =========================================================

function MinimalTemplate({ site }: { site: GeneratedWebsite }) {
  return (
    <main className="min-h-screen bg-white text-gray-900 font-sans">
      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
        <nav className="max-w-5xl mx-auto flex items-center justify-between px-6 md:px-12 py-5">
          <span className="text-lg font-medium">{site.business_name}</span>
          <div className="hidden md:flex gap-8 text-sm text-gray-500">
            <a href="#about" className="hover:text-gray-900 transition-colors">About</a>
            <a href="#menu" className="hover:text-gray-900 transition-colors">Menu</a>
            <a href="#gallery" className="hover:text-gray-900 transition-colors">Gallery</a>
            <a href="#contact" className="hover:text-gray-900 transition-colors">Contact</a>
          </div>
          <a
            href="#reservation"
            className="rounded-md bg-gray-900 hover:bg-gray-700 transition-colors px-4 py-2 text-sm text-white"
          >
            Contact
          </a>
        </nav>
      </header>

      {/* Hero */}
      <section className="px-6 md:px-12 py-28 md:py-36 text-center">
        <p className="text-xs uppercase tracking-[0.25em] text-gray-400 mb-6">
          {site.business_type}
        </p>
        <h1 className="text-4xl md:text-5xl font-medium mb-6 tracking-tight">
          {site.business_name}
        </h1>
        <p className="text-gray-500 text-lg max-w-lg mx-auto mb-10">
          {site.description}
        </p>
        <a
          href="#reservation"
          className="inline-block rounded-md bg-gray-900 hover:bg-gray-700 transition-colors px-7 py-3 text-sm text-white"
        >
          Reserve a Table
        </a>
      </section>

      {/* About */}
      <section id="about" className="py-20 px-6 md:px-12 border-t border-gray-100">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-medium mb-4">About</h2>
          <p className="text-gray-500 leading-relaxed">{site.description}</p>
        </div>
      </section>

      {site.business_type?.toLowerCase() === "restaurant" ? (
        <RestaurantContent accent="slate" site={site} />
      ) : (
        <section className="py-20 px-6 md:px-12 bg-gray-50">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-medium mb-4">Services</h2>
            <p className="text-gray-500">
              Simple, focused {site.business_type.toLowerCase()} offerings.
            </p>
          </div>
        </section>
      )}

      <section id="gallery" className="py-20 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-medium mb-10 text-center">Gallery</h2>
          <GallerySection site={site} variant="light" />
        </div>
      </section>

      <section id="contact" className="py-20 px-6 md:px-12 border-t border-gray-100">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-medium mb-4">Contact</h2>
          <p className="text-gray-500 mb-8">We&apos;d love to hear from you.</p>
          <ContactSection site={site} variant="light" />
        </div>
      </section>

      <footer className="py-10 px-6 md:px-12 border-t border-gray-100 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} {site.business_name}. Built with Leafyweb.
      </footer>
    </main>
  );
}
