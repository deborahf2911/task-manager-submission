// LLM: Provides functions for communicating with the task management API.

import type { Task, TaskStatus } from "@/types/task";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not configured.");
}

// LLM: Retrieves all tasks from the API.
export async function getTasks(): Promise<Task[]> {
  const response = await fetch(`${API_URL}/tasks`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch tasks.");
  }

  return response.json();
}

// LLM: Creates a new task through the API.
export async function createTask(data: {
  title: string;
  description?: string;
  status?: TaskStatus;
  dueDate?: string;
}): Promise<Task> {
  const response = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create task.");
  }

  return response.json();
}

// LLM: Updates an existing task through the API.
export async function updateTask(
  id: number,
  data: {
    title?: string;
    description?: string | null;
    status?: TaskStatus;
    dueDate?: string | null;
  },
): Promise<Task> {
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update task.");
  }

  return response.json();
}

// LLM: Deletes a task through the API.
export async function deleteTask(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete task.");
  }
}