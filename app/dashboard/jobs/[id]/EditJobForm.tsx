"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type Job, updateJob } from "@/app/lib/api/jobs";

// Form sửa tên / mô tả job (chỉ admin thấy)
export default function EditJobForm({
  job,
  onDone,
}: {
  job: Job;
  onDone: () => void;
}) {
  const queryClient = useQueryClient();
  const [name, setName] = useState(job.name);
  const [description, setDescription] = useState(job.description ?? "");

  const mutation = useMutation({
    mutationFn: () =>
      updateJob(job.id, { name: name.trim(), description: description.trim() }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      onDone();
    },
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    mutation.mutate();
  }

  return (
    <form onSubmit={handleSubmit} className="panel flex items-end gap-3 p-4">
      <div className="flex-1">
        <label htmlFor="edit-job-name" className="label">
          Name
        </label>
        <input
          id="edit-job-name"
          className="input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="flex-2">
        <label htmlFor="edit-job-description" className="label">
          Description
        </label>
        <input
          id="edit-job-description"
          className="input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <button
        type="submit"
        className="btn btn-primary"
        disabled={mutation.isPending || !name.trim()}
      >
        Save
      </button>
      <button type="button" className="btn" onClick={onDone}>
        Cancel
      </button>
      {mutation.isError && (
        <p className="text-sm text-destructive">{mutation.error.message}</p>
      )}
    </form>
  );
}
