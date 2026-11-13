"use client";

// LLM: Provides a form for creating and editing tasks.

import { useState } from "react";
import { createTask, updateTask } from "@/lib/api";
import type { Task, TaskStatus } from "@/types/task";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface TaskFormProps {
  task?: Task;
  onTaskSaved: () => void;
  onCancel: () => void;
}

export default function TaskForm({
  task,
  onTaskSaved,
  onCancel,
}: TaskFormProps) {
  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [status, setStatus] = useState<TaskStatus>(task?.status ?? "TODO");
  const [dueDate, setDueDate] = useState(task?.dueDate ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // LLM: Validates the title and submits the new task to the API.
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim()) {
      setError("Please enter a task title.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (task) {
        await updateTask(task.id, {
            title: title.trim(),
            description: description.trim() || undefined,
            status,
            dueDate: dueDate || undefined,
        });

        toast.success("Task updated successfully.");
        } else {
            await createTask({
                title: title.trim(),
                description: description.trim() || undefined,
                status,
                dueDate: dueDate || undefined,
            });

            toast.success("Task created successfully.");
        }

        onTaskSaved();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create task.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="title">LLM Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Enter task title"
          maxLength={150}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">LLM Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Add some details (optional)"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">LLM Status</Label>
        <select
          id="status"
          value={status}
          onChange={(event) => setStatus(event.target.value as TaskStatus)}
          className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DONE">Done</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="dueDate">LLM Due Date</Label>
        <Input
          id="dueDate"
          type="date"
          value={dueDate}
          onChange={(event) => setDueDate(event.target.value)}
        />
      </div>

      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
            {loading
                ? task
                ? "Saving..."
                : "Creating..."
                : task
                ? "Save Changes"
                : "Create Task"}
        </Button>
      </div>
    </form>
  );
}