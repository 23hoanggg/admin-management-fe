"use client";

import Link from "next/link";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deletePdfConversion, listPdfConversions } from "@/app/lib/api/pdf";
import { authClient } from "@/app/lib/auth-client";
import Pagination from "@/app/components/Pagination";
import StatusBadge from "@/app/components/StatusBadge";
import PdfUploader from "./PdfUploader";

const PAGE_SIZE = 10;

export default function PdfListPage() {
  const queryClient = useQueryClient();
  const { data: session } = authClient.useSession();
  const isAdmin = session?.user?.role === "admin";

  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["pdf", "list", page, status, search],
    queryFn: () => listPdfConversions(page, PAGE_SIZE, status, search),
    refetchInterval: 3000,
  });

  const deleteMutation = useMutation({
    mutationFn: deletePdfConversion,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["pdf"] }),
    onError: (err) => alert(err.message),
  });

  function handleSearch(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setSearch(searchInput.trim());
    setPage(1);
  }

  function handleDelete(id: string, name: string) {
    if (confirm(`Delete "${name}" and all of its images?`)) {
      deleteMutation.mutate(id);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold">PDF to images</h1>
        <p className="text-sm text-muted-foreground">
          Upload PDF files and get every page as a JPEG image.
        </p>
      </div>

      {isAdmin && (
        <PdfUploader
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
              <option value="PENDING">Pending</option>
              <option value="PROCESSING">Processing</option>
              <option value="COMPLETED">Completed</option>
              <option value="FAILED">Failed</option>
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
                  <td className="text-right">
                    <Link
                      href={`/dashboard/pdf/${pdf.id}`}
                      className="btn btn-sm"
                    >
                      View
                    </Link>
                    {isAdmin && (
                      <button
                        type="button"
                        className="btn btn-sm btn-danger ml-1.5"
                        disabled={pdf.status === "PROCESSING"}
                        onClick={() => handleDelete(pdf.id, pdf.originalName)}
                      >
                        Delete
                      </button>
                    )}
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
