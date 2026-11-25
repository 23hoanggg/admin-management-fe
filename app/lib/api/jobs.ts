import type { ShelfItem } from "@/features/shelves/types/shelf";

import { API_URL } from "@/app/lib/config";

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

// GET /jobs: list jobs
export async function listJobs(): Promise<Job[]> {
  const response = await fetch(`${API_URL}/jobs`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Could not load jobs: ${response.status}`);
  }

  return response.json() as Promise<Job[]>;
}

// GET /jobs/:id: job detail
export async function getJob(id: string): Promise<Job> {
  const response = await fetch(`${API_URL}/jobs/${encodeURIComponent(id)}`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Could not load job: ${response.status}`);
  }

  return response.json() as Promise<Job>;
}

// POST /jobs: create job
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

// GET /jobs/:id/editor: image + items for shelf editor
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

// PATCH /jobs/:id/items/:itemId: update 1 item (name, shelf, polygon)
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

// Sửa / xoá job - admin

// PATCH /jobs/:id: update job
export async function updateJob(
  id: string,
  input: { name: string; description: string },
): Promise<Job> {
  const response = await fetch(`${API_URL}/jobs/${encodeURIComponent(id)}`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error(`Could not update job: ${response.status}`);
  }

  return response.json() as Promise<Job>;
}

// DELETE /jobs/:id: delete job
export async function deleteJob(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/jobs/${encodeURIComponent(id)}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Could not delete job: ${response.status}`);
  }
}

export interface Shelf {
  id: string;
  name: string;
  status: string;
  jobId: string;
  createdAt: string;
  updatedAt: string;
}

function shelfUrl(jobId: string, shelfId?: string) {
  const base = `${API_URL}/jobs/${encodeURIComponent(jobId)}/shelves`;
  return shelfId ? `${base}/${encodeURIComponent(shelfId)}` : base;
}

// GET /jobs/:id/shelves: list shelves of a job
export async function listShelves(jobId: string): Promise<Shelf[]> {
  const response = await fetch(shelfUrl(jobId), { credentials: "include" });

  if (!response.ok) {
    throw new Error(`Could not load shelves: ${response.status}`);
  }

  return response.json() as Promise<Shelf[]>;
}

// PATCH /jobs/:id/shelves/:shelfId: update shelf
export async function updateShelf(
  jobId: string,
  shelfId: string,
  name: string,
): Promise<Shelf> {
  const response = await fetch(shelfUrl(jobId, shelfId), {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });

  if (!response.ok) {
    throw new Error(`Could not rename shelf: ${response.status}`);
  }

  return response.json() as Promise<Shelf>;
}

// DELETE /jobs/:id/shelves/:shelfId: delete shelf
export async function deleteShelf(
  jobId: string,
  shelfId: string,
): Promise<void> {
  const response = await fetch(shelfUrl(jobId, shelfId), {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Could not delete shelf: ${response.status}`);
  }
}
