---
title: "Todo CLI Application with libSQL and Zod"
date: 2024-09-30
description: "A simple command-line todo application built with Node.js, libSQL for database management, and Zod for data validation."
keywords: Node.js, TypeScript, CLI, Todo, SQLite, libSQL, Zod, Data Validation, Docker, Docker Compose
---

# Todo CLI Application

This is a basic command-line interface (CLI) application for managing a todo list. It's built using Node.js, TypeScript, libSQL for efficient database interactions, and Zod for robust data validation.

## Features

- **Add tasks:** Add new tasks to your todo list.
- **List tasks:** View all tasks, including their completion status.
- **Mark as completed:** Mark tasks as done.
- **Delete tasks:** Remove tasks from your list.
- **Find by ID:** Search for a specific task using its unique ID.
- **Find by title:** Search for tasks by title, supporting partial matches.

## Technologies Used

- **Node.js:** JavaScript runtime environment for server-side development.
- **TypeScript:** Superset of JavaScript that adds static typing for improved code quality and maintainability.
- **libSQL:** Fast and efficient SQLite3 library for Node.js.
- **Zod:** TypeScript-first schema validation library for ensuring data integrity.
- **Docker:** Containerization platform for easy deployment and environment consistency.

## Project Structure

- **`compose.yaml`:** Docker Compose configuration for running the application in a container.
- **`dao.ts`:** Data Access Object (DAO) that handles interactions with the SQLite database.
- **`Dockerfile`:** Instructions for building the Docker image.
- **`index.ts`:** Main entry point of the application, handles user interaction and logic.
- **`package.json`:** Project metadata and dependencies.

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/todo-better-sqlite3-zod.git
   cd todo-better-sqlite3-zod
   ```

2. **Build and run the Docker container:**
   ```bash
   docker compose run --rm app101
   ```

3. **Use the CLI menu:**
   Follow the prompts in the command line to interact with the application.

## Data Validation with Zod

Zod is used to define schemas for the task objects, ensuring that data entering and leaving the database conforms to the expected structure. This helps prevent errors and improves the reliability of the application.

## Database Interaction with libSQL

libSQL provides a simple and performant way to interact with the SQLite database. The `dao.ts` file encapsulates all database operations, making the code more organized and easier to maintain.

## Dockerization

The application is containerized using Docker, making it easy to run in different environments without worrying about dependencies or system configurations. The `Dockerfile` and `compose.yaml` files handle the build and deployment process.

## Contributing

Contributions are welcome! Feel free to open issues or pull requests if you have any suggestions, bug reports, or feature requests.
