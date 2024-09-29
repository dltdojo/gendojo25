---
title: Todo CLI Application with Better-SQLite3 and TypeScript
date: 2024-10-27
description: A command-line interface (CLI) todo application built with Node.js, TypeScript, and Better-SQLite3, demonstrating basic CRUD operations and database interaction.
keywords: nodejs, typescript, sqlite, better-sqlite3, cli, todo, crud, docker, docker compose
---

# Todo CLI Application

This project implements a simple todo list application using Node.js, TypeScript, and Better-SQLite3 for database management. It provides a command-line interface (CLI) for interacting with the application.

## Features

- **Add tasks:** Add new tasks to the todo list.
- **List tasks:** View all current tasks, marked with 'x' for completed tasks.
- **Mark as completed:** Mark a task as completed by its ID.
- **Delete task:** Delete a task by its ID.
- **Find task by ID:** Retrieve a specific task by its ID.
- **Find task by title:** Search for tasks by title (partial matches allowed).
- **Persistent storage:** Tasks are stored in a SQLite database using Better-SQLite3, ensuring data persistence between sessions.

## Running the Application with Docker

This application is designed to run within a Docker container.  Follow these steps:

1. **Clone the repository:**
   ```bash
   git clone <repository_url>
   ```

2. **Navigate to the project directory:**
   ```bash
   cd todo-better-sqlite3-ts
   ```

3. **Build and run the Docker container:**
   ```bash
   docker compose run --rm app101
   ```
   This command builds the image (if necessary), starts the container, and removes it after execution. The `app101` service is defined in the `compose.yaml` file.  Inside the container, the `index.ts` file is executed using Node.js with the `--experimental-strip-types` flag.


## Code Structure

- **`index.ts`:** The main entry point of the application. Handles user interaction via the command line and utilizes the `dao.ts` module for database operations.
- **`dao.ts`:** The Data Access Object (DAO). Contains functions for interacting with the SQLite database (creating the table, adding, retrieving, updating, and deleting tasks). Uses the `better-sqlite3` library.
- **`Dockerfile`:** Defines the Docker image for the application, based on Node.js 22.9. Installs project dependencies.
- **`compose.yaml`:**  Docker Compose file for orchestrating the application's services.  Defines the `app101` service, which builds and runs the application.  Mounts `dao.ts` and `index.ts` as read-only volumes into the container.
- **`package.json`:**  Contains project metadata and dependencies, including `better-sqlite3`.


## Development

The application uses TypeScript for improved type safety and maintainability.  The `Dockerfile` handles the installation of the required dependencies.

## Future Improvements

- Implement more sophisticated search functionality.
- Add support for due dates and priorities.
- Improve error handling and user feedback.
- Implement a web-based user interface.