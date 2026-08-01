"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, MessageCircle, MapPin, Mail, Phone } from "lucide-react";
import type { TemplatePreviewRecord } from "@/components/templatePreviewData";

interface TemplatePreviewLayoutProps {
  preview: TemplatePreviewRecord;
}

export default function TemplatePreviewLayout({
  preview,
}: TemplatePreviewLayoutProps) {
  return (
    <div className="min-h-screen bg-[#111111] text-white">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:border-orange-500 hover:text-orange-400"
          >
            <ArrowLeft size={16} />
            Back to Templates
          </Link>

          <Link
            href={`/order?template=${encodeURIComponent(preview.label)}`}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            Choose This Template
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[#161616] shadow-[0_0_60px_rgba(0,0,0,0.35)]">
          <section className="relative overflow-hidden bg-gradient-to-br from-[#181818] to-[#101010] px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,122,0,0.18),transparent_45%)]" />
            <div className="relative">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-2xl">
                  <div className="mb-4 inline-flex rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[3px] text-orange-400">
                    {preview.name} Preview
                  </div>
                  <h1 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
                    {preview.heroTitle}
                  </h1>
                  <p className="mt-4 max-w-xl text-sm leading-7 text-gray-300 sm:text-base lg:text-lg">
                    {preview.heroText}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link
                      href={`/order?template=${encodeURIComponent(preview.label)}`}
                      className="rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
                    >
                      Choose This Template
                    </Link>
                    <a
                      href={`https://wa.me/1234567890`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-orange-500 hover:text-orange-400"
                    >
                      <MessageCircle size={16} />
                      WhatsApp
                    </a>
                  </div>
                </div>

                <div className="grid w-full max-w-md grid-cols-2 gap-3 sm:gap-4">
                  {preview.highlights.map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center text-sm font-semibold text-white"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 sm:p-6">
              <h2 className="text-2xl font-bold text-orange-400">{preview.aboutTitle}</h2>
              <p className="mt-4 text-sm leading-7 text-gray-300 sm:text-base">
                {preview.aboutText}
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 sm:p-6">
              <h2 className="text-2xl font-bold text-orange-400">{preview.galleryTitle}</h2>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {preview.galleryItems.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-white/10 bg-[#1c1c1c] p-4 text-sm text-gray-200"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="px-4 pb-8 sm:px-6 lg:px-8">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 sm:p-6">
              <h2 className="text-2xl font-bold text-orange-400">Services & Contact</h2>
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-[#1c1c1c] p-4">
                  <div className="mb-3 flex items-center gap-2 text-orange-400">
                    <Phone size={16} />
                    <span className="text-sm font-semibold">Phone</span>
                  </div>
                  <p className="text-sm text-gray-300">{preview.contact.phone}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-[#1c1c1c] p-4">
                  <div className="mb-3 flex items-center gap-2 text-orange-400">
                    <Mail size={16} />
                    <span className="text-sm font-semibold">Email</span>
                  </div>
                  <p className="text-sm text-gray-300">{preview.contact.email}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-[#1c1c1c] p-4">
                  <div className="mb-3 flex items-center gap-2 text-orange-400">
                    <MapPin size={16} />
                    <span className="text-sm font-semibold">Address</span>
                  </div>
                  <p className="text-sm text-gray-300">{preview.contact.address}</p>
                </div>
              </div>
            </div>
          </section>

          <footer className="border-t border-white/10 bg-[#0f0f0f] px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-gray-400">© 2026 {preview.heroTitle}. All rights reserved.</p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                <Link href="/order" className="transition hover:text-orange-400">
                  Order Website
                </Link>
                <Link href="/" className="transition hover:text-orange-400">
                  Home
                </Link>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
