"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Users", href: "/dashboard/users" },
  { name: "Jobs", href: "/dashboard/jobs" },
  { name: "Products", href: "/dashboard/products" },
  { name: "Admin", href: "/dashboard/admin" },
  { name: "Login", href: "/login" },
  { name: "Register", href: "/register" },
];

export default function SidebarSlot() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1 p-4">
      {links.map((link) => {
        const isActive = pathname === link.href;

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
              isActive
                ? "bg-indigo-100 text-indigo-700"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            {link.name}
          </Link>
        );
      })}
    </nav>
  );
}
