const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

// Giới hạn giống gateway (manage-workspace/apps/gateway/src/pdf/pdf.controller.ts)
export const PDF_MAX_FILES = 10;
export const PDF_MAX_SIZE_MB = 20;

export type PdfStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";

export interface PdfPage {
  pageNumber: number;
  size: number; // bytes
}

export interface PdfConversion {
  id: string;
  originalName: string;
  status: PdfStatus;
  totalPages?: number;
  error?: string;
  createdAt: string;
  updatedAt: string;
  pages: PdfPage[];
}

export interface PdfListResponse {
  conversions: PdfConversion[];
  total: number;
  page: number;
  pageSize: number;
}

export function pdfPageUrl(id: string, pageNumber: number) {
  return `${API_URL}/pdf/${id}/pages/${pageNumber}`;
}

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

export async function listPdfConversions(
  page: number,
  pageSize: number,
  status = "",
  search = "",
): Promise<PdfListResponse> {
  const query = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
    status,
    search,
  });

  const response = await fetch(`${API_URL}/pdf?${query}`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Could not load PDF files: ${response.status}`);
  }

  return response.json();
}

export async function getPdfConversion(id: string): Promise<PdfConversion> {
  const response = await fetch(`${API_URL}/pdf/${id}`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Could not load PDF file: ${response.status}`);
  }

  return response.json();
}

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
