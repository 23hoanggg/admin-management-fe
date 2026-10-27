import type { ShelfItem } from "@/features/shelves/types/shelf";

export interface Job {
  id: string;
  name: string;
  description: string | null;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
  createdAt: string;
  updatedAt: string;
  _count?: {
    shelves: number;
  };
}

export interface CreateJobInput {
  name: string;
  description?: string;
}

export interface EditorImage {
  storageKey: string;
  width: number;
  height: number;
}

export interface EditorData {
  image: EditorImage;
  items: ShelfItem[];
}

const API_URL = process.env.NEXT_PUBLIC_IMAGE_URL ?? "http://localhost:6869";

export async function listJobs(): Promise<Job[]> {
  const response = await fetch(`${API_URL}/jobs`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Không thể lấy danh sách Jobs: ${response.status}`);
  }

  return response.json() as Promise<Job[]>;
}

export async function getJob(id: string): Promise<Job> {
  const response = await fetch(`${API_URL}/jobs/${encodeURIComponent(id)}`, {
    credentials: "include",
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Không thể lấy Job: ${response.status}`);
  }

  return response.json() as Promise<Job>;
}

export async function createJob(input: CreateJobInput): Promise<Job> {
  const response = await fetch(`${API_URL}/jobs`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Không thể tạo Job: ${response.status}`);
  }

  return response.json() as Promise<Job>;
}

export async function getJobEditor(id: string): Promise<EditorData> {
  const response = await fetch(
    `${API_URL}/jobs/${encodeURIComponent(id)}/editor`,
    { credentials: "include" },
  );

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(
      body?.message ?? `Không thể lấy dữ liệu editor: ${response.status}`,
    );
  }

  return response.json() as Promise<EditorData>;
}

export interface UpdateItemInput {
  name?: string;
  shelf_digit?: string;
  polygon?: { x: number; y: number }[];
}

export async function updateJobItem(
  jobId: string,
  itemId: string,
  input: UpdateItemInput,
): Promise<ShelfItem> {
  const response = await fetch(
    `${API_URL}/jobs/${encodeURIComponent(jobId)}/items/${encodeURIComponent(itemId)}`,
    {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    },
  );

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const message = Array.isArray(body?.message)
      ? body.message.join(", ")
      : body?.message;
    throw new Error(message ?? `Không thể lưu: ${response.status}`);
  }

  return response.json() as Promise<ShelfItem>;
}
