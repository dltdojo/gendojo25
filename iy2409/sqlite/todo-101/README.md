---
title: Todo CLI Application with TypeScript, SQLite, and Docker
date: 2024-10-11
description: A command-line interface (CLI) application for managing tasks, built with TypeScript, SQLite, and Docker.  It features comprehensive task management capabilities including adding, updating, completing, deleting, searching, and tagging tasks.
keywords: typescript, sqlite, docker, cli, todo, task management, libsql, zod, nodejs
---

# Todo CLI Application

This project implements a Todo CLI application using TypeScript, SQLite, and Docker. It provides a simple and efficient way to manage tasks from your terminal.

## Features

* **Add tasks:** Create new tasks with titles.
* **Update tasks:** Modify existing task titles, completion status, and tags.
* **Complete tasks:** Mark tasks as completed.
* **Delete tasks:** Remove tasks.
* **Find tasks by ID:** Retrieve a specific task using its ID.
* **Find tasks by title:** Search for tasks based on their titles.
* **Tagging:** Add and remove tags from tasks for better organization.
* **Find tasks by tag:** Search for tasks associated with specific tags.
* **Persistent storage:** Uses an SQLite database to store tasks persistently.
* **Dockerized environment:** Runs within a Docker container for easy deployment and portability.
* **Input validation:** Uses Zod for schema validation ensuring data integrity.
* **Unit tests:** Includes comprehensive unit tests using Vitest.

## Technologies Used

* **TypeScript:** For type safety and improved code maintainability.
* **SQLite:** A lightweight and embedded database for storing tasks.  Uses the `libsql` npm package, a WASM-based SQLite client for Node.js.
* **Docker:** For containerization and environment consistency.
* **Node.js:** The runtime environment.
* **pnpm:** Package manager.
* **Zod:** Schema validation library for ensuring data integrity.
* **Vitest:** Unit testing framework.

## Getting Started

1. **Initialize the project:**

   ```bash
   ./init-project.sh
   ```

2. **Run the application using Docker:**

   ```bash
   pnpm docker 
   ```

Alternatively, you can run directly with node after initializing the project:

```bash
pnpm cli
```

## Usage

The application presents a menu-driven interface with options to perform various task management operations. Follow the prompts to interact with the CLI.

## Development

### Running Tests

```bash
pnpm test
```

### Building the Docker Image

```bash
docker compose build
```

## Project Structure

* **`compose.yaml`:** Docker Compose configuration for the application.
* **`dao.ts`:** Data Access Object (DAO) for interacting with the SQLite database.
* **`dao.test.ts`:** Unit tests for the DAO.
* **`Dockerfile`:** Dockerfile for building the application image.
* **`index.ts`:** Main entry point for the CLI application.
* **`init-project.sh`:**  Script to initialize the project and install dependencies.
* **`package.json`:** Project configuration and dependencies.

## Contributing

Contributions are welcome!  Please open an issue or submit a pull request.