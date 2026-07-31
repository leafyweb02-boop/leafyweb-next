"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function WebsiteGeneratorPage() {
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("Restaurant");
  const [template, setTemplate] = useState("Modern");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  function createSlug(name: string) {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  async function generateUniqueSlug(name: string) {
    const baseSlug = createSlug(name);
    let slug = baseSlug;
    let count = 1;

    while (true) {
      const { data, error } = await supabase
        .from("generated_websites")
        .select("id")
        .eq("slug", slug)
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error("Slug lookup error:", error);
        return slug;
      }

      if (!data) {
        return slug;
      }

      slug = `${baseSlug}-${count}`;
      count += 1;
    }
  }

  async function generateWebsite() {
    if (!businessName.trim()) {
      alert("Please enter a business name.");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setGeneratedUrl("");

    const slug = await generateUniqueSlug(businessName);

    const { error } = await supabase
      .from("generated_websites")
      .insert({
        business_name: businessName,
        business_type: businessType,
        template,
        description,
        slug,
        status: "Draft",
      });

    setLoading(false);

    if (error) {
      console.error("Website generation error:", error);
      setErrorMessage(`Website could not be generated: ${error.message}`);
      return;
    }

    setGeneratedUrl(`/website/${slug}`);
    setBusinessName("");
    setBusinessType("Restaurant");
    setTemplate("Modern");
    setDescription("");
  }

  return (
    <div className="min-h-screen bg-[#111315] p-10 text-white">

      <div className="mx-auto max-w-6xl">

        <div className="mb-10">

          <p className="mb-2 font-bold uppercase tracking-[0.2em] text-orange-500">
            Leafyweb Studio
          </p>

          <h1 className="text-5xl font-bold">
            Website Generator
          </h1>

          <p className="mt-3 text-gray-400">
            Create a professional website in a few steps.
          </p>

        </div>

        <div className="grid gap-8 lg:grid-cols-2">

          {/* Generator Form */}

          <div className="rounded-3xl border border-white/10 bg-[#1b1e22] p-8">

            <label className="mb-3 block font-semibold">
              Business Name
            </label>

            <input
              value={businessName}
              onChange={(e) =>
                setBusinessName(e.target.value)
              }
              placeholder="Enter business name"
              className="mb-6 w-full rounded-xl border border-white/10 bg-[#121417] px-5 py-4 text-white outline-none focus:border-orange-500"
            />

            <label className="mb-3 block font-semibold">
              Business Type
            </label>

            <select
              value={businessType}
              onChange={(e) =>
                setBusinessType(e.target.value)
              }
              className="mb-6 w-full rounded-xl border border-white/10 bg-[#121417] px-5 py-4 text-white outline-none"
            >
              <option>Restaurant</option>
              <option>Hotel</option>
              <option>Shop</option>
              <option>Small Business</option>
              <option>Freelancer</option>
            </select>

            <label className="mb-3 block font-semibold">
              Choose Template
            </label>

            <div className="mb-6 grid grid-cols-3 gap-4">

              {["Modern", "Minimal", "Premium"].map(
                (item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setTemplate(item)}
                    className={`rounded-2xl border p-5 text-left transition ${
                      template === item
                        ? "border-orange-500 bg-orange-500/10"
                        : "border-white/10 bg-[#121417]"
                    }`}
                  >
                    <div className="mb-4 text-2xl">
                      ✦
                    </div>

                    <h3 className="font-bold">
                      {item}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      {item} website style
                    </p>
                  </button>
                )
              )}

            </div>

            <label className="mb-3 block font-semibold">
              Website Description
            </label>

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              placeholder="Describe the website..."
              rows={6}
              className="mb-6 w-full rounded-xl border border-white/10 bg-[#121417] px-5 py-4 text-white outline-none focus:border-orange-500"
            />

            <button
              onClick={generateWebsite}
              disabled={loading}
              className="w-full rounded-xl bg-orange-500 px-6 py-5 text-lg font-bold text-white transition hover:bg-orange-600 disabled:opacity-60"
            >
              {loading
                ? "Generating..."
                : "✨ Generate Website"}
            </button>

            {errorMessage ? (
              <div className="mt-6 rounded-3xl border border-red-500/20 bg-red-500/5 p-5 text-sm text-red-200">
                {errorMessage}
              </div>
            ) : null}

            {generatedUrl ? (
              <div className="mt-6 rounded-3xl border border-green-500/20 bg-green-500/5 p-6">
                <p className="text-sm uppercase tracking-[0.2em] text-emerald-300">
                  Website Generated
                </p>
                <p className="mt-3 text-white">
                  Your website is available at{' '}
                  <Link
                    href={generatedUrl}
                    className="font-semibold text-orange-400 underline"
                  >
                    {generatedUrl}
                  </Link>
                </p>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href={generatedUrl}
                    className="inline-flex items-center justify-center rounded-xl bg-orange-500 px-6 py-3 text-sm font-semibold text-black transition hover:bg-orange-600"
                  >
                    Preview Website
                  </Link>

                  <button
                    type="button"
                    onClick={() => setGeneratedUrl("")}
                    className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-[#121417] px-6 py-3 text-sm font-semibold text-white transition hover:border-orange-500"
                  >
                    Generate Another Website
                  </button>
                </div>
              </div>
            ) : null}
          </div>

          {/* Live Preview */}

          <div className="rounded-3xl border border-white/10 bg-[#1b1e22] p-8">

            <p className="mb-5 font-bold text-gray-300">
              Live Preview
            </p>

            <div className="overflow-hidden rounded-3xl border border-white/20 bg-[#111315]">

              <div className="flex items-center gap-3 border-b border-white/10 bg-white/5 px-6 py-4">

                <span className="h-3 w-3 rounded-full bg-red-400" />

                <span className="h-3 w-3 rounded-full bg-yellow-400" />

                <span className="h-3 w-3 rounded-full bg-green-400" />

                <div className="ml-4 flex-1 rounded-lg bg-white/10 px-4 py-2 text-sm text-gray-500">
                  leafyweb.site/
                  {createSlug(businessName) || "your-business"}
                </div>

              </div>

              <div className="p-10">

                <div className="mb-16 flex items-center justify-between">

                  <h2 className="text-2xl font-bold text-orange-500">
                    {businessName || "Your Business"}
                  </h2>

                  <div className="text-sm text-gray-400">
                    Home · About · Contact
                  </div>

                </div>

                <span className="rounded-full bg-orange-500/10 px-5 py-2 text-sm font-bold text-orange-400">
                  {businessType}
                </span>

                <h3 className="mt-8 text-5xl font-bold">
                  Welcome to{" "}
                  {businessName || "Your Business"}
                </h3>

                <p className="mt-6 max-w-xl text-lg leading-8 text-gray-400">
                  {description ||
                    "A professional website created with Leafyweb."}
                </p>

                <button className="mt-8 rounded-xl bg-orange-500 px-7 py-4 font-bold">
                  Get Started
                </button>

                <div className="mt-16 grid grid-cols-3 gap-4">

                  <div className="h-24 rounded-2xl bg-white/5" />

                  <div className="h-24 rounded-2xl bg-white/5" />

                  <div className="h-24 rounded-2xl bg-white/5" />

                </div>

                <p className="mt-10 text-center text-sm text-gray-600">
                  {template} Template · Powered by Leafyweb
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}