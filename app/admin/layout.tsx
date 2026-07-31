"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const ADMIN_AUTH_COOKIE = "leafyweb-admin-auth";

const navLinks = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/generated-websites", label: "Generated Websites" },
  { href: "/admin/generator", label: "Website Generator" },
  { href: "/admin/invoices", label: "Invoices" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    async function verifySession() {
      if (pathname === "/admin/login") {
        setAuthChecked(true);
        return;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        document.cookie = `${ADMIN_AUTH_COOKIE}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
        router.replace("/admin/login");
        return;
      }

      document.cookie = `${ADMIN_AUTH_COOKIE}=true; path=/; max-age=3600; SameSite=Lax`;
      setAuthChecked(true);
    }

    void verifySession();
  }, [pathname, router]);

  if (pathname === "/admin/login") {
    return (
      <main className="min-h-screen bg-[#111111] p-8 text-white overflow-auto">
        {children}
      </main>
    );
  }

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert(error.message);
      return;
    }

    document.cookie = `${ADMIN_AUTH_COOKIE}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    router.push("/admin/login");
  };

  if (!authChecked && pathname !== "/admin/login") {
    return (
      <div className="min-h-screen bg-[#111111] text-white flex items-center justify-center px-6">
        <div className="rounded-3xl border border-white/10 bg-[#1b1b1b] p-10 text-center">
          <p className="text-gray-400">Checking admin access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-72 bg-black text-white p-6 border-r border-white/10">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-orange-500">Leafyweb</h1>
          <p className="text-sm text-gray-400 mt-2">Admin Panel</p>
        </div>

        <nav className="space-y-3">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-2xl px-4 py-3 transition ${
                pathname === item.href
                  ? "bg-orange-500 text-white"
                  : "text-gray-300 hover:bg-gray-900"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="mt-10 w-full rounded-2xl border border-white/10 bg-[#111111] px-4 py-3 text-left text-white transition hover:border-orange-500 hover:bg-[#1a1a1a]"
        >
          Sign Out
        </button>
      </aside>

      <main className="flex-1 bg-[#111111] p-8 text-white overflow-auto">{children}</main>
    </div>
  );
}
