# Task Manager

A full-stack task management application built with **NestJS**, **Next.js App Router**, **TypeScript**, **SQLite**, and **shadcn/ui**.

## Features

- Create, view, edit, and delete tasks.
- Assign a status: To Do, In Progress, or Done.
- Add an optional description and due date.
- Search tasks by title or description.
- Filter tasks by status.
- View task statuses using badges.
- Confirm before deleting a task.
- Receive feedback through toast notifications.
- Validate API input and handle errors.

## Tech Stack

**Backend**
- NestJS
- TypeScript
- TypeORM
- SQLite (`better-sqlite3`)
- `class-validator` and `class-transformer`

**Frontend**
- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- shadcn/ui (Base UI)
- Sonner toast notifications

## Prerequisites

Install the following before running the application:

- [Node.js](https://nodejs.org/) 20.9 or later
- npm (included with Node.js)
- Git

## Getting Started

### 1. Clone the repository

```powershell
git clone https://github.com/deborahf2911/task-manager-submission.git
cd task-manager-submission
```

### 2. Start the backend API

Open a terminal in the repository root and run:

```powershell
cd api
npm install
npm run start:dev
```

The API will start at:

`http://localhost:3000`

The SQLite database (`tasks.sqlite`) is created automatically when the API starts. It is stored in the `api` directory and is excluded from Git.

### 3. Configure and start the frontend

Open a **second terminal** in the repository root and run:

```powershell
cd web
npm install
Copy-Item .env.example .env.local
npm run dev -- --port 3001
```

The frontend will be available at:

`http://localhost:3001`

The frontend uses `NEXT_PUBLIC_API_URL` from `.env.local` to connect to the backend API. The example environment file already contains the local API URL.

Keep both terminals running while using the application.

## API Endpoints

The API is available at `http://localhost:3000`.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/tasks` | Retrieve all tasks |
| GET | `/tasks/:id` | Retrieve a task by ID |
| POST | `/tasks` | Create a task |
| PATCH | `/tasks/:id` | Update a task |
| DELETE | `/tasks/:id` | Delete a task |

### Task Fields

| Field | Type | Description |
|---|---|---|
| `id` | number | Automatically generated task ID |
| `title` | string | Required task title (maximum 150 characters) |
| `description` | string or null | Optional task description |
| `status` | string | `TODO` (To Do), `IN_PROGRESS` (In Progress), or `DONE` (Done) |
| `dueDate` | string or null | Optional due date |
| `createdAt` | date | Automatically generated creation timestamp |

New tasks default to the `TODO` status.

### Example: Create a task

```json
{
  "title": "Complete assignment",
  "description": "Finish the task manager application",
  "status": "IN_PROGRESS",
  "dueDate": "2026-11-20"
}
```

### Validation and Error Handling

- Invalid request data returns **400 Bad Request**.
- Requests for tasks that do not exist return **404 Not Found**.
- The API validates incoming data and rejects unexpected properties.

## Project Structure

```text
task-manager-submission/
├── api/
│   └── src/
│       ├── tasks/
│       │   ├── dto/
│       │   ├── entities/
│       │   ├── tasks.controller.ts
│       │   ├── tasks.service.ts
│       │   └── tasks.module.ts
│       ├── app.module.ts
│       └── main.ts
│
├── web/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   │   ├── tasks/
│   │   │   └── ui/
│   │   ├── lib/
│   │   └── types/
│   └── .env.example
│
└── README.md
```

## Running Checks

Run these commands from their respective directories.

**Backend (`api`):**

```powershell
npm run build
```

**Frontend (`web`):**

```powershell
npm run lint
npm run build
```

## How I Used AI

I used ChatGPT as a development assistant throughout the assignment. It helped me understand the requirements, plan the application structure, work through implementation decisions, troubleshoot errors, and review the code.

I implemented and tested the application incrementally, including the API endpoints, input validation, database persistence, and frontend task management features. I also used AI assistance to review the setup instructions and prepare this documentation.