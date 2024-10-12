---
title: "Todo CLI Application with Deno, TypeScript, and SQLite"
date: 2024-07-26
description: A command-line interface (CLI) application built with Deno, TypeScript, and SQLite for managing a todo list.  Features include adding, completing, deleting, searching, and tagging tasks.
keywords: deno, typescript, sqlite, todo, cli, command-line, database, application
---

# Todo CLI Application with Deno, TypeScript, and SQLite

This repository contains a simple yet functional todo list application built using Deno, TypeScript, and SQLite.  The application provides a command-line interface (CLI) for interacting with a SQLite database to manage tasks.

## Features

* **Add new tasks:** Create new todo items with titles.
* **Mark tasks as complete:** Toggle the completion status of existing tasks.
* **Delete tasks:** Remove completed or unwanted tasks.
* **Find tasks by ID:** Retrieve a specific task using its unique ID.
* **Find tasks by title:** Search for tasks containing a specific keyword in their title.
* **Add tags to tasks:** Assign tags to tasks for organization and filtering.
* **Remove tags from tasks:**  Remove tags from tasks.
* **Find tasks by tag:**  Retrieve tasks associated with a particular tag.
* **Clean shutdown:** Ensures proper closure of the database connection upon exit.

## Technologies Used

* **Deno:**  A modern runtime for JavaScript and TypeScript.
* **TypeScript:**  Provides static typing and improved code maintainability.
* **SQLite:**  A lightweight, serverless embedded database.
* **`@db/sqlite`:** Deno package for interacting with SQLite databases.
* **Zod:**  Schema validation for ensuring data integrity.
* **Docker:** Containerization for easy deployment and reproducibility.

## Getting Started

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/yourrepo.git
   cd yourrepo
   ```

2. **Install dependencies (if not using Docker):**

   ```bash
   ./init-project.sh
   ```
   This script installs the `@db/sqlite` and `zod` dependencies using Deno.

3. **Run the application (without Docker):**

   ```bash
   deno run --allow-all index.ts
   ```
   (Replace `--allow-all` with more specific permissions if desired.  At minimum, `--allow-read` and `--allow-write` are needed).


4. **Run the application using Docker Compose:**

   This approach is recommended for easier reproducibility and dependency management.  First, make sure you have Docker and Docker Compose installed. Then, run the following commands:


   ```bash
   docker compose run --rm app101 # Run the application
   ```

   The Dockerfile uses a Deno base image and handles dependency installation within the container.  The `compose.yaml` file simplifies the setup.

## Project Structure

* **`compose.yaml`:** Docker Compose configuration file.
* **`dao.ts`:** Data Access Object (DAO) for database interactions.
* **`deno.json`:**  Deno configuration file specifying dependencies.
* **`Dockerfile`:** Docker build instructions.
* **`index.ts`:** Main application logic for the CLI.
* **`init-project.sh`:** Script to install dependencies (used when running outside docker).

## Contributing

Contributions are welcome! Please feel free to open issues or submit pull requests.


Remember to replace `"yourusername/yourrepo"` with the actual GitHub repository URL.  This README provides a comprehensive overview of the project.  You might want to add screenshots or more detailed explanations depending on your needs.