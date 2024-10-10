---
title: "Todo CLI Application with SQLite"
date: "2024-10-04"
description: "A command-line todo application built with TypeScript, better-sqlite3, and Zod for type safety"
keywords: typescript, sqlite, libsql, cli, todo, zod, docker, node.js
---

# Todo CLI Application

A robust command-line todo application built with TypeScript and SQLite, featuring type-safe database operations and Docker support.

## Features

- Command-line interface for todo management
- SQLite database with WAL mode for better concurrent access
- Type-safe database operations using Zod schema validation
- JSON support for task tags
- Docker containerization
- Timestamps for task creation and updates

## Prerequisites

- Node.js >= 22.9
- pnpm (Package manager)
- Docker (optional, for containerized usage)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd todo-better-sqlite3-json
```

2. Install dependencies:
```bash
pnpm install
```

## Usage

### Local Development

Run the CLI application:
```bash
pnpm cli
```

### Docker

Run the application in a container:
```bash
pnpm docker
```

## CLI Commands

The application provides the following commands through an interactive menu:

1. List all tasks
2. Add new task
3. Mark task completed
4. Delete task
5. Find task by ID
6. Find tasks by title
7. Add tag to task
8. Remove tag from task
9. Find tasks by tag
10. Exit

## Project Structure

- `index.ts` - Main CLI application
- `dao.ts` - Data Access Object for SQLite operations
- `Dockerfile` - Docker configuration
- `compose.yaml` - Docker Compose configuration
- `package.json` - Project dependencies and scripts

## Technical Details

### Database Schema

```sql
CREATE TABLE tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  completed INTEGER DEFAULT 0,
  tags JSON,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

### Type Safety

The application uses Zod for runtime type validation:

```typescript
export const taskSchema = z.object({
  id: z.number().positive().int(),
  title: z.string().min(1),
  completed: z.boolean(),
  tags: z.array(z.string()).nullable(),
  createdAt: z.date(),
  updatedAt: z.date()
});
```

### Docker Support

The application includes Docker configuration for easy deployment:

```yaml
services:
  app101:
    build:
      context: .
      dockerfile: Dockerfile
    working_dir: /app
    command: 
      - pnpm
      - cli
    volumes:
      - ./dao.ts:/app/dao.ts:ro
      - ./index.ts:/app/index.ts:ro
```

## Requirements

- Node.js
- libsql
- zod

## Development

To extend or modify the application:

1. The `TaskDAO` class in `dao.ts` handles all database operations
2. The `TodoCLI` class in `index.ts` manages the command-line interface
3. Type definitions and schema validation are centralized in `dao.ts`

## Notes

- The application uses SQLite's WAL mode for improved concurrent access
- Task tags are stored as JSON in the SQLite database
- Automatic timestamp updates are handled through SQLite triggers
- The Docker configuration mounts source files as read-only volumes