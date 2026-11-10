"use client";

import Link from "next/link";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deletePdfConversion,
  getPdfConversion,
  pdfPageUrl,
} from "@/app/lib/api/pdf";
import { authClient } from "@/app/lib/auth-client";
import StatusBadge from "@/app/components/StatusBadge";

export default function PdfDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session } = authClient.useSession();
  const isAdmin = session?.user?.role === "admin";

  // Trang PDF đang xem (bắt đầu từ 1)
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: pdf,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["pdf", "detail", id],
    queryFn: () => getPdfConversion(id),
    // Tự tải lại mỗi 3 giây để thấy trạng thái convert mới nhất
    refetchInterval: 3000,
  });

  const deleteMutation = useMutation({
    mutationFn: () => deletePdfConversion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pdf"] });
      router.push("/dashboard/pdf");
    },
    onError: (err) => alert(err.message),
  });

  if (isPending)
    return <p className="text-sm text-muted-foreground">Loading…</p>;
  if (isError)
    return <p className="text-sm text-destructive">{error.message}</p>;

  const totalPages = pdf.pages.length;
  const imageUrl = pdfPageUrl(pdf.id, currentPage);

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <Link
            href="/dashboard/pdf"
            className="text-xs text-muted-foreground hover:underline"
          >
            ← PDF to images
          </Link>
          <h1 className="text-lg font-semibold">{pdf.originalName}</h1>
        </div>

        {isAdmin && (
          <button
            type="button"
            className="btn btn-danger"
            disabled={pdf.status === "PROCESSING"}
            onClick={() => {
              if (confirm(`Delete "${pdf.originalName}"?`))
                deleteMutation.mutate();
            }}
          >
            Delete
          </button>
        )}
      </div>

      {/* Thông tin file */}
      <section className="panel grid grid-cols-4 divide-x">
        <div className="px-4 py-3">
          <p className="text-xs text-muted-foreground">Status</p>
          <StatusBadge status={pdf.status} />
        </div>
        <div className="px-4 py-3">
          <p className="text-xs text-muted-foreground">Pages</p>
          <p className="text-sm font-medium">{pdf.totalPages ?? "–"}</p>
        </div>
        <div className="px-4 py-3">
          <p className="text-xs text-muted-foreground">Uploaded</p>
          <p className="text-sm font-medium">
            {new Date(pdf.createdAt).toLocaleString("en-GB")}
          </p>
        </div>
        <div className="px-4 py-3">
          <p className="text-xs text-muted-foreground">Updated</p>
          <p className="text-sm font-medium">
            {new Date(pdf.updatedAt).toLocaleString("en-GB")}
          </p>
        </div>
      </section>

      {pdf.error && <p className="text-sm text-destructive">{pdf.error}</p>}

      {/* Xem từng trang */}
      {totalPages > 0 && (
        <section className="panel">
          <div className="panel-header">
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="btn btn-sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </button>
              <span className="text-sm">
                Page {currentPage} / {totalPages}
              </span>
              <button
                type="button"
                className="btn btn-sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </button>
            </div>

            <div className="flex gap-2">
              <a href={imageUrl} target="_blank" className="btn btn-sm">
                Open full size
              </a>
              <a href={imageUrl} download className="btn btn-sm">
                Download
              </a>
            </div>
          </div>

          <div className="flex h-[70vh]">
            {/* Danh sách trang bên trái */}
            <div className="w-28 shrink-0 space-y-3 overflow-y-auto border-r bg-muted p-3">
              {pdf.pages.map((page) => (
                <button
                  key={page.pageNumber}
                  type="button"
                  onClick={() => setCurrentPage(page.pageNumber)}
                  className="block w-full text-center text-xs"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={pdfPageUrl(pdf.id, page.pageNumber)}
                    alt={`Page ${page.pageNumber}`}
                    loading="lazy"
                    className={`w-full border bg-card ${
                      page.pageNumber === currentPage
                        ? "border-2 border-foreground"
                        : ""
                    }`}
                  />
                  {page.pageNumber}
                </button>
              ))}
            </div>

            {/* Ảnh trang đang chọn */}
            <div className="flex flex-1 items-center justify-center overflow-auto bg-muted p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt={`Page ${currentPage}`}
                className="max-h-full max-w-full border bg-white"
              />
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
