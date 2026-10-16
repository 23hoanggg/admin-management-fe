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
    <div className="h-dvh overflow-hidden bg-gray-50 p-3">
      <div className="mx-auto flex h-full max-w-[1800px] gap-3">
        <aside className="min-h-0 w-[200px] shrink-0 overflow-y-auto rounded-xl border border-gray-200 bg-white p-3">
          {sidebar}
        </aside>

        <div className="min-h-0 min-w-0 flex-1">
          {isDashboardHome ? (
            <div className="grid h-full min-h-0 grid-cols-[minmax(0,1fr)_minmax(380px,520px)] grid-rows-[minmax(0,1fr)_minmax(180px,auto)] gap-3">
              {/* Activity */}
              <section className="min-h-0 min-w-0 overflow-y-auto rounded-xl border border-gray-200 bg-white p-4">
                {activity}
              </section>

              {/* User */}
              <section className="row-span-2 min-h-0 min-w-0 overflow-x-hidden overflow-y-auto rounded-xl border border-gray-200 bg-white p-4">
                {user}
              </section>

              {/* Admin */}
              <section className="min-h-0 min-w-0 overflow-y-auto rounded-xl border border-gray-200 bg-white p-4">
                {admin}
              </section>
            </div>
          ) : (
            <main className="h-full min-h-0 min-w-0 overflow-auto rounded-xl border border-gray-200 bg-white p-4">
              {children}
            </main>
          )}
        </div>
      </div>

      {modal}
    </div>
  );
}
