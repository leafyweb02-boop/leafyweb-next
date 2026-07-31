"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  const menus = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
    },
    {
      name: "Orders",
      href: "/admin/orders",
    },
    {
      name: "Invoices",
      href: "/admin/invoices",
    },
  ];

  return (
    <div className="mb-10">

      <div className="flex justify-between items-center">

        <div>
          <h1 className="text-4xl font-bold">
            Leafyweb Admin
          </h1>

          <p className="text-gray-500 mt-2">
            Welcome back 👋
          </p>
        </div>

        <div className="h-12 w-12 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">
          A
        </div>

      </div>

      <div className="flex gap-4 mt-8 border-b pb-4">

        {menus.map((menu) => (

          <Link
            key={menu.href}
            href={menu.href}
            className={`px-5 py-2 rounded-xl transition ${
              pathname === menu.href
                ? "bg-orange-500 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {menu.name}
          </Link>

        ))}

      </div>

    </div>
  );
}