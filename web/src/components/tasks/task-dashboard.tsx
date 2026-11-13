"use client";

// LLM: Displays the task dashboard and manages loading, error, and task-list states.

import { useCallback, useEffect, useState } from "react";
import { getTasks } from "@/lib/api";
import { Button } from "@/components/ui/button";
import TaskForm from "@/components/tasks/task-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Task } from "@/types/task";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function TaskDashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // LLM: Loads tasks from the API and updates the dashboard state.
  const loadTasks = useCallback(async () => {
    try {
        const data = await getTasks();
        setTasks(data);
        setError(null);
    } catch (err) {
        setError(
            err instanceof Error ? err.message : "Something went wrong.",
        );
    } finally {
        setLoading(false);
    }
  }, []);
  
  // LLM: Loads tasks from the API when the dashboard first renders.
  useEffect(() => {
    let isActive = true;
    
    getTasks()
        .then((data) => {
            if (isActive) {
                setTasks(data);
                setError(null);
            }
        })
        .catch((err) => {
            if (isActive) {
                setError(
                err instanceof Error ? err.message : "Something went wrong.",
            );
            }
        })
        .finally(() => {
            if (isActive) {
                setLoading(false);
            }
        });

    return () => {
        isActive = false;
    };
  }, []);

  // LLM: Closes the creation dialog and refreshes the task list.
  async function handleTaskCreated() {
    setIsCreateOpen(false);
    await loadTasks();
  }

  // LLM: Returns a visual badge for the task's current status.
  function getStatusBadge(status: Task["status"]) {
    const variants = {
      TODO: "secondary",
      IN_PROGRESS: "default",
      DONE: "outline",
    } as const;

    const labels = {
      TODO: "To Do",
      IN_PROGRESS: "In Progress",
      DONE: "Done",
    };

    return <Badge variant={variants[status]}>{labels[status]}</Badge>;
  }

  return (
    <main className="min-h-screen bg-muted/40 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">LLM Tasks</h1>
                <p className="mt-2 text-muted-foreground">
                Organise your work and keep track of what needs to get done.
                </p>
            </div>

            <Button onClick={() => setIsCreateOpen(true)}>
                Create Task
            </Button>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>LLM Task List</CardTitle>
            <CardDescription>
              View and manage all your tasks in one place.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {loading ? (
              <p className="py-8 text-center text-muted-foreground">
                Loading tasks...
              </p>
            ) : error ? (
              <p className="py-8 text-center text-destructive">{error}</p>
            ) : tasks.length === 0 ? (
              <p className="py-8 text-center text-muted-foreground">
                LLM: No tasks yet
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>LLM Task</TableHead>
                    <TableHead>LLM Status</TableHead>
                    <TableHead>LLM Due Date</TableHead>
                    <TableHead>LLM Created</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {tasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell className="font-medium">
                        {task.title}
                        {task.description && (
                          <p className="mt-1 text-sm text-muted-foreground">
                            {task.description}
                          </p>
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(task.status)}</TableCell>
                      <TableCell>
                        {task.dueDate
                          ? new Date(task.dueDate).toLocaleDateString()
                          : "—"}
                      </TableCell>
                      <TableCell>
                        {new Date(task.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogContent>
                <DialogHeader>
                <DialogTitle>LLM Create Task</DialogTitle>
                <DialogDescription>
                    Add a new task to your task list.
                </DialogDescription>
                </DialogHeader>

                <TaskForm
                onTaskCreated={handleTaskCreated}
                onCancel={() => setIsCreateOpen(false)}
                />
            </DialogContent>
        </Dialog>

      </div>
    </main>
  );
}