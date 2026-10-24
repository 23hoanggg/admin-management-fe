"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

interface AuthModalProps {
  children: ReactNode;
}

export default function AuthModal({ children }: AuthModalProps) {
  const router = useRouter();

  const handleClose = () => {
    router.back();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30">
      <div className="w-full max-w-md rounded border bg-card p-6 text-card-foreground">
        <button type="button" onClick={handleClose} className="mb-4">
          Close
        </button>

        {children}
      </div>
    </div>
  );
}
