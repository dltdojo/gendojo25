---
title: Todo CLI Application with Better-SQLite3
date: 2024-09-28
description: A simple command-line interface (CLI) todo application built with Node.js and Better-SQLite3 for data persistence.
keywords: nodejs, sqlite, cli, todo, better-sqlite3, docker, docker compose
---

# Todo CLI Application

This application provides a basic command-line interface for managing a todo list. It utilizes Node.js and the Better-SQLite3 library for efficient database interaction.  The application is containerized using Docker for easy deployment.

## Features

- List all tasks (showing completion status)
- Add new tasks
- Mark tasks as completed
- Delete tasks
- Persistent storage using SQLite

## Installation and Usage

1. **Clone the repository:**

   ```bash
   git clone https://github.com/YOUR_USERNAME/todo-better-sqlite3.git  # Replace with your repository URL
   cd todo-better-sqlite3
   ```

2. **Build the Docker image:**

   ```bash
   docker compose build
   ```

3. **Run the application:**

   ```bash
   docker compose run --rm app101
   ```

4. **Interact with the CLI menu:** Follow the on-screen prompts to manage your tasks.


## Code Structure

- **`index.js`:** The main entry point of the application. Handles user interaction, menu display, and calls DAO functions.
- **`dao.js`:** The Data Access Object (DAO) responsible for interacting with the SQLite database. Contains functions for creating the database, adding, retrieving, updating, and deleting tasks.
- **`Dockerfile`:** Defines the Docker image for the application, based on `node:22.9`. Installs the required Node.js packages.
- **`compose.yaml`:** The Docker Compose file for orchestrating the application's services. Mounts the necessary files into the container.
- **`package.json`:** Contains project metadata and dependencies, including `better-sqlite3`.


## Database

The application uses an SQLite database named `todo.db` to store tasks. The `dao.js` file handles database creation and all interactions. Write-Ahead Logging (WAL) is enabled for improved performance.

The `tasks` table has the following schema:

| Column    | Type    | Description                                |
| --------- | ------- | ------------------------------------------ |
| `id`      | INTEGER | Unique task ID (auto-incrementing)          |
| `title`   | TEXT    | Task title (required)                      |
| `completed`| INTEGER | Completion status (0: incomplete, 1: complete) |


## Dependencies

- `better-sqlite3`: A fast and simple SQLite3 library for Node.js.
- `node:readline`:  Built-in Node.js module for reading user input from the command line.

## Contributing

Contributions are welcome!  Please feel free to submit issues and pull requests.
