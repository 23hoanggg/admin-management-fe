import type { ShelfItem } from "@/features/shelves/types/shelf";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export interface Job {
  id: string;
  name: string;
  description?: string;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
  createdAt: string;
  updatedAt: string;
  shelfCount: number;
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

export async function listJobs(): Promise<Job[]> {
  const response = await fetch(`${API_URL}/jobs`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Could not load jobs: ${response.status}`);
  }

  return response.json() as Promise<Job[]>;
}

export async function getJob(id: string): Promise<Job> {
  const response = await fetch(`${API_URL}/jobs/${encodeURIComponent(id)}`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Could not load job: ${response.status}`);
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
    throw new Error(`Could not create job: ${response.status}`);
  }

  return response.json() as Promise<Job>;
}

export async function getJobEditor(id: string): Promise<EditorData> {
  const response = await fetch(
    `${API_URL}/jobs/${encodeURIComponent(id)}/editor`,
    { credentials: "include" },
  );

  if (!response.ok) {
    throw new Error(`Could not load editor data: ${response.status}`);
  }

  return response.json() as Promise<EditorData>;
}

export interface UpdateItemInput {
  name?: string;
  shelfDigit?: string;
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
    throw new Error(`Could not save: ${response.status}`);
  }

  return response.json() as Promise<ShelfItem>;
}
