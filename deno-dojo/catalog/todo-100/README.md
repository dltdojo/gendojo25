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
* **Persistent storage:** Tasks are stored in an SQLite database.
* **Unit tested:**  Includes comprehensive unit tests using Deno's built-in testing capabilities and the `@std/testing` module.


## Technical Details

* **Deno:** The runtime environment used for this project.
* **SQLite:**  The database used for storing tasks.  An in-memory database is used for testing.
* **Data Access Object (DAO):**  The `TaskDAO` class encapsulates database interactions.
* **Testing:** Unit tests are implemented using `@std/testing/bdd` (describe, it, beforeEach, afterEach) and `@std/expect` for assertions.


## Getting Started

1. **Prerequisites:** Ensure you have Deno installed on your system.

2. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/your-repository-name # Replace with your repository URL
   cd your-repository-name
   ```

3. **Run the development server:**

   ```bash
   deno task dev 
   ```

   This command will start a development server (assuming you have a `main.ts` file that utilizes the `TaskDAO`).  The `--watch` flag automatically restarts the server when changes are detected.

4. **Run the tests:**

   ```bash
   deno task dojo:test
   ```

   This executes the unit tests defined in `todo-dao.test.ts`.


## Project Structure

* `deno.json`:  Deno configuration file, including tasks and import maps.
* `testlib.ts`:  Helper file for importing testing utilities.
* `todo-dao.ts`: Contains the `TaskDAO` class, responsible for database interactions.
* `todo-dao.test.ts`: Unit tests for the `TaskDAO` class.
* `main.ts`: (Not included in the provided code, but assumed to exist) Entry point for your application.


## Future Enhancements

* **User interface:** Implement a user interface (e.g., web, command-line) for interacting with the to-do list.
* **Search/filtering:** Add functionality to search and filter tasks.
* **Due dates:**  Include support for task due dates.


## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues.