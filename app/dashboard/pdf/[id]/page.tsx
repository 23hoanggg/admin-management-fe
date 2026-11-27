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
import StatusBadge from "@/app/components/StatusBadge";
import DeleteButton from "@/app/components/DeleteButton";
import { getNgDetails, PdfViewer } from "@/features/pdf";

export default function PdfDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: pdf,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["pdf", "detail", id],
    queryFn: () => getPdfConversion(id),
    // refetch while converting images or RunPod is analyzing
    refetchInterval: (query) => {
      const data = query.state.data;
      const isWorking =
        data?.status === "PENDING" ||
        data?.status === "PROCESSING" ||
        data?.runpodJobStatus === "PROCESSING";
      return isWorking ? 3000 : false;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deletePdfConversion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pdf"] });
      router.push("/dashboard/pdf");
    },
  });

  if (isPending)
    return <p className="text-sm text-muted-foreground">Loading…</p>;
  if (isError)
    return <p className="text-sm text-destructive">{error.message}</p>;

  const totalPages = pdf.pages.length;
  const imageUrl = pdfPageUrl(pdf.id, currentPage);
  const details = getNgDetails(pdf.detailsJson);

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

        <DeleteButton
          itemName={pdf.originalName}
          disabled={
            pdf.status === "PROCESSING" || pdf.runpodJobStatus === "PROCESSING"
          }
          onConfirm={() => deleteMutation.mutateAsync()}
        />
      </div>

      {/* Thông tin file */}
      <section className="panel grid grid-cols-5 divide-x">
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
        <div className="px-4 py-3">
          <p className="text-xs text-muted-foreground">Analysis</p>
          <StatusBadge status={pdf.runpodJobStatus} />
          {pdf.fileOverall && (
            <span className="ml-2 text-sm font-medium">{pdf.fileOverall}</span>
          )}
        </div>
      </section>

      {pdf.error && <p className="text-sm text-destructive">{pdf.error}</p>}
      {pdf.outputError && (
        <p className="text-sm text-destructive">{pdf.outputError}</p>
      )}

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
              <a href={imageUrl} target="blank" className="btn btn-sm">
                Open full size
              </a>
              <a href={`${imageUrl}?download=true`} className="btn btn-sm">
                Download
              </a>
            </div>
          </div>

          <div className="flex h-[70vh]">
            {/* list anh */}
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

            <PdfViewer
              imageUrl={imageUrl}
              page={currentPage}
              details={details}
            />
          </div>
        </section>
      )}
    </div>
  );
}
