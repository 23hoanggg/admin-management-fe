import type { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
  sidebar: ReactNode;
  activity: ReactNode;
  user: ReactNode;
  admin: ReactNode;
  modal: ReactNode;
}

export default function DashboardLayout({
  sidebar,
  activity,
  user,
  admin,
  modal,
}: DashboardLayoutProps) {
  return (
    <div className="h-screen p-6">
      <div className="mx-auto max-w-7xl space-y-4">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
          <aside className="rounded border bg-white p-4 lg:col-span-1">
            {sidebar}
          </aside>

          <main className="rounded border bg-white p-4 lg:col-span-2">
            {activity}
          </main>

          <section className="rounded border bg-white p-4 lg:col-span-1">
            {user}
          </section>
        </div>

        <section className="rounded border bg-white p-4">{admin}</section>
      </div>

      {modal}
    </div>
  );
}
