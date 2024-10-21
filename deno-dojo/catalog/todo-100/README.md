---
title: Simple To-Do List with Deno and SQLite
date: 2024-10-20
description: This project demonstrates a simple to-do list application built using Deno and SQLite. It showcases basic CRUD operations using a Data Access Object (DAO) pattern.
keywords: deno, sqlite, todo, dao, typescript, crud, example
---

# Simple To-Do List with Deno and SQLite

This project provides a basic implementation of a to-do list application using Deno and SQLite. It utilizes a Data Access Object (DAO) pattern for interacting with the database, providing a clean separation of concerns.

## Features

* **Add tasks:** Create new to-do items with a title.
* **Mark as complete:** Mark tasks as finished.
* **Delete tasks:** Remove tasks from the list.
* **List all tasks:** View all current to-do items.
* **View a specific task:** Retrieve a task by its ID.
* **Persistent storage:** Tasks are stored in an SQLite database (`todo.db`).
* **Unit tested:**  Includes comprehensive unit tests using Deno's built-in testing capabilities and the `@std/testing` module.


## Technical Details

* **Deno:** The runtime environment used for this project.
* **SQLite:**  The database used for storing tasks. An in-memory database is used for testing, while `todo.db` is used in the main application.
* **Data Access Object (DAO):**  The `TaskDAO` class encapsulates database interactions.
* **Testing:** Unit tests are implemented using `@std/testing/bdd` (describe, it, beforeEach, afterEach) and `@std/expect` for assertions.
* **Interactive CLI:** The `todo.ts` script provides a command-line interface for interacting with the to-do list.


## Getting Started

1. **Prerequisites:** Ensure you have Deno installed on your system.

2. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/your-repository-name # Replace with your repository URL
   cd your-repository-name
   ```

3. **Run the application:**

   ```bash
   deno task dojo:run
   ```

   This command will run the `todo.ts` script, which provides an interactive command-line menu for managing tasks. The tasks are stored persistently in the `todo.db` file.


4. **Run the tests:**

   ```bash
   deno task dojo:test
   ```

   This executes the unit tests defined in `todo-dao.test.ts`.  The tests use an in-memory database to avoid conflicts with the `todo.db` file.



## Project Structure

* `deno.json`:  Deno configuration file, including tasks and import maps.
* `testlib.ts`:  Helper file for importing testing utilities.
* `todo-dao.ts`: Contains the `TaskDAO` class, responsible for database interactions.
* `todo-dao.test.ts`: Unit tests for the `TaskDAO` class.
* `todo.ts`: Entry point for the command-line application.


## Future Enhancements

* **User interface:** Implement a richer user interface (e.g., web, command-line with more advanced features) for interacting with the to-do list.
* **Search/filtering:** Add functionality to search and filter tasks.
* **Due dates:**  Include support for task due dates.


## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues.