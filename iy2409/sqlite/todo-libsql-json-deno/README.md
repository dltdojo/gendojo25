```markdown
---
title: Todo CLI Application with Deno, SQLite, and TypeScript
date: 2024-07-25
description: A command-line interface (CLI) todo application built using Deno, SQLite, and TypeScript.  This application demonstrates using libsql and zod for database interaction and type safety.
keywords: deno, typescript, sqlite, cli, todo, libsql, zod, docker
---

# Todo CLI Application

This project implements a simple todo list application using Deno, SQLite, and TypeScript.  It leverages `libsql` for database interactions and `zod` for schema validation and type safety.  The application provides a CLI for managing tasks, including adding, listing, completing, deleting, and searching.  Tags can also be added and removed from tasks, and tasks can be searched by tag.

## Features

* Add new tasks
* List all tasks
* Mark tasks as completed
* Delete tasks
* Find tasks by ID
* Find tasks by title (partial matching)
* Add tags to tasks
* Remove tags from tasks
* Find tasks by tag
* Persistent storage using SQLite
* Type safety with TypeScript and Zod
* Easy setup and execution with Docker

## Installation and Usage

### Prerequisites

* Docker (and Docker Compose) installed on your system.

### Running with Docker Compose

1. Clone this repository:

   ```bash
   git clone https://github.com/example-project/todo-example.git
   cd sqlite/todo-libsql-json-deno
   ```

2. Build and run the application using Docker Compose:

   ```bash
   docker compose run --rm app101
   ```

This will build the Docker image, mount the necessary files, and run the `index.ts` script.  The application will present you with a menu of options to manage your tasks.

## Project Structure

* **`index.ts`:** The main entry point for the CLI application. Handles user interaction and menu logic.
* **`dao.ts`:** The Data Access Object (DAO) for interacting with the SQLite database.  Contains functions for all database operations and utilizes `zod` for schema validation.
* **`Dockerfile`:** Defines the Docker image for the application, based on the `denoland/deno:2.0.0` image.
* **`init-project.sh`:**  Installs the required Deno modules (`libsql` and `zod`).
* **`deno.json`:**  Specifies import maps for Deno, declaring dependencies on `libsql` and `zod`.
* **`compose.yaml`:** The Docker Compose file for building and running the application. Mounts the code files into the container and sets the working directory.
* **`todo.db`:** The SQLite database file (created automatically).


## Key Technologies and Libraries

* **Deno:** A secure runtime for JavaScript and TypeScript.
* **TypeScript:** A typed superset of JavaScript that adds type safety and improved code maintainability.
* **SQLite:** A lightweight, embedded SQL database engine.
* **libsql:** npm package for SQLite access from deno.
* **zod:**  A TypeScript-first schema validation with static type inference.
* **Docker:**  Platform for containerizing and running applications.
* **Docker Compose:**  Tool for defining and running multi-container Docker applications.


## Future Improvements

* Implement unit tests for the `dao.ts` module.
* Add more sophisticated search functionality (e.g., filtering by multiple tags, date ranges).
* Improve error handling and user feedback.
* Explore a web-based UI for the application.