"use client";

// LLM: Displays the task dashboard and manages loading, error, and task-list states.

import { useCallback, useEffect, useState } from "react";
import { getTasks, deleteTask } from "@/lib/api";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function TaskDashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

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

  // LLM: Closes the task dialog and refreshes the task list.
  async function handleTaskSaved() {
    setIsTaskDialogOpen(false);
    setSelectedTask(undefined);
    await loadTasks();
  }

  // LLM: Deletes the selected task and refreshes the task list.
  async function handleTaskDeleted() {
    if (!taskToDelete) return;
    
    try {
        setIsDeleting(true);
        
        await deleteTask(taskToDelete.id);
        
        toast.success("Task deleted successfully.");
        setTaskToDelete(null);
        
        await loadTasks();
    } catch (err) {
        toast.error(
            err instanceof Error ? err.message : "Failed to delete task.",
        );
    } finally {
        setIsDeleting(false);
    }
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

  // LLM: Filters tasks by their title, description, and selected status
  const filteredTasks = tasks.filter((task) => {
    const query = searchQuery.toLowerCase().trim();
    
    const matchesSearch =
       task.title.toLowerCase().includes(query) ||
       (task.description?.toLowerCase().includes(query) ?? false);

    const matchesStatus =
       statusFilter === "ALL" || task.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

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

            <Button
                onClick={() => {
                    setSelectedTask(undefined);
                    setIsTaskDialogOpen(true);
                }}
                >
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

          <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="sm:max-w-xs"
            />

            <Select
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value ?? "ALL")}
            >
                <SelectTrigger className="sm:max-w-[180px]">
                <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>
                <SelectItem value="TODO">To Do</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="DONE">Done</SelectItem>
                </SelectContent>
            </Select>
            <div className="flex items-center justify-between gap-3 sm:ml-auto">
                <p className="text-sm text-muted-foreground">
                    Showing {filteredTasks.length} of {tasks.length} tasks
                </p>

                <Button
                    variant="ghost"
                    size="sm"
                    disabled={!searchQuery && statusFilter === "ALL"}
                    onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("ALL");
                    }}
                >
                    Reset
                </Button>
            </div>
          </CardContent>

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
                    <TableHead>LLM Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                    {filteredTasks.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={5}
                                className="py-8 text-center text-muted-foreground"
                            >
                                No tasks match your search or filter.
                            </TableCell>
                        </TableRow>
                    ) : (
                    filteredTasks.map((task) => (
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
                            <TableCell>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                    setSelectedTask(task);
                                    setIsTaskDialogOpen(true);
                                    }}
                                >
                                    Edit
                                </Button>
                                <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => setTaskToDelete(task)}
                                >
                                    Delete
                                </Button>
                            </TableCell>
                        </TableRow>
                        ))
                    )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Dialog
        open={isTaskDialogOpen}
        onOpenChange={setIsTaskDialogOpen}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {selectedTask ? "LLM Edit Task" : "LLM Create Task"}
                    </DialogTitle>
                    <DialogDescription>
                        {selectedTask
                        ? "Update the details of your task."
                        : "Add a new task to your task list."}
                    </DialogDescription>
                </DialogHeader>

                <TaskForm
                key={selectedTask?.id ?? "new-task"}
                task={selectedTask}
                onTaskSaved={handleTaskSaved}
                onCancel={() => {
                    setIsTaskDialogOpen(false);
                    setSelectedTask(undefined);
                }}
                />
            </DialogContent>
        </Dialog>
        <AlertDialog
        open={taskToDelete !== null}
        onOpenChange={(open) => {
            if (!open && !isDeleting) {
            setTaskToDelete(null);
            }
        }}
        >
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        LLM Delete Task
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete &quot;
                        {taskToDelete?.title}
                        &quot;? This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting}>
                        Cancel
                    </AlertDialogCancel>

                    <AlertDialogAction
                        variant="destructive"
                        disabled={isDeleting}
                        onClick={handleTaskDeleted}
                    >
                        {isDeleting ? "Deleting..." : "Delete Task"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
      </div>
    </main>
  );
}