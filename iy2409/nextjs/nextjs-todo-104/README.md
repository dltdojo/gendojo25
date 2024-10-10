---
title: Next.js Todo App with libsql and Shadcn/UI
date: 2024-07-27
description: This project demonstrates a simple todo application built with Next.js 14 App Router, TypeScript, Tailwind CSS, libsql for local database persistence, and Shadcn/UI for styling.
keywords: next.js, typescript, tailwindcss, libsql, shadcn/ui, todo app, crud, database, server actions
---

# Next.js Todo App

This is a simple todo application built with Next.js 14 using the App Router, TypeScript, and Tailwind CSS. It uses `libsql` for local data persistence and `zod` for schema validation. The UI is styled using components from `shadcn/ui`.

## Features

- **Create, Read, Update, Delete (CRUD) operations:** Manage tasks with basic CRUD functionality.
- **Local database:** Uses `libsql` for persistent storage of tasks.
- **Server actions:** Leverages Next.js server actions for handling data interactions.
- **Client-side rendering:** Uses `use client` directive for client-side rendering of interactive components.
- **Tagging:** Add and remove tags to tasks for better organization.
- **Search:** Find tasks by title or tag.
- **UI:** Utilizes `shadcn/ui` components for a consistent and modern look.

## Getting Started

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/nextjs-todo-104.git
   ```

2. **Install dependencies:**

   ```bash
   cd nextjs-todo-104
   pnpm install
   ```

3. **Run the development server:**

   ```bash
   pnpm dev
   ```

4. **Access the application:** Open your browser and navigate to `http://localhost:3000`.

## Docker Instructions

This project includes a `Dockerfile` and `compose.yaml` for easy deployment with Docker.

1. **Build the image:**

   ```bash
   docker compose build
   ```

2. **Run the container:**

   ```bash
   docker compose up
   ```

The application will be accessible at `http://localhost:3000`.

## Code Overview

- **`app/todos/page.tsx`:** Main page displaying the todo list, new task form, and task table.
- **`app/todos/todo-actions.ts`:** Server actions for handling CRUD operations and tag management.
- **`app/todos/todo-dao.ts`:** Data Access Object (DAO) for interacting with the SQLite database. Includes schema definitions and data transformation logic using `zod`.
- **`app/todos/todo-ui.tsx`:** UI components for the todo app, including forms, buttons, lists, tables and tag management.
- **`app/app-ui.tsx`:**  Contains the app's menu bar component.
- **`app/layout.tsx`:** Main layout component, including font imports and menu bar.
- **`app/page.tsx`:** Homepage with links to other sections of the application.
- **`app/todos/[slug]/page.tsx`:**  Dynamic route for updating tasks and displaying debug information.
- **`compose.yaml`:** Docker Compose configuration file.
- **`Dockerfile`:** Dockerfile for building the application image.
- **`init-project.sh`:** Script for initializing the project, including creating the Next.js app and installing dependencies.
- **`package.json`:** Project configuration file, including dependencies and scripts.


## Key Technologies

- **Next.js 14 (App Router):**  Framework for building server-rendered React applications.
- **TypeScript:**  Static type checker for JavaScript.
- **Tailwind CSS:** Utility-first CSS framework for rapid UI development.
- **libsql:** Fast and simple SQLite3 library for Node.js.
- **zod:** TypeScript-first schema validation with static type inference.
- **Shadcn/UI:**  React UI components.


## Contributing

Contributions are welcome! Please feel free to open issues and submit pull requests.