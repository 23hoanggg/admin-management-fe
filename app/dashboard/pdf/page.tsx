"use client";

import Link from "next/link";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deletePdfConversion,
  getPdfConfig,
  listPdfConversions,
} from "@/app/lib/api/pdf";
import Pagination from "@/app/components/Pagination";
import StatusBadge from "@/app/components/StatusBadge";
import DeleteButton from "@/app/components/DeleteButton";
import PdfUploader from "./PdfUploader";

const PAGE_SIZE = 7;

export default function PdfListPage() {
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const { data: config } = useQuery({
    queryKey: ["pdf", "config"],
    queryFn: getPdfConfig,
  });

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["pdf", "list", page, status, search],
    queryFn: () => listPdfConversions(page, PAGE_SIZE, status, search),
    refetchInterval: (query) => {
      const pdfs = query.state.data?.conversions ?? [];
      const converting = pdfs.some(
        (pdf) => pdf.status === "PENDING" || pdf.status === "PROCESSING",
      );
      return converting ? 1000 : false;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deletePdfConversion,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["pdf"] }),
  });

  function handleSearch(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setSearch(searchInput.trim());
    setPage(1);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold">PDF to images</h1>
      </div>

      {config && (
        <PdfUploader
          config={config}
          onUploaded={() => {
            setPage(1);
            queryClient.invalidateQueries({ queryKey: ["pdf"] });
          }}
        />
      )}

      <section className="panel">
        <div className="panel-header">
          <h2 className="panel-title">Files</h2>

          <form onSubmit={handleSearch} className="flex gap-2">
            <select
              value={status}
              onChange={(event) => {
                setStatus(event.target.value);
                setPage(1);
              }}
              className="input w-36"
            >
              <option value="">All statuses</option>
              {config?.statuses.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
            <input
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="File name"
              className="input w-48"
            />
            <button type="submit" className="btn">
              Search
            </button>
          </form>
        </div>

        {isPending && (
          <p className="p-4 text-sm text-muted-foreground">Loading…</p>
        )}
        {isError && (
          <p className="p-4 text-sm text-destructive">{error.message}</p>
        )}

        {data && (
          <table className="table">
            <thead>
              <tr>
                <th>File name</th>
                <th>Status</th>
                <th className="text-right">Pages</th>
                <th>Uploaded</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.conversions.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="py-8 text-center text-muted-foreground"
                  >
                    No files found.
                  </td>
                </tr>
              )}

              {data.conversions.map((pdf) => (
                <tr key={pdf.id}>
                  <td>
                    <Link
                      href={`/dashboard/pdf/${pdf.id}`}
                      className="font-medium hover:underline"
                    >
                      {pdf.originalName}
                    </Link>
                    {pdf.error && (
                      <p className="text-xs text-destructive">{pdf.error}</p>
                    )}
                  </td>
                  <td>
                    <StatusBadge status={pdf.status} />
                  </td>
                  <td className="text-right">{pdf.totalPages ?? "–"}</td>
                  <td className="text-muted-foreground">
                    {new Date(pdf.createdAt).toLocaleString("en-GB")}
                  </td>
                  <td>
                    <div className="flex justify-end gap-1.5">
                      <Link
                        href={`/dashboard/pdf/${pdf.id}`}
                        className="btn btn-sm"
                      >
                        View
                      </Link>
                      <DeleteButton
                        itemName={pdf.originalName}
                        disabled={pdf.status === "PROCESSING"}
                        onConfirm={() => deleteMutation.mutateAsync(pdf.id)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {data && (
          <Pagination
            page={page}
            pageSize={PAGE_SIZE}
            total={data.total}
            onPageChange={setPage}
          />
        )}
      </section>
    </div>
  );
}
