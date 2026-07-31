"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
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
}

type WebsiteStatusFilter = "All" | "Draft" | "Published" | "Archived";

const websiteStatusOptions: WebsiteStatusFilter[] = [
  "All",
  "Draft",
  "Published",
  "Archived",
];

function normalizeStatus(status: string | undefined): "Draft" | "Published" | "Archived" {
  if (status === "Published") {
    return "Published";
  }

  if (status === "Archived") {
    return "Archived";
  }

  return "Draft";
}

function getStatusBadgeStyle(status: string): string {
  const normalized = normalizeStatus(status);

  switch (normalized) {
    case "Published":
      return "inline-flex rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300";
    case "Archived":
      return "inline-flex rounded-full border border-slate-500/20 bg-slate-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200";
    default:
      return "inline-flex rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-orange-300";
  }
}

export default function GeneratedWebsitesPage() {
  const [websites, setWebsites] = useState<GeneratedWebsiteRecord[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<WebsiteStatusFilter>("All");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<GeneratedWebsiteRecord | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    async function loadWebsites() {
      setLoading(true);
      const { data, error } = await supabase
        .from("generated_websites")
        .select("id, business_name, business_type, template, description, slug, status, created_at")
        .order("created_at", { ascending: false });

      if (error) {
        setErrorMessage(error.message);
        setWebsites([]);
      } else {
        setWebsites(data || []);
        setErrorMessage("");
      }

      setLoading(false);
    }

    void loadWebsites();
  }, []);

  const filteredWebsites = useMemo(
    () =>
      websites
        .filter((website) => {
          const query = search.toLowerCase().trim();

          if (!query) {
            return true;
          }

          return (
            website.business_name.toLowerCase().includes(query) ||
            website.slug.toLowerCase().includes(query)
          );
        })
        .filter((website) => {
          if (statusFilter === "All") {
            return true;
          }

          return normalizeStatus(website.status) === statusFilter;
        }),
    [search, statusFilter, websites]
  );

  async function confirmDeleteWebsite() {
    if (!deleteTarget) {
      return;
    }

    const websiteId = deleteTarget.id;

    if (!Number.isInteger(websiteId) || websiteId <= 0) {
      setErrorMessage("Invalid website ID.");
      return;
    }

    setDeleteLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    const { error } = await supabase
      .from("generated_websites")
      .delete()
      .eq("id", websiteId);

    setDeleteLoading(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    setWebsites((current) => current.filter((website) => website.id !== websiteId));
    setSuccessMessage("Website deleted successfully.");
    setDeleteTarget(null);
  }

  return (
    <div className="min-h-screen bg-[#111315] text-white p-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-orange-500">
              Website Management
            </p>
            <h1 className="text-4xl font-bold">Generated Websites</h1>
            <p className="mt-3 max-w-2xl text-gray-400">
              View and preview all websites generated through Leafyweb.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/admin/generator"
              className="rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-black transition hover:bg-orange-600"
            >
              Generate New Website
            </Link>

            <button
              type="button"
              onClick={() => setSearch("")}
              className="rounded-xl border border-white/10 bg-[#121417] px-5 py-3 text-sm font-semibold text-white transition hover:border-orange-500"
            >
              Clear Search
            </button>
          </div>
        </div>

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex-1">
            <label className="mb-3 block text-sm font-semibold text-gray-300">
              Search by business name or slug
            </label>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search generated websites..."
              className="w-full rounded-3xl border border-white/10 bg-[#121417] px-5 py-4 text-white outline-none transition focus:border-orange-500"
            />
          </div>

          <div className="w-full max-w-xs">
            <label className="mb-3 block text-sm font-semibold text-gray-300">
              Filter by status
            </label>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as WebsiteStatusFilter)}
              className="w-full rounded-3xl border border-white/10 bg-[#121417] px-5 py-4 text-white outline-none transition focus:border-orange-500"
            >
              {websiteStatusOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        {successMessage ? (
          <div className="mb-6 rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-5 text-sm text-emerald-200">
            {successMessage}
          </div>
        ) : null}

        <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#1b1e22] p-6 shadow-xl">
          {loading ? (
            <div className="rounded-3xl border border-white/10 bg-[#111315] p-10 text-center text-gray-400">
              Loading generated websites...
            </div>
          ) : errorMessage ? (
            <div className="rounded-3xl border border-red-500/20 bg-red-500/5 p-10 text-center text-red-200">
              {errorMessage}
            </div>
          ) : filteredWebsites.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/10 bg-[#111315] p-10 text-center text-gray-400">
              <p className="text-lg font-semibold text-white">
                No generated websites found.
              </p>
              <p className="mt-3 max-w-xl mx-auto text-sm text-gray-400">
                Generate a new website in the admin generator and it will appear here.
              </p>
              <div className="mt-8">
                <Link
                  href="/admin/generator"
                  className="inline-flex rounded-xl bg-orange-500 px-6 py-3 font-semibold text-black transition hover:bg-orange-600"
                >
                  Create First Website
                </Link>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-white/10 text-left text-sm">
                <thead>
                  <tr className="text-gray-400">
                    <th className="px-4 py-4 font-medium">Business</th>
                    <th className="px-4 py-4 font-medium">Type</th>
                    <th className="px-4 py-4 font-medium">Slug</th>
                    <th className="px-4 py-4 font-medium">Template</th>
                    <th className="px-4 py-4 font-medium">Status</th>
                    <th className="px-4 py-4 font-medium">Created</th>
                    <th className="px-4 py-4 font-medium">Action</th>
                    <th className="px-4 py-4 font-medium">Preview</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredWebsites.map((website) => (
                    <tr key={website.id} className="border-b border-white/5">
                      <td className="px-4 py-5 text-white">
                        <div className="font-semibold">{website.business_name}</div>
                        <div className="text-xs text-gray-400">{website.description || "No description"}</div>
                      </td>
                      <td className="px-4 py-5 text-gray-300">{website.business_type}</td>
                      <td className="px-4 py-5 text-orange-400">{website.slug}</td>
                      <td className="px-4 py-5 text-gray-300">{website.template}</td>
                      <td className="px-4 py-5">
                        <span className={getStatusBadgeStyle(website.status)}>
                          {normalizeStatus(website.status)}
                        </span>
                      </td>
                      <td className="px-4 py-5 text-gray-300">
                        {new Date(website.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-5 space-x-2">
                        <Link
                          href={`/admin/generated-websites/${website.id}`}
                          className="inline-flex rounded-xl border border-white/10 bg-[#121417] px-4 py-2 text-sm font-semibold text-white transition hover:border-orange-500"
                        >
                          Edit Website
                        </Link>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(website)}
                          className="inline-flex rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-200 transition hover:bg-red-500/10"
                        >
                          Delete
                        </button>
                      </td>
                      <td className="px-4 py-5">
                        <Link
                          href={
                            normalizeStatus(website.status) === "Published"
                              ? `/website/${website.slug}`
                              : `/website/${website.slug}?preview=true`
                          }
                          className="inline-flex rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-black transition hover:bg-orange-600"
                        >
                          Preview Website
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {deleteTarget ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-[#111315] p-8 shadow-2xl">
            <h2 className="text-2xl font-semibold text-white">Delete Website</h2>
            <p className="mt-4 text-gray-400">
              Are you sure you want to delete <span className="font-semibold text-white">{deleteTarget.business_name}</span>?
              This action cannot be undone.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="inline-flex rounded-3xl border border-white/10 bg-[#121417] px-6 py-3 text-sm font-semibold text-white transition hover:border-orange-500"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteWebsite}
                disabled={deleteLoading}
                className="inline-flex rounded-3xl bg-red-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-600 disabled:opacity-60"
              >
                {deleteLoading ? "Deleting..." : "Delete Website"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
