"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface GeneratedWebsiteRecord {
  id: number;
  business_name: string;
  business_type: string;
  template: string;
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

function normalizeStatus(status: string | undefined): "Draft" | "Published" | "Archived" {
  const normalized = String(status || "").trim().toLowerCase();

  if (normalized === "published") return "Published";
  if (normalized === "archived") return "Archived";
  return "Draft";
}

export default function WebsiteEditorPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const websiteId = Number(id);
  const isWebsiteIdValid = Number.isInteger(websiteId) && websiteId > 0;
  const [website, setWebsite] = useState<GeneratedWebsiteRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    async function loadWebsite() {
      setLoading(true);

      if (!isWebsiteIdValid) {
        setErrorMessage("Invalid website ID.");
        setWebsite(null);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("generated_websites")
        .select(
          "id, business_name, business_type, template, description, slug, status, created_at, address, phone, email, menu_item_1, menu_price_1, menu_item_2, menu_price_2, menu_item_3, menu_price_3, menu_item_4, menu_price_4, opening_hours_mon_thu, opening_hours_fri_sat, opening_hours_sun, gallery_image_1, gallery_image_2, gallery_image_3, gallery_image_4"
        )
        .eq("id", websiteId)
        .single();

      if (error || !data) {
        setErrorMessage(error?.message || "Website not found.");
        setWebsite(null);
      } else {
        setWebsite(data as GeneratedWebsiteRecord);
        setErrorMessage("");
      }

      setLoading(false);
    }

    void loadWebsite();
  }, [isWebsiteIdValid, websiteId]);

  const editableFields = useMemo(
    () => [
      {
        label: "Business Name",
        value: website?.business_name || "",
        key: "business_name",
        type: "text",
      },
      {
        label: "Business Type",
        value: website?.business_type || "",
        key: "business_type",
        type: "text",
      },
      {
        label: "Description",
        value: website?.description || "",
        key: "description",
        type: "textarea",
      },
      {
        label: "Template",
        value: website?.template || "Modern",
        key: "template",
        type: "select",
        options: ["Modern", "Minimal", "Premium"],
      },
      {
        label: "Status",
        value: website ? normalizeStatus(website.status) : "Draft",
        key: "status",
        type: "select",
        options: ["Draft", "Published", "Archived"],
      },
      {
        label: "Address",
        value: website?.address || "",
        key: "address",
        type: "text",
      },
      {
        label: "Phone Number",
        value: website?.phone || "",
        key: "phone",
        type: "text",
      },
      {
        label: "Email Address",
        value: website?.email || "",
        key: "email",
        type: "text",
      },
    ],
    [website]
  );

  function updateField(key: keyof GeneratedWebsiteRecord, value: string) {
    setWebsite((current) =>
      current ? { ...current, [key]: value } : current
    );
  }

  async function saveChanges() {
    if (!website) {
      return;
    }

    setSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    const { error } = await supabase
      .from("generated_websites")
      .update({
        business_name: website.business_name,
        business_type: website.business_type,
        template: website.template,
        description: website.description,
        status: normalizeStatus(website.status),
        address: website.address,
        phone: website.phone,
        email: website.email,
        menu_item_1: website.menu_item_1,
        menu_price_1: website.menu_price_1,
        menu_item_2: website.menu_item_2,
        menu_price_2: website.menu_price_2,
        menu_item_3: website.menu_item_3,
        menu_price_3: website.menu_price_3,
        menu_item_4: website.menu_item_4,
        menu_price_4: website.menu_price_4,
        opening_hours_mon_thu: website.opening_hours_mon_thu,
        opening_hours_fri_sat: website.opening_hours_fri_sat,
        opening_hours_sun: website.opening_hours_sun,
        gallery_image_1: website.gallery_image_1,
        gallery_image_2: website.gallery_image_2,
        gallery_image_3: website.gallery_image_3,
        gallery_image_4: website.gallery_image_4,
      })
      .eq("id", websiteId);

    setSaving(false);

    if (error) {
      setErrorMessage(error.message || "Website could not be saved right now.");
      return;
    }

    setSuccessMessage("Website details saved successfully.");
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#111315] text-white p-10">
        <div className="mx-auto max-w-5xl rounded-3xl border border-white/10 bg-[#16181d] p-10 text-center text-gray-300">
          Loading website details...
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="min-h-screen bg-[#111315] text-white p-10">
        <div className="mx-auto max-w-5xl rounded-3xl border border-red-500/20 bg-red-500/5 p-10 text-center text-red-200">
          {errorMessage}
        </div>
      </div>
    );
  }

  if (!website) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0d0f14] text-white p-6 md:p-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-orange-500">
              Website Editor
            </p>
            <h1 className="text-4xl font-bold">Edit {website.business_name}</h1>
            <p className="mt-3 max-w-2xl text-gray-400">
              Update the generated website content and publish live changes to the public preview.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href={`/website/${website.slug}`}
              className="rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-black transition hover:bg-orange-600"
            >
              Preview Website
            </Link>
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-xl border border-white/10 bg-[#121417] px-5 py-3 text-sm font-semibold text-white transition hover:border-orange-500"
            >
              Cancel
            </button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.4fr_0.6fr]">
          <div className="space-y-8 rounded-3xl border border-white/10 bg-[#171b20] p-8 shadow-xl">
            <div className="grid gap-6 lg:grid-cols-2">
              {editableFields.map((field) => (
                <div key={field.key}>
                  <label className="mb-3 block text-sm font-semibold text-gray-300">
                    {field.label}
                  </label>
                  {field.type === "textarea" ? (
                    <textarea
                      value={field.value}
                      onChange={(event) => updateField(field.key as keyof GeneratedWebsiteRecord, event.target.value)}
                      rows={4}
                      className="w-full rounded-3xl border border-white/10 bg-[#111315] px-4 py-4 text-white outline-none transition focus:border-orange-500"
                    />
                  ) : field.type === "select" ? (
                    <select
                      value={field.value}
                      onChange={(event) => updateField(field.key as keyof GeneratedWebsiteRecord, event.target.value)}
                      className="w-full rounded-3xl border border-white/10 bg-[#111315] px-4 py-4 text-white outline-none transition focus:border-orange-500"
                    >
                      {field.options?.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={field.value}
                      onChange={(event) => updateField(field.key as keyof GeneratedWebsiteRecord, event.target.value)}
                      className="w-full rounded-3xl border border-white/10 bg-[#111315] px-4 py-4 text-white outline-none transition focus:border-orange-500"
                    />
                  )}
                </div>
              ))}
            </div>

            <section className="rounded-3xl border border-white/10 bg-[#111315] p-6">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold">Restaurant Content</h2>
                  <p className="text-sm text-gray-400">Editable restaurant-specific menu, hours, and gallery fields.</p>
                </div>
              </div>

              <div className="grid gap-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-300">Menu Item 1</label>
                    <input
                      type="text"
                      value={website.menu_item_1 || ""}
                      onChange={(event) => updateField("menu_item_1", event.target.value)}
                      className="w-full rounded-3xl border border-white/10 bg-[#111315] px-4 py-4 text-white outline-none transition focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-300">Menu Price 1</label>
                    <input
                      type="text"
                      value={website.menu_price_1 || ""}
                      onChange={(event) => updateField("menu_price_1", event.target.value)}
                      className="w-full rounded-3xl border border-white/10 bg-[#111315] px-4 py-4 text-white outline-none transition focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-300">Menu Item 2</label>
                    <input
                      type="text"
                      value={website.menu_item_2 || ""}
                      onChange={(event) => updateField("menu_item_2", event.target.value)}
                      className="w-full rounded-3xl border border-white/10 bg-[#111315] px-4 py-4 text-white outline-none transition focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-300">Menu Price 2</label>
                    <input
                      type="text"
                      value={website.menu_price_2 || ""}
                      onChange={(event) => updateField("menu_price_2", event.target.value)}
                      className="w-full rounded-3xl border border-white/10 bg-[#111315] px-4 py-4 text-white outline-none transition focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-300">Menu Item 3</label>
                    <input
                      type="text"
                      value={website.menu_item_3 || ""}
                      onChange={(event) => updateField("menu_item_3", event.target.value)}
                      className="w-full rounded-3xl border border-white/10 bg-[#111315] px-4 py-4 text-white outline-none transition focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-300">Menu Price 3</label>
                    <input
                      type="text"
                      value={website.menu_price_3 || ""}
                      onChange={(event) => updateField("menu_price_3", event.target.value)}
                      className="w-full rounded-3xl border border-white/10 bg-[#111315] px-4 py-4 text-white outline-none transition focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-300">Menu Item 4</label>
                    <input
                      type="text"
                      value={website.menu_item_4 || ""}
                      onChange={(event) => updateField("menu_item_4", event.target.value)}
                      className="w-full rounded-3xl border border-white/10 bg-[#111315] px-4 py-4 text-white outline-none transition focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-300">Menu Price 4</label>
                    <input
                      type="text"
                      value={website.menu_price_4 || ""}
                      onChange={(event) => updateField("menu_price_4", event.target.value)}
                      className="w-full rounded-3xl border border-white/10 bg-[#111315] px-4 py-4 text-white outline-none transition focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-300">Hours Mon–Thu</label>
                    <input
                      type="text"
                      value={website.opening_hours_mon_thu || ""}
                      onChange={(event) => updateField("opening_hours_mon_thu", event.target.value)}
                      className="w-full rounded-3xl border border-white/10 bg-[#111315] px-4 py-4 text-white outline-none transition focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-300">Hours Fri–Sat</label>
                    <input
                      type="text"
                      value={website.opening_hours_fri_sat || ""}
                      onChange={(event) => updateField("opening_hours_fri_sat", event.target.value)}
                      className="w-full rounded-3xl border border-white/10 bg-[#111315] px-4 py-4 text-white outline-none transition focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-300">Hours Sun</label>
                    <input
                      type="text"
                      value={website.opening_hours_sun || ""}
                      onChange={(event) => updateField("opening_hours_sun", event.target.value)}
                      className="w-full rounded-3xl border border-white/10 bg-[#111315] px-4 py-4 text-white outline-none transition focus:border-orange-500"
                    />
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-[#111315] p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold">Gallery Images</h2>
                <p className="text-sm text-gray-400">Optional image URLs for the public gallery section.</p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {[1, 2, 3, 4].map((index) => (
                  <div key={index}>
                    <label className="mb-2 block text-sm font-semibold text-gray-300">
                      Gallery Image {index}
                    </label>
                    <input
                      type="url"
                      value={website[`gallery_image_${index}` as keyof GeneratedWebsiteRecord] || ""}
                      onChange={(event) => updateField(`gallery_image_${index}` as keyof GeneratedWebsiteRecord, event.target.value)}
                      className="w-full rounded-3xl border border-white/10 bg-[#111315] px-4 py-4 text-white outline-none transition focus:border-orange-500"
                    />
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-6 rounded-3xl border border-white/10 bg-[#111315] p-8 shadow-xl">
            <div className="rounded-3xl bg-[#121417] p-6">
              <p className="text-sm uppercase tracking-[0.3em] text-orange-500">Website Snapshot</p>
              <h2 className="mt-4 text-2xl font-semibold">{website.business_name}</h2>
              <p className="mt-3 text-gray-400">{website.description || "No description provided yet."}</p>
              <div className="mt-6 space-y-3 text-sm text-gray-300">
                <div>
                  <span className="block text-gray-400">Slug</span>
                  <span className="text-white">{website.slug}</span>
                </div>
                <div>
                  <span className="block text-gray-400">Template</span>
                  <span className="text-white">{website.template}</span>
                </div>
                <div>
                  <span className="block text-gray-400">Status</span>
                  <span className="text-orange-300">{website.status}</span>
                </div>
              </div>
            </div>

            {successMessage ? (
              <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-5 text-sm text-emerald-200">
                {successMessage}
              </div>
            ) : null}

            {errorMessage ? (
              <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-5 text-sm text-red-200">
                {errorMessage}
              </div>
            ) : null}

            <button
              type="button"
              onClick={saveChanges}
              disabled={saving}
              className="w-full rounded-3xl bg-orange-500 px-6 py-4 text-sm font-semibold text-black transition hover:bg-orange-600 disabled:opacity-60"
            >
              {saving ? "Saving changes..." : "Save Changes"}
            </button>

            <button
              type="button"
              onClick={() => router.back()}
              className="w-full rounded-3xl border border-white/10 bg-[#121417] px-6 py-4 text-sm font-semibold text-white transition hover:border-orange-500"
            >
              Cancel
            </button>

            <Link
              href={`/website/${website.slug}${normalizeStatus(website.status) !== "Published" ? "?preview=true" : ""}`}
              className="inline-flex w-full items-center justify-center rounded-3xl border border-orange-500 px-6 py-4 text-sm font-semibold text-orange-300 transition hover:bg-orange-500/10"
            >
              Open Public Preview
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
}
