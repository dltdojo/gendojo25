title: Deno Blog CLI Application
date: 2024-10-20
description: A simple command-line interface (CLI) blog application built with Deno, demonstrating persistent storage with SQLite.
keywords: deno, cli, blog, sqlite, typescript, crud
---

# Deno Blog CLI

This project demonstrates a basic blog application built using Deno, featuring a command-line interface for creating, viewing, and deleting blog posts. Data persistence is achieved using an embedded SQLite database.

## Features

- **Create Blog Posts:**  Add new blog posts with a title and content.
- **View Blog Posts:** Retrieve a specific blog post by its ID or view all existing posts.
- **Delete Blog Posts:** Remove existing blog posts by ID.
- **Persistent Storage:** Blog data is stored in an SQLite database file (`blog.db`), ensuring data is preserved between sessions.

## Technologies Used

- **Deno:** The runtime environment for executing the application.
- **TypeScript:** The programming language used for development.
- **SQLite:** The embedded database for data storage.
- **`@db/sqlite`:**  Deno module for SQLite interaction.
- **`@std/testing`:** Deno's standard testing module.
- **`@std/expect`:** Deno's standard assertion library.


## Setup and Usage

1. **Clone the repository:**

   ```bash
   git clone https://github.com/blue-light/llm24/tree/main/deno-dojo/catalog/blog-100  # Updated URL for direct access
   cd blog-100
   ```

2. **Run the application:**

   ```bash
   deno task dojo:run
   ```

3. **Follow the on-screen prompts:**
   - Choose from the menu options to interact with the blog.

4. **Running Tests:**

    ```bash
    deno task dojo:test
    ```
5. **Building and Running with Docker:**

    ```bash
    deno task dojod:build
    deno task dojod:run
    ```

## Code Structure

- **`blog.ts`:** The main entry point for the CLI application. Handles user interaction and menu logic.
- **`blog-dao.ts`:** Contains the `BlogDAO` class, which provides an abstraction layer for interacting with the SQLite database. Handles CRUD operations for blog posts.
- **`blog-dao.test.ts`:** Unit tests for the `BlogDAO` class.
- **`testlib.ts`:** Helper file for importing testing modules.
- **`deno.json`:** Deno configuration file, including tasks, imports, and permissions.
- **`Dockerfile.dojo`:** Dockerfile for building and running the application in a Docker container.
- **`.dockerignore`:**  File specifying files and directories to exclude when building the Docker image.


## Future Enhancements

- **Search functionality:** Allow searching blog posts by keywords.
- **Editing blog posts:** Implement functionality to update existing posts.
- **More sophisticated UI:** Consider using a terminal UI library for a richer user experience.
- **User authentication:**  Add user accounts and access control.


## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.