"use client";

import Link from "next/link";
import { useState, type ChangeEvent, type FormEvent } from "react";

export default function OrderPage() {
  const [loading, setLoading] = useState(false);
  const [submissionError, setSubmissionError] = useState("");

  const [formData, setFormData] = useState(() => {
    const templateParam =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search).get("template") ?? ""
        : "";

    return {
      business_name: "",
      contact_person: "",
      whatsapp: "",
      email: "",
      business_type: "",
      template: templateParam,
      website_description: "",
      business_address: "",
    };
  });
  const [logo, setLogo] = useState<File | null>(null);
  const [images, setImages] = useState<File[]>([]);

  const handleChange = (
    e: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setSubmissionError("");

    const payload = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      payload.append(key, value);
    });

    if (logo) {
      payload.append("logo", logo);
    }

    images.forEach((image) => {
      payload.append("images", image);
    });

    const response = await fetch("/api/orders", {
      method: "POST",
      body: payload,
    });

    const result = await response.json().catch(() => ({
      error: "Unable to submit your order right now.",
    }));

    setLoading(false);

    if (!response.ok) {
      setSubmissionError(result.error || "Unable to submit your order right now.");
      return;
    }

    window.location.href = "/success";

    setFormData({
      business_name: "",
      contact_person: "",
      whatsapp: "",
      email: "",
      business_type: "",
      template: "",
      website_description: "",
      business_address: "",
    });
    setLogo(null);
    setImages([]);
  }

  return (
  <section className="min-h-screen bg-[#111111] text-white py-20 px-6">
  <div className="max-w-4xl mx-auto">

    <div className="mb-8 flex items-center justify-between gap-4">
      <Link
        href="/"
        className="inline-flex rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:border-orange-500"
      >
        ← Back to Home
      </Link>

      <Link
        href="/admin/login"
        className="inline-flex rounded-xl border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-sm font-semibold text-orange-300 transition hover:bg-orange-500/20"
      >
        Admin Login
      </Link>
    </div>

    <div className="text-center mb-16">
      <span className="inline-block rounded-full border border-orange-500/30 bg-orange-500/10 px-5 py-2 text-sm font-semibold uppercase tracking-[3px] text-orange-400">
        Website Order
      </span>

      <h1 className="mt-8 text-5xl font-bold">
        Let&apos;s Build Your Website
      </h1>

      <p className="mt-6 text-gray-400">
        Fill out the details below and we&apos;ll start building your website.
      </p>
    </div>

    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl"
    > 
    
    <div className="mb-6">
  <label className="block mb-2">Business Name</label>

  <input
    name="business_name"
    value={formData.business_name}
    onChange={handleChange}
    type="text"
    required
    placeholder="Business Name"
    className="w-full rounded-xl border border-white/10 bg-[#1b1b1b] px-5 py-4 outline-none focus:border-orange-500"
  />
</div>
<div className="mb-6">
  <label className="block mb-2">Contact Person</label>

  <input
    name="contact_person"
    value={formData.contact_person}
    onChange={handleChange}
    type="text"
    required
    placeholder="Your Name"
    className="w-full rounded-xl border border-white/10 bg-[#1b1b1b] px-5 py-4 outline-none focus:border-orange-500"
  />
</div>
<div className="grid md:grid-cols-2 gap-6">

  <div>
    <label className="block mb-2">WhatsApp</label>

    <input
      name="whatsapp"
      value={formData.whatsapp}
      onChange={handleChange}
      type="text"
      required
      placeholder="+91..."
      className="w-full rounded-xl border border-white/10 bg-[#1b1b1b] px-5 py-4 outline-none focus:border-orange-500"
    />
  </div>

  <div>
    <label className="block mb-2">Email</label>

    <input
      name="email"
      value={formData.email}
      onChange={handleChange}
      type="email"
      required
      placeholder="example@email.com"
      className="w-full rounded-xl border border-white/10 bg-[#1b1b1b] px-5 py-4 outline-none focus:border-orange-500"
    />
  </div>

</div>
<div className="mt-8">
  <label className="block mb-2">
    Business Type
  </label>

  <select
    name="business_type"
    value={formData.business_type}
    onChange={handleChange}
    className="w-full rounded-xl border border-white/10 bg-[#1b1b1b] px-5 py-4 outline-none focus:border-orange-500"
  >
    <option value="">Select Business Type</option>
    <option value="Restaurant">Restaurant</option>
    <option value="Hotel">Hotel</option>
    <option value="Business">Business</option>
    <option value="Ecommerce">Ecommerce</option>
    <option value="Portfolio">Portfolio</option>
    <option value="Other">Other</option>
  </select>
</div>
<div className="mt-8">
  <label className="block mb-2">
    Selected Template
  </label>

  <select
    name="template"
    value={formData.template}
    onChange={handleChange}
    className="w-full rounded-xl border border-white/10 bg-[#1b1b1b] px-5 py-4 outline-none focus:border-orange-500"
  >
    <option value="">Select Template</option>
    <option value="Restaurant Template">
      Restaurant Template
    </option>

    <option value="Hotel Template">
      Hotel Template
    </option>

    <option value="Shop Template">
      Shop Template
    </option>

    <option value="Small Business Template">
      Small Business Template
    </option>

    <option value="Freelancer Template">
      Freelancer Template
    </option>

    <option value="Business Template">
      Business Template
    </option>

    <option value="Custom Design">
      Custom Design
    </option>
  </select>
</div>
<div className="mt-8">
  <label className="block mb-2">
    Website Description
  </label>

  <textarea
    name="website_description"
    value={formData.website_description}
    onChange={handleChange}
    rows={6}
    placeholder="Describe your website..."
    className="w-full rounded-xl border border-white/10 bg-[#1b1b1b] px-5 py-4 outline-none focus:border-orange-500"
  />
</div>
<div className="mt-8">
  <label className="block mb-2">
    Business Address
  </label>

  <textarea
    name="business_address"
    value={formData.business_address}
    onChange={handleChange}
    rows={4}
    placeholder="Enter your business address..."
    className="w-full rounded-xl border border-white/10 bg-[#1b1b1b] px-5 py-4 outline-none focus:border-orange-500"
  />
</div>
{/* Upload Section */}
<div className="grid md:grid-cols-2 gap-6 mt-8">

  {/* Logo Upload */}
  <div>
    <label className="block mb-2 font-medium">
      Upload Logo
    </label>

   <input
  type="file"
  accept="image/*"
  onChange={(e) => {
    if (e.target.files?.[0]) {
      setLogo(e.target.files[0]);
    }
  }}
/>
  </div>

  {/* Images Upload */}
  <div>
    <label className="block mb-2 font-medium">
      Upload Images
    </label>

    <input
  type="file"
  multiple
  accept="image/*"
  onChange={(e) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  }}
/>
  </div>

</div>
<div className="mt-10">
  <button
    type="submit"
    disabled={loading}
    className="
      w-full
      rounded-2xl
      bg-orange-500
      py-5
      text-lg
      font-bold
      transition-all
      duration-300
      hover:bg-orange-600
      disabled:opacity-50
      disabled:cursor-not-allowed
    "
  >
    {loading
      ? "Submitting..."
      : "🚀 Submit Website Order"}
  </button>

  {submissionError ? (
    <div className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
      {submissionError}
    </div>
  ) : null}
</div>
</form>
</div>
</section>
  );
}