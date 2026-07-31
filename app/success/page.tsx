"use client";

import Link from "next/link";

import LeafywebBrandBackground from "@/components/LeafywebBrandBackground";

export default function SuccessPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#111111] flex items-center justify-center px-6">
      <LeafywebBrandBackground stage="success" />
      <div className="relative z-10 max-w-xl w-full rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-10 text-center">

        <div className="text-6xl mb-6">🎉</div>

        <h1 className="text-4xl font-bold text-white">
          Your Website Order is Confirmed
        </h1>

        <p className="text-gray-400 mt-6 leading-8">
          Your order has been received successfully.
          <br />
          The Leafyweb team will review your details, prepare the order in the admin workflow, and continue the website build process from there.
        </p>

        <div className="mt-8 rounded-2xl border border-orange-500/20 bg-orange-500/10 p-5 text-left text-sm text-gray-300">
          <p className="font-semibold text-orange-300">What happens next</p>
          <ul className="mt-3 space-y-2">
            <li>• Your order is captured in the admin orders queue.</li>
            <li>• A draft website can be created from the order details.</li>
            <li>• The admin can preview, edit, and publish the final website.</li>
          </ul>
        </div>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex w-full items-center justify-center rounded-xl bg-orange-500 px-8 py-4 font-semibold text-white transition hover:bg-orange-600 sm:w-auto"
          >
            Back to Home
          </Link>

          <Link
            href="/order"
            className="inline-flex w-full items-center justify-center rounded-xl border border-white/10 bg-white/5 px-8 py-4 font-semibold text-white transition hover:border-orange-500 sm:w-auto"
          >
            Order Another Website
          </Link>
        </div>

      </div>
    </main>
  );
}