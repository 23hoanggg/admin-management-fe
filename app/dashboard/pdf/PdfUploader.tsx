"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { PDF_MAX_FILES, PDF_MAX_SIZE_MB, uploadPdfs } from "@/app/lib/api/pdf";

// Kiểm tra file trước khi gửi. Trả về câu báo lỗi, hoặc "" nếu hợp lệ
function validateFiles(files: File[]) {
  if (files.length > PDF_MAX_FILES) {
    return `You can upload at most ${PDF_MAX_FILES} files at once.`;
  }
  for (const file of files) {
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      return `${file.name} is not a PDF file.`;
    }
    if (file.size > PDF_MAX_SIZE_MB * 1024 * 1024) {
      return `${file.name} is larger than ${PDF_MAX_SIZE_MB} MB.`;
    }
  }
  return "";
}

export default function PdfUploader({
  onUploaded,
}: {
  onUploaded: () => void;
}) {
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

  const error = validateFiles(files);

  return (
    <section className="panel">
      <div className="panel-header">
        <h2 className="panel-title">Upload PDF</h2>
        <span className="text-xs text-muted-foreground">
          Max {PDF_MAX_FILES} files, {PDF_MAX_SIZE_MB} MB each
        </span>
      </div>

      <div className="space-y-3 p-4">
        {/* Bấm để chọn file, hoặc kéo thả file vào ô này */}
        <label
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();
            addFiles(event.dataTransfer.files);
          }}
          className="block cursor-pointer rounded-md border border-dashed border-input px-4 py-6 text-center text-sm hover:bg-muted"
        >
          Drop PDF files here, or{" "}
          <span className="font-medium underline">browse</span>
          <input
            type="file"
            accept=".pdf"
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
