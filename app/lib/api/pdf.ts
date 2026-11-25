import { API_URL } from "@/app/lib/config";

export interface PdfPage {
  pageNumber: number;
  size: number;
}

export interface PdfConversion {
  id: string;
  originalName: string;
  status: string;
  totalPages?: number;
  error?: string;
  createdAt: string;
  updatedAt: string;
  pages: PdfPage[];
  // runpod
  runpodJobStatus: string;
  fileOverall?: string;
  outputError?: string;
  detailsJson?: string;
}

export interface PdfListResponse {
  conversions: PdfConversion[];
  total: number;
  page: number;
  pageSize: number;
}

export interface PdfConfig {
  maxFiles: number;
  maxFileSizeMb: number;
  statuses: string[];
}

// GET /pdf/config: upload limits + status list
export async function getPdfConfig(): Promise<PdfConfig> {
  const response = await fetch(`${API_URL}/pdf/config`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Could not load PDF config: ${response.status}`);
  }

  return response.json();
}

// url of 1 page image (GET /pdf/:id/pages/:page)
export function pdfPageUrl(id: string, pageNumber: number) {
  return `${API_URL}/pdf/${id}/pages/${pageNumber}`;
}

// POST /pdf/to-images: upload pdf files
export async function uploadPdfs(files: File[]): Promise<{ ids: string[] }> {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  const response = await fetch(`${API_URL}/pdf/to-images`, {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.message ?? `Upload failed: ${response.status}`);
  }

  return response.json();
}

// GET /pdf: list pdf files (paging, filter, search)
export async function listPdfConversions(
  page: number,
  pageSize: number,
  status = "",
  search = "",
): Promise<PdfListResponse> {
  const query = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  });
  if (status) query.set("status", status);
  if (search) query.set("search", search);

  const response = await fetch(`${API_URL}/pdf?${query}`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Could not load PDF files: ${response.status}`);
  }

  return response.json();
}

// GET /pdf/:id: pdf detail (pages + runpod result)
export async function getPdfConversion(id: string): Promise<PdfConversion> {
  const response = await fetch(`${API_URL}/pdf/${id}`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Could not load PDF file: ${response.status}`);
  }

  return response.json();
}

// DELETE /pdf/:id: delete pdf file
export async function deletePdfConversion(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/pdf/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.message ?? `Delete failed: ${response.status}`);
  }
}
