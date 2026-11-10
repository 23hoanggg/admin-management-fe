"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/app/components/ThemeToggle";

const groups = [
  {
    title: "",
    links: [{ name: "Dashboard", href: "/dashboard" }],
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
    links: [{ name: "PDF", href: "/dashboard/pdf" }],
  },
];

export default function SidebarSlot() {
  const pathname = usePathname();

  return (
    <>
      <div className="flex h-14 items-center border-b px-5 font-semibold">
        Management
      </div>

      <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
        {groups.map((group) => (
          <div key={group.title}>
            {group.title && (
              <p className="px-2 pb-1 text-xs text-muted-foreground">
                {group.title}
              </p>
            )}

            {group.links.map((link) => {
              const isActive =
                link.href === "/dashboard"
                  ? pathname === link.href
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block rounded-md px-2 py-1.5 text-sm ${
                    isActive
                      ? "bg-accent font-medium text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="border-t p-3">
        <ThemeToggle />
      </div>
    </>
  );
}
