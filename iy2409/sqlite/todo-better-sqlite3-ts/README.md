---
title: Todo CLI Application with Better SQLite3 and TypeScript
date: 2024-10-27
description: A simple command-line interface (CLI) todo application built with Node.js, TypeScript, and Better SQLite3.  This application demonstrates basic CRUD operations (Create, Read, Update, Delete) for managing tasks.
keywords: nodejs, typescript, sqlite, better-sqlite3, cli, todo, crud
---

# Todo CLI Application

This project implements a basic Todo CLI application using Node.js, TypeScript, and Better SQLite3 for data persistence. It allows users to manage their tasks through a simple interactive menu.

## Features

- List all tasks
- Add new tasks
- Mark tasks as completed
- Delete tasks

## Getting Started

### Prerequisites

- Docker: Make sure you have Docker installed on your system.

### Running the Application

1. Clone the repository:

```bash
git clone <repository_url>
```

2. Navigate to the project directory:

```bash
cd todo-better-sqlite3-ts
```

3. Build and run the Docker container:

```bash
docker compose run --rm app101
```

This command will build the Docker image (if not already built) and then run the application within a container. The `--rm` flag automatically removes the container after it exits.

## Usage

Once the application is running, you'll be presented with a menu:

```
--- Todo CLI Menu ---
1. List all tasks
2. Add a new task
3. Mark task as completed
4. Delete a task
5. Exit
Enter your choice: 
```

Follow the prompts to interact with the application.

## Implementation Details

- **Data Access Object (DAO):** The `dao.ts` file provides an abstraction layer for interacting with the SQLite database using Better SQLite3. It handles database initialization, and provides functions for CRUD operations on tasks.

- **Command-line Interface:** The `index.ts` file handles user interaction through the command line, using the `readline` module. It displays the menu, takes user input, and calls the appropriate DAO functions.

- **Docker:** The `Dockerfile` and `compose.yaml` files define the Docker environment for the application. The Dockerfile sets up a Node.js environment and installs the required dependencies. The `compose.yaml` file orchestrates the build and run process, mounting the source code into the container.  The `--experimental-strip-types` flag is used in the `compose.yaml` to allow Node.js to run the TypeScript files directly.

- **TypeScript:** The application is written in TypeScript, providing type safety and improved code maintainability.

## Future Improvements

- Implement more sophisticated task management features (e.g., due dates, priorities).
- Add error handling and input validation.
- Implement unit tests.
- Explore alternative UI options (e.g., web interface).