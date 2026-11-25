"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

interface DashboardLayoutProps {
  children: ReactNode;
  sidebar: ReactNode;
  activity: ReactNode;
  user: ReactNode;
  admin: ReactNode;
  modal: ReactNode;
}

export default function DashboardLayout({
  children,
  sidebar,
  activity,
  user,
  admin,
  modal,
}: DashboardLayoutProps) {
  const pathname = usePathname();
  const isDashboardHome = pathname === "/dashboard";

  return (
    <div className="flex h-dvh overflow-hidden">
      <aside className="flex w-56 shrink-0 flex-col border-r bg-card">
        {sidebar}
      </aside>

      <main className="min-w-0 flex-1 overflow-y-auto p-6">
        {isDashboardHome ? (
          <div className="grid h-full min-h-140 grid-cols-[minmax(0,1fr)_minmax(380px,520px)] grid-rows-[minmax(0,1fr)_auto] gap-4">
            <section className="panel min-h-0 overflow-y-auto">
              {activity}
            </section>

            <section className="panel row-span-2 min-h-0 overflow-y-auto">
              {user}
            </section>

            <section className="panel">{admin}</section>
          </div>
        ) : (
          <div className="mx-auto max-w-6xl">{children}</div>
        )}
      </main>

      {modal}
    </div>
  );
}
