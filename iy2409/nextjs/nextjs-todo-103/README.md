---
title: Next.js Todo App with SQLite and Shadcn UI
date: 2024-08-28
description: A simple todo application built with Next.js, using SQLite for persistence and Shadcn UI for a polished interface.  Includes server actions for CRUD operations.
keywords: nextjs, todo, sqlite, shadcn, ui, server actions, typescript, react
---

# Next.js Todo App with SQLite and Shadcn UI

This repository contains a simple todo application built using Next.js 14.2.14 with TypeScript, utilizing SQLite for data persistence and the Shadcn UI component library for styling.  The app demonstrates server-side actions for creating, reading, updating, and deleting todo items.

## Features

* **Next.js App Router:** Built using the latest Next.js App Router for improved performance and developer experience.
* **TypeScript:**  Written in TypeScript for enhanced type safety and maintainability.
* **SQLite:** Uses `libsql` for local database persistence.  Data is stored in `todo.db`.
* **Shadcn UI:** Leverages the Shadcn UI component library for a consistent and visually appealing user interface.  Specifically uses the `table` component.
* **Server Actions:** Implements server-side actions for handling CRUD operations, improving security and reducing client-side logic.
* **Zod:** Uses Zod for data validation.
* **Tagging System:** Allows adding and removing tags to tasks.  Searching by tag is also supported.


## Project Structure

The project is structured as follows:

* `/app`: Contains the application's pages and layouts.
    * `/app/page.tsx`: The main application page, displaying the todo list and forms.
    * `/app/todo`: Contains the logic for interacting with the todo list.
        * `/app/todo/actions.ts`: Server actions for CRUD operations and tag management.
        * `/app/todo/dao.ts`: Data access object for interacting with the SQLite database.
        * `/app/todo/forms.tsx`: Components for creating, finding, and displaying todo items including the tag management UI.
    * `/app/debug-db/page.tsx`: A debug page that displays the contents of the SQLite database as JSON, mainly for testing and development purposes.

* `/components/ui/table.tsx`:  Custom table component built using Shadcn UI primitives.
* `components.json`: Shadcn UI configuration file.
* `compose.yaml`: Docker Compose file for easy setup and development.
* `Dockerfile`: Dockerfile for building the application container.
* `init-project.sh`: Script to initialize the project.
* `package.json`: Project dependencies and scripts.


## Getting Started

1. **Clone the repository:**

   ```bash
   git clone https://github.com/YOUR_USERNAME/nextjs-todo-103.git
   ```

2. **Install dependencies:**

   ```bash
   cd nextjs-todo-103
   pnpm install
   ```

3. **Run the development server:**

   ```bash
   pnpm dev
   ```

   This will start the development server on `http://localhost:3000`.


4. **(Optional) Use Docker Compose:**

   ```bash
   docker compose up
   ```

   This will build and run the application using Docker Compose.  This simplifies the environment setup process.


## Contributing

Contributions are welcome! Please open an issue or submit a pull request.