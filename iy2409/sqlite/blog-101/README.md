---
title: Blog 101 - Simple Blog CLI Application with SQLite and TypeScript
date: 2024-10-12
description: A basic command-line interface (CLI) application for managing blog posts, built with TypeScript, Node.js, and SQLite.  This project demonstrates how to interact with a SQLite database using libsql and provides a simple text-based interface for creating, reading, updating, and deleting blog posts.
keywords: typescript, nodejs, sqlite, cli, blog, crud, libsql, docker, zod
---

# Blog 101: Simple Blog CLI Application

This project implements a basic blog management application using a command-line interface (CLI). It's built with TypeScript, Node.js, and SQLite, providing a practical example of how to interact with a database and implement CRUD (Create, Read, Update, Delete) operations.

## Features

* **Create Posts:** Add new blog posts with titles and content.
* **Read Posts:** List all posts, or view a specific post by ID.
* **Update Posts:** Modify existing post titles and content.
* **Delete Posts:** Remove posts from the blog.
* **Persistent Storage:** Blog data is stored in a SQLite database file (blog.db).
* **Dockerized Environment:**  The application can be run within a Docker container for easy setup and portability.
* **Input Validation:** Uses Zod for schema validation, ensuring data integrity.
* **Automated Tests:** Includes unit tests using Vitest to verify functionality.


## Getting Started

### Prerequisites

* Docker (recommended)
* Node.js and npm (if not using Docker)

### Installation and Running

1. **Using Docker (Recommended):**

   ```bash
   git clone https://github.com/yourusername/blog-101.git  # Replace with your repository URL
   cd blog-101
   ./init-project.sh
   docker compose run --rm app101
   ```

2. **Using Node.js directly:**

   ```bash
   git clone https://github.com/yourusername/blog-101.git # Replace with your repository URL
   cd blog-101
   ./init-project.sh
   npm run cli
   ```

### Usage

The CLI will present a menu with options to manage blog posts. Follow the prompts to perform different actions.

## Project Structure

* **`compose.yaml`**: Defines the Docker services for the application.
* **`Dockerfile`**: Specifies the Docker image build process.
* **`dao.ts`**: Contains the Data Access Object (`BlogDAO`) class, which handles database interactions.
* **`dao.test.ts`**: Unit tests for the `BlogDAO` class.
* **`index.ts`**: The main entry point for the CLI application.
* **`init-project.sh`**: Shell script to initialize the project and install dependencies.
* **`package.json`**: Contains project metadata and dependencies.


## Testing

Run tests using:

```bash
npm run test
```


## Contributing

Contributions are welcome!  Please feel free to submit issues and pull requests.