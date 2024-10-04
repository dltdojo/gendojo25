---
title: Next.js Todo Application with SQLite
date: 2024-10-27
description: A simple Todo application built with Next.js, TypeScript, Tailwind CSS, and SQLite.  Includes CRUD operations, caching, and a Dockerized environment.
keywords: Next.js, TypeScript, Tailwind CSS, SQLite, Todo, CRUD, Docker, pnpm
---

# Next.js Todo Application with SQLite

This repository demonstrates a simple Todo application built using Next.js, TypeScript, Tailwind CSS, and SQLite. It features a front-end for creating, viewing, and deleting tasks, and uses a Dockerized environment for deployment.

## Project Structure

The project is organized with the following key files and directories:

* **`package.json`**:  Manages project dependencies.
* **`init-project.sh`**: Script to initialize the Next.js application with desired configurations.
* **`Dockerfile`**: Defines the Docker image for the application.
* **`compose.yaml`**: Configures the Docker Compose setup.
* **`app/page.tsx`**: Main component for rendering the todo list and forms.
* **`app/todo/forms.tsx`**: Contains the components for adding and finding tasks.
* **`app/todo/dao.ts`**: Handles data access to the SQLite database (CRUD).
* **`app/todo/actions.ts`**: Manages server-side actions for creating, finding, and deleting tasks.


## Key Features

* **CRUD Operations:** The application supports creating, reading, updating, and deleting tasks.
* **SQLite Database:** The application uses SQLite for storing Todo data, providing a lightweight and simple database solution.
* **Tailwind CSS:** The application uses Tailwind CSS for styling, enhancing the UI's responsiveness and aesthetics.
* **TypeScript:** The application uses TypeScript for improved type safety and maintainability.
* **Dockerization:** Docker and Docker Compose are used to create a containerized environment, ensuring consistent deployment across different systems.
* **Next.js Caching:** `revalidatePath` is used to update the cached pages efficiently after a task is created or deleted, preventing outdated content.

## Running the Application

1. **Prerequisites:** Install Docker and Docker Compose.
2. **Clone the Repository:** Clone this repository to your local machine.
3. **Build the Docker Image:** Navigate to the project directory and run the following command in your terminal:
   ```bash
   docker compose build
   ```
4. **Run the Application:** Start the application with the following command:
   ```bash
   docker compose up -d
   ```
5. **Access in Browser:** Open your web browser and navigate to `http://localhost:3000` to view the Todo application.

## Example Usage


* **Adding a Task:** Enter a task title in the input field of the `TaskForm` and click "Add Task."
* **Finding a Task:** Enter a part of the task title in the `FindTaskForm` and click "Find Task."
* **Deleting a Task:** Click the "DEL" button next to a task to delete it.


## Database Structure

The SQLite database `todo.db` has a single table named `tasks` with columns for `id` (primary key, auto-increment), `title`, and `completed`.


## Further Development

* **Error Handling:** Implement more robust error handling to provide a better user experience.
* **UI Enhancements:** Improve the user interface design for a more user-friendly experience.
* **User Authentication:** Add user authentication and authorization for more advanced features.
* **Data Validation:** Implement validation to ensure the data entered is in the correct format.
* **Advanced Search:** Allow for more sophisticated search options like searching by date or status.


This detailed README provides a comprehensive overview of the Next.js Todo application, its features, and how to run it. Remember to refer to the code for specific implementation details.