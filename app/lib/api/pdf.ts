const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export interface PdfConversion {
  id: string;
  originalName: string;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
  totalPages?: number;
  error?: string;
  createdAt: string;
  updatedAt: string;
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
    throw new Error(
      body?.message ?? `Không thể upload PDF: ${response.status}`,
    );
  }

  return response.json() as Promise<{ ids: string[] }>;
}

export async function listPdfConversions(): Promise<PdfConversion[]> {
  const response = await fetch(`${API_URL}/pdf`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Không thể lấy danh sách PDF: ${response.status}`);
  }

  return response.json() as Promise<PdfConversion[]>;
}
