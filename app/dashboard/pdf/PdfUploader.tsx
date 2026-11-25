"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { uploadPdfs, type PdfConfig } from "@/app/lib/api/pdf";

interface PdfUploaderProps {
  config: PdfConfig;
  onUploaded: () => void;
}

export default function PdfUploader({ config, onUploaded }: PdfUploaderProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [message, setMessage] = useState("");

  const uploadMutation = useMutation({
    mutationFn: uploadPdfs,
    onSuccess: (result) => {
      setFiles([]);
      setMessage(`Uploaded ${result.ids.length} file(s). Converting…`);
      onUploaded();
    },
  });

  function addFiles(fileList: FileList | null) {
    if (!fileList) return;
    setFiles([...files, ...Array.from(fileList)]);
    setMessage("");
  }

  let error = "";
  if (files.length > config.maxFiles) {
    error = `You can upload at most ${config.maxFiles} files at once.`;
  }
  for (const file of files) {
    if (file.size > config.maxFileSizeMb * 1024 * 1024) {
      error = `${file.name} is larger than ${config.maxFileSizeMb} MB.`;
    }
  }

  return (
    <section className="panel">
      <div className="panel-header">
        <h2 className="panel-title">Upload PDF</h2>
        <span className="text-xs text-muted-foreground">
          Max {config.maxFiles} files, {config.maxFileSizeMb} MB each
        </span>
      </div>

      <div className="space-y-3 p-4">
        {/* Bấm để chọn file, hoặc kéo thả file*/}
        <label
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();
            addFiles(event.dataTransfer.files);
          }}
          className="block cursor-pointer rounded-md border border-dashed border-input px-4 py-6 text-center text-sm hover:bg-muted"
        >
          PDF file
          <input
            type="file"
            accept="application/pdf"
            multiple
            className="hidden"
            onChange={(event) => {
              addFiles(event.target.files);
              event.target.value = "";
            }}
          />
        </label>

        {/* Danh sách file đã chọn */}
        {files.length > 0 && (
          <ul className="divide-y rounded-md border">
            {files.map((file, index) => (
              <li
                key={index}
                className="flex items-center justify-between px-3 py-2 text-sm"
              >
                <span>{file.name}</span>
                <span className="flex items-center gap-3 text-xs text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(1)} MB
                  <button
                    type="button"
                    className="btn btn-sm"
                    onClick={() =>
                      setFiles(files.filter((_, i) => i !== index))
                    }
                  >
                    Remove
                  </button>
                </span>
              </li>
            ))}
          </ul>
        )}

        {error && <p className="text-sm text-destructive">{error}</p>}
        {uploadMutation.isError && (
          <p className="text-sm text-destructive">
            {uploadMutation.error.message}
          </p>
        )}
        {message && <p className="text-sm text-success">{message}</p>}

        {files.length > 0 && (
          <div className="flex justify-end gap-2">
            <button type="button" className="btn" onClick={() => setFiles([])}>
              Clear
            </button>
            <button
              type="button"
              className="btn btn-primary"
              disabled={error !== "" || uploadMutation.isPending}
              onClick={() => uploadMutation.mutate(files)}
            >
              {uploadMutation.isPending
                ? "Uploading…"
                : `Upload ${files.length} file(s)`}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
