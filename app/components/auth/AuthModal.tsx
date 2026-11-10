"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

// Khung popup cho login/register khi mở từ trong dashboard
export default function AuthModal({ children }: { children: ReactNode }) {
  const router = useRouter();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="panel w-full max-w-sm p-5">
        <div className="mb-4 flex justify-end">
          <button
            type="button"
            className="btn btn-sm"
            onClick={() => router.back()}
          >
            Close
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
