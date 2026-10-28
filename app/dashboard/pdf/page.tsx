"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { listPdfConversions, uploadPdfs } from "@/app/lib/api/pdf";

export default function PdfUploadPage() {
  const queryClient = useQueryClient();
  const [files, setFiles] = useState<File[]>([]);

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["pdf"],
    queryFn: listPdfConversions,
  });

  const uploadMutation = useMutation({
    mutationFn: uploadPdfs,
    onSuccess: async () => {
      setFiles([]);
      await queryClient.invalidateQueries({ queryKey: ["pdf"] });
    },
  });

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (files.length === 0) return;
    uploadMutation.mutate(files);
    event.currentTarget.reset();
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-xl font-bold">Upload PDF</h1>

      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          type="file"
          accept="application/pdf"
          multiple
          onChange={(event) => setFiles(Array.from(event.target.files ?? []))}
          className="text-sm file:mr-3 file:rounded-md file:border file:bg-card file:px-3 file:py-1.5 file:text-sm"
        />

        <button
          type="submit"
          disabled={files.length === 0 || uploadMutation.isPending}
          className="rounded-md border px-3 py-1.5 text-sm hover:bg-accent disabled:opacity-50"
        >
          {uploadMutation.isPending ? "Uploading..." : "Upload"}
        </button>
      </form>

      {uploadMutation.isError && (
        <p role="alert" className="text-sm text-destructive">
          {uploadMutation.error.message}
        </p>
      )}

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Files</h2>
          {/* <button
            type="button"
            onClick={() => refetch()}
            className="text-sm underline"
          >
            Refresh
          </button> */}
        </div>

        {isPending && (
          <p className="text-sm text-muted-foreground">Loading...</p>
        )}

        {isError && (
          <p role="alert" className="text-sm text-destructive">
            {error.message}
          </p>
        )}

        {data?.length === 0 && (
          <p className="text-sm text-muted-foreground">No files yet.</p>
        )}

        {data && data.length > 0 && (
          <ul className="divide-y rounded-md border">
            {data.map((conversion) => (
              <li
                key={conversion.id}
                className="flex items-center justify-between gap-4 px-3 py-2 text-sm"
              >
                <span className="truncate">{conversion.originalName}</span>
                <span className="shrink-0 text-muted-foreground">
                  {conversion.status}
                  {conversion.totalPages !== null &&
                    ` - ${conversion.totalPages} pages`}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
