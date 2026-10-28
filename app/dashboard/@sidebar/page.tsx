"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const PDF_URL = process.env.NEXT_PUBLIC_PDF_URL ?? "http://localhost:3001";

const groups = [
  {
    title: "",
    links: [{ name: "Dashboard", href: "/dashboard" }],
  },
  {
    title: "Auth service",
    links: [
      { name: "Users", href: "/dashboard/users" },
      { name: "Admin", href: "/dashboard/admin" },
      { name: "Login", href: "/login" },
      { name: "Register", href: "/register" },
    ],
  },
  {
    title: "Image service",
    links: [
      { name: "Jobs", href: "/dashboard/jobs" },
      { name: "Products", href: "/dashboard/products" },
    ],
  },
  {
    title: "PDF service",
    links: [
      { name: "Upload PDF", href: "/dashboard/pdf" },
      { name: "Bull board", href: `${PDF_URL}/admin/queues` },
    ],
  },
];

export default function SidebarSlot() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-4 p-4">
      {groups.map((group) => (
        <div key={group.title} className="flex flex-col gap-1">
          {group.title && (
            <p className="px-4 pb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {group.title}
            </p>
          )}

          {group.links.map((link) => {
            const isActive = pathname === link.href;
            const isExternal = link.href.startsWith("http");

            return (
              <Link
                key={link.href}
                href={link.href}
                target={isExternal ? "_blank" : undefined}
                className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                {link.name}
                {isExternal}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
