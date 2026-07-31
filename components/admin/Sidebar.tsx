"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const menu = [
    { name: "Dashboard", href: "/admin/dashboard" },
    { name: "Orders", href: "/admin/orders" },
    { name: "Generated Websites", href: "/admin/generated-websites" },
    { name: "Website Generator", href: "/admin/generator" },
    { name: "Invoices", href: "/admin/invoices" },
  ];

  return (
    <aside className="w-64 min-h-screen bg-[#111111] border-r border-gray-800 p-6">
      <h1 className="text-3xl font-bold text-orange-500 mb-10">Leafyweb</h1>

      <nav className="space-y-3">
        {menu.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`block rounded-xl px-4 py-3 transition ${
              pathname === item.href
                ? "bg-orange-500 text-white"
                : "text-gray-300 hover:bg-gray-800"
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
